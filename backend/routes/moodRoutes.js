// backend/routes/moodRoutes.js
import express from "express";
const router = express.Router();
const { saveMood, getMoodHistory } = import("../controllers/moodController.js");
const protect = import("../middleware/authMiddleware.js");

router.post("/", protect, saveMood);
router.get("/", protect, getMoodHistory);
export default router;
