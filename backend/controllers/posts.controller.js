import {
  addPostDB,
  deletePostByIdDB,
  getPostbyIdDB,
  getPostsDB,
  updatePostDB,
} from "../database.js";
import fetch from "node-fetch";
import { errorThrower } from "../utils/errorThrower.js";

export const getPosts = async (req, res) => {
  try {
    const posts = await getPostsDB();
    res.status(200).json({
      success: true,
      message: posts,
    });
  } catch (err) {
    res.status(404).json(err);
  }
};

export const getPost = async (req, res) => {
  const postId = req.params.postid;
  try {
    const result = await getPostbyIdDB(postId);
    res.status(200).json({
      success: true,
      message: result,
    });
  } catch (err) {
    res.status(404).json(err);
  }
};

export const uploadPost = async (req, res) => {
  try {
    const { title, images, userid } = req.body;
    const content = req.body.content || "";
    const encodedTitle = encodeURIComponent(title);
    const sentimentRes = await fetch(
      `http://127.0.0.1:8000/title/${encodedTitle}`,
      {
        method: "GET",
      }
    );
    const sentimentResult = await sentimentRes.json();
    const result = await addPostDB(
      userid,
      title,
      content,
      images,
      sentimentResult
    );
    res.status(201).json({
      success: true,
      message: result,
    });
  } catch (err) {
    res.status(409).json(err);
  }
};

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.postid;
    // delete comments, likes and then post
    const result = await deletePostByIdDB(postId);
    res.status(200).json({
      success: true,
      message: result, // string
    });
  } catch (err) {
    res.status(400).json(err);
  }
};
export const updatePost = async (req, res) => {
  try {
    const { postid } = req.params;
    const { title, content, newImages, images } = req.body;
    const encodedTitle = encodeURIComponent(title);
    const sentimentRes = await fetch(
      `http://127.0.0.1:8000/title/${encodedTitle}`,
      {
        method: "GET",
      }
    );
    const sentimentResult = await sentimentRes.json();
    const result = await updatePostDB(
      postid,
      title,
      content,
      newImages,
      images,
      sentimentResult
    );
    res.status(201).json({
      success: true,
      message: result, // string
    });
  } catch (err) {
    res.status(400).json(err);
  }
};
