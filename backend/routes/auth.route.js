import express from "express";
import {
  signin,
  signup,
  updateUser,
  deleteUser,
  logoutUser,
  addUserEmail,
  addToken,
  verifyToken,
  updatePassword,
  google,
  checkUserLoginToken,
} from "../controllers/auth.controller.js";
import { verifyUser } from "../middleware/verifyUser.js";

export const authRouter = express.Router();

// signup or post a new user
authRouter.post("/signin", signin);
authRouter.post("/signup", signup);
authRouter.post("/google", google);
authRouter.put("/update/:userid", updateUser);
authRouter.put("/addemail/:userid", addUserEmail);
authRouter.delete("/delete/:userid", deleteUser);
authRouter.delete("/logout", verifyUser, logoutUser);
// separate token required for passwordChange
authRouter.put("/addtoken/:email", addToken);
authRouter.put("/updatepw", updatePassword);
authRouter.get("/verifyToken", verifyToken);
authRouter.get("/checkuserlogintoken", verifyUser, checkUserLoginToken);
