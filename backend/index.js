import express from "express";
import "./database.js"; // run database.js
import { userRouter } from "./routes/users.route.js";

const app = express();

app.use(express.json());

app.listen(3000, () => {
  console.log("Server listening on port 3000...");
});

app.use("/users", userRouter); // middleware validate user
