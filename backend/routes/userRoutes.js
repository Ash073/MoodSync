// backend/routes/userRoutes.js
import express from "express";
const router = express.Router();
const { registerUser, loginUser } = import("../controllers/userController.js");

router.post("/register", registerUser);
router.post("/login", loginUser);
export default router;
module.exports = router;
