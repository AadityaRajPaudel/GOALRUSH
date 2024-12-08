import express from "express";
import { sendmail } from "../controllers/mail.controller.js";

export const mailRouter = express.Router();

mailRouter.post("/", sendmail);
