import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const signup = async (req, res) => {
  const { name, email, password, role } = req.body;
  console.log("Incoming body:", req.body);

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingUser = await User.findOne({ email });
    console.log("Existing user check:", existingUser);

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Password hashed");

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    console.log("Before save:", newUser);

    await newUser.save();
    console.log("User saved successfully");

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Server error details:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
