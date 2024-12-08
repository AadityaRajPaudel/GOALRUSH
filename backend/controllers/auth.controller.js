import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  addTokenDB,
  addUserDB,
  addUserEmailDB,
  checkTokenExistsDB,
  createGoogleUser,
  getUserByEmailDB,
  getUserByUsernameDB,
  updatePasswordDB,
  updateUserDB,
} from "../database.js";
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

// if user adds their email for recovery
export const addUserEmail = async (req, res) => {
  const email = req.body.email;
  const userid = req.params.userid;
  try {
    const result = await addUserEmailDB(userid, email);
    res.status(200).json({
      success: true,
      message: result,
    });
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

export const addToken = async (req, res) => {
  try {
    const email = req.params.email;
    const randomToken = bcrypt.hashSync(email, 10);
    const result = await addTokenDB(email, randomToken);
    res.status(200).json({
      success: true,
      token: randomToken,
    });
  } catch (err) {
    res
      .status(404)
      .json(errorThrower("Failed to generate and add token." + err));
  }
};

export const verifyToken = async (req, res) => {
  try {
    const token = req.body.token;
    const result = await checkTokenExistsDB(token);
    res.status(200).json({
      success: true,
      message: result,
    });
  } catch (err) {
    res.status(404).json(errorThrower("Failed to verify token."));
  }
};

// update password through token, changepassword.jsx
export const updatePassword = async (req, res) => {
  try {
    const token = req.body.token;
    const { password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const result = await updatePasswordDB(token, hashedPassword);
    res.status(200).json({
      success: true,
      message: result,
    });
  } catch (err) {
    res.status(404).json(errorThrower(err));
  }
};

export const google = async (req, res) => {
  const { username, email, avatar } = req.body;
  try {
    const result = await getUserByEmailDB(email);
    if (result) {
      const token = jwt.sign({ id: result.userid }, process.env.JWT_SECRET_KEY);
      const { password: pass, ...rest } = result;
      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .json({
          success: true,
          message: rest,
        });
    } else {
      const randomPassword = Math.floor(Math.random() * 9000 + 1000).toString();
      const hashedPassword = bcrypt.hashSync(randomPassword, 10);
      // create new user with the email, username, avatar, and password
      const newUser = await createGoogleUser(
        username,
        hashedPassword,
        email,
        avatar
      );
      const token = jwt.sign(
        { id: newUser.userid },
        process.env.JWT_SECRET_KEY
      );
      const { password: pass, ...rest } = newUser;
      res.status(200).cookie("access_token", token, { httpOnly: true }).json({
        success: true,
        message: rest,
      });
    }
  } catch (err) {
    res.status(404).json(err);
  }
};
