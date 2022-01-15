import express from "express";
import { requireSign } from "../middleware/index.js";
import {
	makeInstructor,
	getAccountStatus,
	currentInstructor
} from "../controllers/instructor.js";
const router = express.Router();

router.post("/make-instructor", requireSign, makeInstructor);
router.post("/get-account-status", requireSign, getAccountStatus);
router.get("/current-instructor", requireSign, currentInstructor);

export default router;
