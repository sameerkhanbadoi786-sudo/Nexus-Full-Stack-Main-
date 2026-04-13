import express from "express";
import { auth } from "../middleware/auth.js";
import {
  scheduleMeeting,
  acceptMeeting,
  rejectMeeting,
  getMeetings,
} from "../controllers/meetingController.js";

const router = express.Router();

router.post("/schedule", auth, scheduleMeeting);
router.post("/:id/accept", auth, acceptMeeting);
router.post("/:id/reject", auth, rejectMeeting);
router.get("/", auth, getMeetings);

export default router;
