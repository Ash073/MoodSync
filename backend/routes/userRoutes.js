// backend/routes/userRoutes.js
import express from "express";
const router = express.Router();
import { registerUser, loginUser } from "../controllers/userController.js";
import protect from "../middleware/authMiddleware.js"; // <-- import the middleware

// Controllers
router.post("/register", registerUser);
router.post("/login", loginUser);

// ✅ Add this to return the current user’s details
router.get("/me", protect, (req, res) => {
  res.json(req.user); // req.user was added by the protect middleware
});

export default router;

