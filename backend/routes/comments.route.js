import express from "express";
import {
  postComment,
  removeComment,
} from "../controllers/comments.controller.js";

export const commentsRouter = express.Router();

commentsRouter.put("/:postid", postComment); // userid sent in body
commentsRouter.delete("/:postid", removeComment); // userid sent in body
