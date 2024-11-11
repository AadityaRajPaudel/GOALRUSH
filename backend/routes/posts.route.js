import express from "express";
import {
  getPosts,
  getPost,
  uploadPost,
  deletePost,
  updatePost,
} from "../controllers/posts.controller.js";

export const postRouter = express.Router();

postRouter.get("/", getPosts);
postRouter.get("/:postid", getPost);
postRouter.post("/upload", uploadPost);
postRouter.delete("/:postid", deletePost);
postRouter.put("/:postid", updatePost);
