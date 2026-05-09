import exp from "express";
import { verifyToken } from "../middlewares/VerifyToken.js";
import { UserModel } from "../models/UserModel.js";

export const adminApp = exp.Router();


// GET ALL USERS & AUTHORS
adminApp.get("/users", verifyToken("ADMIN"), async (req, res) => {
  try {
    const usersList = await UserModel.find({
  role: { $ne: "ADMIN" }
});

    res.status(200).json({
      message: "Users fetched",
      payload: usersList,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error fetching users",
      error: err.message,
    });
  }
});

// BLOCK / UNBLOCK USER OR AUTHOR
adminApp.patch("/user-status", verifyToken("ADMIN"), async (req, res) => {
  try {
    const { userId, isUserActive } = req.body;

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isUserActive },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: isUserActive ? "User unblocked" : "User blocked",
      payload: updatedUser,
    });

  } catch (err) {
    res.status(500).json({
      message: "Error updating status",
      error: err.message,
    });
  }
});
