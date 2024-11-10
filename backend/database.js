import mysql from "mysql2";

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
    throw err;
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
    return err;
  }
};

// console.log(getuserdb()); this cant be done because async function always returns a promise
getusersdb()
  .then((users) => console.log(users))
  .catch((err) => console.log(err));
