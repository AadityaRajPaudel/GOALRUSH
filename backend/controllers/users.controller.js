import { getusersdb, getuserdb } from "../database.js";

// get all users from db (admin only todo)
export const getusers = async (req, res) => {
  try {
    const result = await getusersdb();
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
export const getuser = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await getuserdb(id);
    res.status(200).json({
      success: true,
      message: result,
    });
  } catch (err) {
    res.json(err);
  }
};
