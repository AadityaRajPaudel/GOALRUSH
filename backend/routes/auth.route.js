import express from "express";
import {
  signin,
  signup,
  updateUser,
  deleteUser,
} from "../controllers/auth.controller.js";

export const authRouter = express.Router();

// signup or post a new user
authRouter.post("/signin", signin);
authRouter.post("/signup", signup);
authRouter.put("/update", updateUser);
authRouter.delete("/delete", deleteUser);
