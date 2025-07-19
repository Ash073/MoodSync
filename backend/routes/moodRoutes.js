// backend/routes/moodRoutes.js
const express = import("express");
const router = express.Router();
const { saveMood, getMoodHistory } = import("../controllers/moodController");
const protect = import("../middleware/authMiddleware");

router.post("/", protect, saveMood);
router.get("/", protect, getMoodHistory);
export default router;

module.exports = router;
