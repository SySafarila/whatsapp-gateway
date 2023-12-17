import "dotenv/config";
import jwt from "jsonwebtoken";

export const verify_token = (req, res, next) => {
  let token = req.headers.authorization;
  try {
    if (!token) {
      res.status(400);
      throw new Error("Token required!");
    }
    token = token.split("Bearer ")[1];
    // verifying token
    jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return res.json(error?.message ?? "Token invalid!");
  }
  next();
};
