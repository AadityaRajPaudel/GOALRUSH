import mysql from "mysql2";
import { errorThrower } from "./utils/errorThrower.js";

export const pool = mysql
  .createPool({
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "goalrush",
  })
  .promise();

pool
  .getConnection()
  .then(() => {
    console.log("Connected to database.");
  })
  .catch((err) => {
    console.log(err);
  });

export const getUsersDB = async () => {
  try {
    const [[result]] = await pool.query("SELECT * FROM users");
    return result;
  } catch (err) {
    throw errorThrower("Problem fetching users data from database.");
  }
};

export const getUserByIdDB = async (id) => {
  try {
    const [[result]] = await pool.query(
      "SELECT * FROM users WHERE userid = ?",
      [id]
    );
    return result;
  } catch (err) {
    throw errorThrower("Problem fetching this user with id from database.");
  }
};

export const getUserByUsernameDB = async (username) => {
  try {
    const [[result]] = await pool.query(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );
    return result;
  } catch (err) {
    throw errorThrower("Problem getting user from database using username.");
  }
};

export const addUserDB = async (username, password) => {
  try {
    const [result] = await pool.query(
      "INSERT INTO users (username, password) VALUES (?, ?)",
      [username, password]
    );
    const newUserid = result.insertId;
    return getUserByIdDB(newUserid);
  } catch (err) {
    throw errorThrower("Problem adding user to database.");
  }
};

// console.log(getuserdb()); this cant be done because async function always returns a promise
