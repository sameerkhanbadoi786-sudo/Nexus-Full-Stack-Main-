import Meeting from "../models/Meeting.js";

/**
 * Overlap rule: existing.start < newEnd AND existing.end > newStart
 * We block double-booking for organizer or any participant.
 */
const hasConflictQuery = (userIds, startTime, endTime) => ({
  $and: [
    { startTime: { $lt: endTime } },
    { endTime: { $gt: startTime } },
    {
      $or: [
        { organizer: { $in: userIds } },
        { participants: { $in: userIds } },
      ],
    },
  ],
});

export const scheduleMeeting = async (req, res) => {
  try {
    const {
      title,
      organizer,
      participants = [],
      startTime,
      endTime,
    } = req.body;
    if (!title || !organizer || !startTime || !endTime)
      return res.status(400).json({ message: "Missing fields" });

    const people = [organizer, ...participants];

    const conflict = await Meeting.findOne(
      hasConflictQuery(people, new Date(startTime), new Date(endTime))
    );
    if (conflict)
      return res.status(400).json({ message: "Meeting conflict detected" });

    const meeting = await Meeting.create({
      title,
      organizer,
      participants,
      startTime,
      endTime,
    });
    res.status(201).json(meeting);
  } catch (e) {
    res.status(500).json({ message: "Server error", error: e.message });
  }
};

export const acceptMeeting = async (req, res) => {
  try {
    const updated = await Meeting.findByIdAndUpdate(
      req.params.id,
      { status: "accepted" },
      { new: true }
    );
    res.json(updated);
  } catch (e) {
    res.status(500).json({ message: "Server error", error: e.message });
  }
};

export const rejectMeeting = async (req, res) => {
  try {
    const updated = await Meeting.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    );
    res.json(updated);
  } catch (e) {
    res.status(500).json({ message: "Server error", error: e.message });
  }
};

export const getMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find().populate(
      "organizer participants",
      "fullName email role"
    );
    res.json(meetings);
  } catch (e) {
    res.status(500).json({ message: "Server error", error: e.message });
  }
};
