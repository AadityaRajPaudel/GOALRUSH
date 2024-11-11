import bcrypt from "bcrypt";
import { adduserdb } from "../database.js";
import { errorThrower } from "../utils/errorThrower.js";

export const signup = async (req, res) => {
  try {
    // we expect username, password in case of normal sign in
    const { username, password, confirmPassword } = req.body;
    if (password != confirmPassword) {
      return res.json(errorThrower("passwords dont match"));
    }
    const hashedPassword = bcrypt.hashSync(password, 10);
    const result = await adduserdb(username, hashedPassword);
    return res.status(200).json({
      success: true,
      message: result,
    });
  } catch (err) {
    return res.json(err);
  }
};

export const signin = () => {};
export const updateUser = () => {};
export const deleteUser = () => {};
