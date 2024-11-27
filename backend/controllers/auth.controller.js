import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { addUserDB, getUserByUsernameDB, updateUserDB } from "../database.js";
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

// receives updated user credentials object for current user
export const updateUser = async (req, res) => {
  try {
    const userid = req.params.userid;
    const { avatar, username } = req.body;
    if (req.body.password) {
      const { password } = req.body;
      const hashedPassword = bcrypt.hashSync(password, 10);
      const result = await updateUserDB(
        userid,
        username,
        avatar,
        hashedPassword
      );
      res.status(200).json({
        success: true,
        message: result,
      });
    } else {
      const result = await updateUserDB(userid, username, avatar);
      res.status(200).json({
        success: true,
        message: result,
      });
    }
  } catch (err) {
    res.status(404).json(err);
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { userid } = req.params;
    const result = await deleteUserByIdDB(userid);
    res.status(200).json({
      success: true,
      message: result,
    });
  } catch (err) {
    res.status(400).json(err);
  }
};

export const logoutUser = (req, res) => {
  try {
    res
      .status(200)
      .clearCookie("access_token", { httpOnly: true, maxAge: 0 })
      .json({
        success: true,
        message: "Logged out successfully and cookie/token cleared",
        clearedUser: req.user, // received from middleware
      });
  } catch (err) {
    res.json(errorThrower("Failed to logout user"));
  }
};
