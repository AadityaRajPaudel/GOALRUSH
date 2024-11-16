import jwt from "jsonwebtoken";
import { errorThrower } from "../utils/errorThrower.js";

export const verifyUser = (req, res, next) => {
  const userToken = req.cookies.access_token;
  if (!userToken) {
    res.status(404).json(errorThrower("Please login to continue."));
    return;
  }
  const validUser = jwt.verify(userToken, process.env.JWT_SECRET_KEY);
  if (!validUser) {
    res.json(errorThrower("Invalid user."));
    return;
  }
  req.user = validUser; // now next middleware or controller will have access to the validUser using req.user
  next();
};
