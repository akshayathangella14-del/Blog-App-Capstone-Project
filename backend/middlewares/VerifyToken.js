import jwt from "jsonwebtoken";
import { config } from "dotenv";
import { UserModel } from "../models/UserModel.js";

const { verify } = jwt;

config();

export const verifyToken = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      // GET TOKEN
      const token = req.cookies?.token;

      if (!token) {
        return res.status(401).json({
          message: "Please login first",
        });
      }

      // VERIFY TOKEN
      const decodedToken = verify(
        token,
        process.env.SECRET_KEY
      );

      // CHECK ROLE
      if (!allowedRoles.includes(decodedToken.role)) {
        return res.status(403).json({
          message: "You are not authorized",
        });
      }

      // FETCH FULL USER DATA
      const user = await UserModel.findById(
        decodedToken.id
      ).select("-password");

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      // STORE COMPLETE USER
      req.user = user;

      next();

    } catch (err) {
      res.status(401).json({
        message: "Invalid token",
      });
    }
  };
};