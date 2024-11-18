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

export const updateUserDB = async (userid, username, password) => {
  try {
    const result = await pool.query(
      "UPDATE users SET username=?, password=? WHERE userid=?",
      [username, password, userid]
    );
    console.log(result);
  } catch (err) {
    throw errorThrower("Problem updating the user details");
  }
};

export const deleteUserByIdDB = async (userid) => {
  try {
    // await pool.query("DELETE * FROM images WHERE postid ") tyo image jasko user delete garna lako ho
    await pool.query("DELETE * FROM users WHERE userid=?", [userid]);
    await pool.query("DELETE * FROM posts WHERE userid=?", [userid]);
    return "Successfully deleted user from database.";
  } catch (err) {
    throw errorThrower("Failed to delete user from database.");
  }
};

export const addPostDB = async (userId, title, content, imageURLs) => {
  try {
    const [post] = await pool.query(
      "INSERT INTO posts (userid, title, content) VALUES (?, ?, ?)",
      [userId, title, content]
    );
    const postId = post.insertId;
    if (imageURLs) {
      imageURLs.forEach(async (url) => {
        try {
          await pool.query(
            "INSERT INTO images (postid, imageurl VALUES (?, ?)",
            [postId, url]
          );
        } catch (err) {
          throw errorThrower("Cannot upload images to database.");
        }
      });
    }
    return getPostbyIdDB(postId);
  } catch (err) {}
};

// needs update
export const getPostsDB = async () => {
  try {
    const [posts] = await pool.query("SELECT * FROM posts"); // array of posts from posts table
    const [images] = await pool.query("SELECT * FROM images");
    // could use joins too
    const postsWithImages = posts.map((post) => {
      return {
        ...post,
        images: images.filter((image) => image.postid === post.postid),
      };
    });

    return postsWithImages;
  } catch (err) {
    throw errorThrower("Cannot get posts from database");
  }
};

export const getPostbyIdDB = async (postId) => {
  try {
    const [[result]] = await pool.query(`SELECT * FROM posts WHERE postid=?`, [
      postId,
    ]);
    return result;
  } catch (err) {
    throw errorThrower("Failed to get posts from Database.");
  }
};

export const deletePostByIdDB = async (id) => {
  try {
    await pool.query("DELETE FROM posts WHERE postid=?", [id]);
    await pool.query("DELETE FROM images WHERE postid=?", [id]);
    // await pool.query("DELETE FROM likes ...")
    return "Successfully deleted from database.";
  } catch (err) {
    throw errorThrower(err);
  }
};

export const updatePostDB = async (postId, title, content, imageURLs) => {
  try {
    await pool.query("UPDATE posts SET title=?, content=? WHERE postid=?", [
      title,
      content,
      postId,
    ]);
    // delete all images and re-insert all
    await pool.query("DELETE * FROM images WHERE postid=?", [postId]);
    imageURLs.forEach(async (url) => {
      try {
        await pool.query("INSERT INTO images (postid, imageurl VALUES (?, ?)", [
          postId,
          url,
        ]);
      } catch (err) {
        throw errorThrower("Cannot upload images to database.");
      }
    });
    return "Updated successfully from database";
  } catch (err) {
    throw errorThrower("Problem while updating post in database.");
  }
};

/*
  posts INNER JOIN images ON posts.postid = images.postid
*/

// console.log(getuserdb()); this cant be done because async function always returns a promise
