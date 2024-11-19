import { postCommentDB, removeCommentDB } from "../database.js";

export const postComment = async (req, res) => {
  try {
    const { postid } = req.params;
    const { userid, comment } = req.body;
    const result = await postCommentDB(postid, userid, comment);
    res.status(200).json({
      success: true,
      message: result,
    });
  } catch (err) {
    res.status(404).json(err);
  }
};

//todo
export const removeComment = async (req, res) => {};