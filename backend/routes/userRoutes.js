// backend/routes/userRoutes.js
const express = import("express");
const router = express.Router();
const { registerUser, loginUser } = import("../controllers/userController");

router.post("/register", registerUser);
router.post("/login", loginUser);
export default router;
module.exports = router;
