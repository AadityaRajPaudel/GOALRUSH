import express from "express";
import { getUsers, getUser } from "../controllers/users.controller.js";

export const userRouter = express.Router();

// get all users
userRouter.get("/", getUsers);

// get a single user
userRouter.get("/:userId", getUser);

// get a single user with all their details of themselves and posts - this can probably be handled individually and merged as output
