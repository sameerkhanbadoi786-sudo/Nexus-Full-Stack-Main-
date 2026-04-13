import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Investor Dashboard
router.get("/investor", authMiddleware, (req, res) => {
  if (req.user.role !== "investor") {
    return res.status(403).json({ message: "Access denied" });
  }
  res.json({ message: "Welcome to Investor Dashboard" });
});

// Entrepreneur Dashboard
router.get("/entrepreneur", authMiddleware, (req, res) => {
  if (req.user.role !== "entrepreneur") {
    return res.status(403).json({ message: "Access denied" });
  }
  res.json({ message: "Welcome to Entrepreneur Dashboard" });
});

export default router;
