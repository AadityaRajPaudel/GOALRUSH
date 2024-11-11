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

export const getusersdb = async () => {
  try {
    const [[result]] = await pool.query("SELECT * FROM users");
    return result;
  } catch (err) {
    throw errorThrower("Problem fetching users data from database.");
  }
};

export const getuserdb = async (id) => {
  try {
    const [[result]] = await pool.query(
      "SELECT * FROM users WHERE userid = ?",
      [id]
    );
    return result;
  } catch (err) {
    throw errorThrower("Problem fetching this user from database.");
  }
};

export const adduserdb = async (username, password) => {
  try {
    const [result] = await pool.query(
      "INSERT INTO users (username, password) VALUES (?, ?)",
      [username, password]
    );
    const newUserid = result.insertId;
    return getuserdb(newUserid);
  } catch (err) {
    throw errorThrower("Problem adding user to database.");
  }
};

// console.log(getuserdb()); this cant be done because async function always returns a promise
