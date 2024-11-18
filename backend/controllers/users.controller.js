import {
  getUsersDB,
  getUserByIdDB,
  updateUserDB,
  deleteUserByIdDB,
} from "../database.js";

// get all users from db (admin only todo)
export const getUsers = async (req, res) => {
  try {
    const result = await getUsersDB();
    res.status(200).json({
      success: true,
      message: result,
    });
  } catch (err) {
    // err object is handled by database.js (all errors are handled at the point where they origin)
    res.json(err);
  }
};

// get a single user through user id
export const getUser = async (req, res) => {
  try {
    let id = req.params.userId;
    id = Number(id);
    const result = await getUserByIdDB(id);
    res.status(200).json({
      success: true,
      hello: "hi",
      message: result,
    });
  } catch (err) {
    res.json(err);
  }
};

export const updateUser = async (req, res) => {
  try {
    const { userid, username, password } = req.body;
    await updateUserDB(userid, username, password);
    const result = await getUserByIdDB(userid);
    res.status(200).json({
      success: true,
      message: result,
    });
  } catch (err) {
    res.status(400).json(err);
  }
};