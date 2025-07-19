// backend/routes/moodRoutes.js
import express from "express";
import { addMood, getMoods } from "../controllers/moodController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, addMood);
router.get("/", protect, getMoods);

export default router;
