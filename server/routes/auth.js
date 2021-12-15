import express from "express";
import {
  login,
  register,
  logout,
  currentUser,
  sendTestEmail,
} from "../controller/auth.js";
import { requireSignin } from "../middlewares/index.js";

const router = express.Router();

// route

router.get("/currentUser", requireSignin, currentUser);
router.get("/sendEmail", sendTestEmail);
router.get("/logout", logout);
router.post("/register", register);
router.post("/login", login);

export default router;
