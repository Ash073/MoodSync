// backend/routes/moodRoutes.js
const express = require("express");
const router = express.Router();
const { saveMood, getMoodHistory } = require("../controllers/moodController");
const protect = require("../middleware/authMiddleware");

router.post("/", protect, saveMood);
router.get("/", protect, getMoodHistory);
export default router;

module.exports = router;
