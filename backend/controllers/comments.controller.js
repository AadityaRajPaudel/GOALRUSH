import { getCommentsDB, postCommentDB, removeCommentDB } from "../database.js";

export const postComment = async (req, res) => {
  try {
    const { postid } = req.params;
    const { userid, content } = req.body;
    const result = await postCommentDB(postid, userid, content);
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

export const getComments = async (req, res) => {
  const { postid } = req.params;
  try {
    const comments = await getCommentsDB(postid);
    res.status(200).json({
      success: true,
      message: comments,
    });
  } catch (err) {
    res.status(404).json(err);
  }
};
