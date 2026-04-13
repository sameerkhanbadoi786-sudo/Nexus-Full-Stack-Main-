import express from "express";
import { login, signup } from "../controller/authController.js";

const router = express.Router();

// POST /signup
router.post("/signup", signup);
router.post("/login", login);

export default router;
