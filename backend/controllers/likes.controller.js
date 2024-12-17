import { likePostDB, unlikePostDB } from "../database.js";

export const postLike = async (req, res) => {
  try {
    const { postid } = req.params;
    const { userid } = req.body;
    const result = await likePostDB(postid, userid);
    res.status(201).json({
      success: true,
      message: result,
    });
  } catch (err) {
    res.status(409).json(err);
  }
};

export const removeLike = async (req, res) => {
  try {
    const { postid } = req.params;
    const { userid } = req.body;
    const result = await unlikePostDB(postid, userid);
    res.status(200).json({
      success: true,
      message: result,
    });
  } catch (err) {
    res.status(400).json(err);
  }
};
