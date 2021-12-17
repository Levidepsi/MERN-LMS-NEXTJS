import express from "express";
import {
  login,
  register,
  logout,
  currentUser,
  forgotPassword,
  resetPassword,
} from "../controller/auth.js";
import { requireSignin } from "../middlewares/index.js";

const router = express.Router();

// route

router.get("/currentUser", requireSignin, currentUser);
router.get("/logout", logout);
router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);

router.post("/reset-password", resetPassword);

export default router;
