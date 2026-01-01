import express from "express";
import "./database.js"; // run database.js
import { userRouter } from "./routes/users.route.js";
import { authRouter } from "./routes/auth.route.js";
import { postRouter } from "./routes/posts.route.js";
import { likesRouter } from "./routes/likes.route.js";
import { commentsRouter } from "./routes/comments.route.js";
import { newsRouter } from "./routes/news.route.js";
import { mailRouter } from "./routes/mail.route.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(express.json()); // allow backend to read json data sent from frontend via HTTP requests.
app.use(cors()); // allows any frontend (if no explicit frontends mentioned) to access this API
app.use(cookieParser()); // allows accessing cookies for middlewares to verify user
dotenv.config();

app.listen(3002, () => {
  console.log("Server listening on port 3002...");
});

app.use("/api/users", userRouter); // middleware validate user
app.use("/api/auth", authRouter);
app.use("/api/sendmail", mailRouter);
app.use("/api/posts", postRouter);
app.use("/api/likes", likesRouter);
app.use("/api/comments", commentsRouter);
app.use("/api/news", newsRouter);

// global error handling middleware that handles error (use case: verify user login token)
// global error handler middleware to catch and handle errors
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
