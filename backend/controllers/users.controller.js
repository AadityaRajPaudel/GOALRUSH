import { getusersdb, getuserdb } from "../database.js";

// get all users from db
export const getusers = async (req, res) => {
  try {
    const result = await getusersdb();
    res.status(200).json(result);
  } catch (err) {
    return err;
  }
};

// get a single user through user id
export const getuser = (req, res) => {
  const { id } = req.params;
  return `Getting user with id ${id}`;
};
