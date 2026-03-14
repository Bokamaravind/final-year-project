 
 
import express from "express";
import Incident from "../models/Incident.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// List all incidents
router.get("/", auth, async (req, res) => {
  const incidents = await Incident.find().sort({ reportedAt: -1 });
  res.json(incidents);
});

// Incident details
router.get("/:id", auth, async (req, res) => {
  const incident = await Incident.findById(req.params.id);
  if (!incident) {
    return res.status(404).json({ error: "Incident not found" });
  }
  res.json(incident);
});

// Save incident (used internally if needed)
router.post("/", async (req, res) => {
  const incident = await Incident.create(req.body);
  res.json({ success: true, incident });
});

// Mark incident as action taken
router.patch("/:id/action", auth, async (req, res) => {
  const incident = await Incident.findByIdAndUpdate(
    req.params.id,
    { actionTaken: true },
    { new: true }
  );
  if (!incident) {
    return res.status(404).json({ error: "Incident not found" });
  }
  res.json({ success: true, incident });
});

// Delete incident
router.delete("/:id", auth, async (req, res) => {
  const incident = await Incident.findByIdAndDelete(req.params.id);
  if (!incident) {
    return res.status(404).json({ error: "Incident not found" });
  }
  res.json({ success: true });
});
export default router;
