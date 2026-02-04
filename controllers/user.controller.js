import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// GET all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "name email createdAt");
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ADMIN LOGIN
export const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    console.log(user);

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    // Check role
    if (user.role !== "superadmin")
      return res.status(403).json({ message: "Access denied" });

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      "your_jwt_secret", // replace with env variable in production
      { expiresIn: "1h" },
    );

    res.json({
      token,
      user: { name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


