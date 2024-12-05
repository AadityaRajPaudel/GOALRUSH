import express from "express";
import { sendmail } from "../controllers/mail.controller";

export const mailRouter = express.Router();

mailRouter.post("/", sendMail);
