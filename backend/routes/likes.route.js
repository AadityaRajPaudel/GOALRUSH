import express from "express";
import { postLike, removeLike } from "../controllers/likes.controller";

const likesRouter = express.Router();

likesRouter.put("/:postid", postLike); // userid in body
likesRouter.delete("/:postid", removeLike);
