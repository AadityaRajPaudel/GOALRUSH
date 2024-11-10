import express from "express";
import { getusers, getuser } from "../controllers/users.controller.js";

export const userRouter = express.Router();

// get all users
userRouter.get("/", getusers);

// get a single user
userRouter.get("/:userid", getuser);

// get a single user with all their details of themselves and posts - this can probably be handled individually and merged as output
