import express from "express";
import {
  Register,
  Login,
  updateUser,
  Logout,
} from "../Controllers/auth.controllers.js";
import authMiddleware from "../Middlewares/requireAuth.middlewares.js";

const router = express.Router();

router.post("/register", Register); // Register a new user

router.post("/login", Login); // User login

router.post("/logout", authMiddleware, Logout); // User logout

router.put("/update", authMiddleware, updateUser); // Update user information

export default router;
