import jwt from "jsonwebtoken";
import { errorThrower } from "../utils/errorThrower.js";

export const verifyUser = (req, res, next) => {
  const userToken = req.cookies.access_token;
  if (!userToken) {
    const error = errorThrower("Please login to continue.");
    error.statusCode = 401;
    return next(error);
  }
  try {
    const validUser = jwt.verify(userToken, process.env.JWT_SECRET_KEY);
    if (!validUser) {
      const error = errorThrower("Unauthorized user");
      error.statusCode = 401;
      return next(error);
    }
    req.user = validUser; // now next middleware or controller will have access to the validUser using req.user
    return next();
  } catch (err) {
    return next(err);
  }
};
