// backend/routes/moodRoutes.js
const express = import("express");
const router = express.Router();
const { saveMood, getMoodHistory } = import("../controllers/moodController.js");
const protect = import("../middleware/authMiddleware.js");

router.post("/", protect, saveMood);
router.get("/", protect, getMoodHistory);
export default router;

module.exports = router;
