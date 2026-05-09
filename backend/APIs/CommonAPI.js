import exp from 'express'
import { UserModel } from '../models/UserModel.js'
import { hash, compare } from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { verifyToken } from "../middlewares/VerifyToken.js"
import { config } from 'dotenv';
import { upload } from "../config/multer.js";
import { uploadToCloudinary } from "../config/cloudinaryUpload.js";
import cloudinary from "../config/cloudinary.js";

const { sign } = jwt
export const commonApp = exp.Router()
config();

// Route for register
commonApp.post("/users", upload.single("profileImageUrl"), async (req, res, next) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const newUser = req.body;

    newUser.password = await hash(newUser.password, 10);

    if (req.file) {
      console.log("Uploading to Cloudinary...");
      const result = await uploadToCloudinary(req.file.buffer);
      console.log("Cloudinary success:", result.secure_url);

      newUser.profileImageUrl = result.secure_url;
    }

    const userDoc = new UserModel(newUser);
    await userDoc.save();

    res.status(201).json({ message: "User registered successfully" });

  } catch (err) {
    console.error("ERROR IN REGISTER:", err); // 🔥 IMPORTANT
    next(err);
  }
});

// Route for Login
commonApp.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user || !(await compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!user.isUserActive) {
      return res.status(403).json({ message: "Your account is blocked by admin" });
    }

    const token = sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );

    // Keep the cookie for local/same-domain testing
    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // Set to true for Production (Render)
      sameSite: "none", // Required for cross-site (Vercel to Render)
    });

    //  Send the token in the JSON response
    res.status(200).json({
      message: "Login successful",
      token: token, // This is what the frontend needs!
      payload: user,
    });

  } catch (err) {
    res.status(500).json({ message: "error", error: err.message });
  }
});

// Route for Logout
commonApp.get("/logout", (req, res) => {
    res.clearCookie("token", { httpOnly: true, secure: false, sameSite: "lax" });
    res.status(200).json({ message: "Logout successful" });
});

// Page refresh check
commonApp.get("/check-auth", verifyToken("USER", "AUTHOR", "ADMIN"), (req, res) => {
    res.status(200).json({ message: "authenticated", payload: req.user });
});

//password change
commonApp.put("/password", verifyToken("USER", "AUTHOR", "ADMIN"), async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await UserModel.findById(req.user.id);
        
        // Verify current password
        const isMatch = await compare(currentPassword, user.password);
        if (!isMatch) return res.status(400).json({ message: "Incorrect current password" });

        // Hash and save new password
        user.password = await hash(newPassword, 10);
        await user.save();
        res.status(200).json({ message: "Password updated successfully" });
    } catch (err) {
        res.status(500).json({ message: "error", error: err.message });
    }
});
