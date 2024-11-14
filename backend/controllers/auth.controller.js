import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { addUserDB, getUserByUsernameDB } from "../database.js";
import { errorThrower } from "../utils/errorThrower.js";

export const signup = async (req, res) => {
  try {
    // we expect username, password in case of normal sign in
    const { username, password, confirmPassword } = req.body;
    if (password != confirmPassword) {
      return res.json(errorThrower("passwords dont match"));
    }
    const hashedPassword = bcrypt.hashSync(password, 10);
    const result = await addUserDB(username, hashedPassword);
    return res.status(200).json({
      success: true,
      message: result,
    });
  } catch (err) {
    // error due to database
    return res.json(err);
  }
};

export const signin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await getUserByUsernameDB(username);
    const isPasswordValid = bcrypt.compareSync(password, result.password);
    if (!isPasswordValid) {
      return res.json(errorThrower("Password is incorrect."));
    }
    const token = jwt.sign({ id: result.userid }, process.env.JWT_SECRET_KEY);
    const { password: pass, ...rest } = result; // avoid "password" variable's conflict
    return res
      .status(200)
      .cookie("access_token", token, { httpOnly: true, maxAge: 1000 * 60 * 60 })
      .json({ success: true, message: rest });
  } catch (err) {
    return res.json(err);
  }
};
export const updateUser = () => {};
export const deleteUser = () => {};

export const logoutUser = (req, res) => {
  try {
    // req.cookies.access_token accesses the cookie value which will always remain the same for a particular user due to constant jwt_secret
    res
      .status(200)
      .clearCookie("access_token", { httpOnly: true, maxAge: 0 })
      .json({
        success: true,
        message: "Logged out successfully and cookie/token cleared",
      });
  } catch (err) {
    res.json(errorThrower("Failed to logout user"));
  }
};