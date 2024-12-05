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

app.use(express.json());
app.use(cors());
app.use(cookieParser());
dotenv.config();

app.listen(3000, () => {
  console.log("Server listening on port 3000...");
});

app.use("/api/users", userRouter); // middleware validate user
app.use("/api/auth", authRouter);
app.use("/api/sendmail", mailRouter);
app.use("/api/posts", postRouter);
app.use("/api/likes", likesRouter);
app.use("/api/comments", commentsRouter);
app.use("/api/news", newsRouter);
