import express from "express";
import { requireSignin } from "../middlewares/index.js";
import { makeInstructor } from "../controller/instructor.js";

const router = express.Router();

router.post("/make-instructor", requireSignin, makeInstructor);

export default router;
