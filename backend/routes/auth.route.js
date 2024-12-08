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
authRouter.put("/addtoken/:email", addToken);
authRouter.get("/verifyToken", verifyToken);
authRouter.put("/updatepw", updatePassword);
