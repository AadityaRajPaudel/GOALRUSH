import express from "express";
import {
  postComment,
  removeComment,
  getComments,
} from "../controllers/comments.controller.js";

export const commentsRouter = express.Router();

commentsRouter.post("/:postid", postComment); // userid sent in body
commentsRouter.delete("/:postid", removeComment); // userid sent in body
commentsRouter.get("/:postid", getComments); // get comments for a particular post
