import express from "express";
import cors from "cors";
const dotenv = require("dotenv").config();

import mongoose from "mongoose";
import csrf from "csurf";
import cookieParser from "cookie-parser";

const morgan = require("morgan");

import authRoute from "./routes/auth.js";
import instrucRoute from "./routes/instructor.js";
import courseRoute from "./routes/course.js";

const csrfProtection = csrf({ cookie: true });

const app = express();

mongoose.connect(process.env.MONGODB).then(() => {
	console.log(`Database connected to ${process.env.MONGODB}`);
});

// applymiddlewares
app.use(cors());
app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());
app.use(morgan("dev"));

// route
app.use("/api", authRoute);
app.use("/api", instrucRoute);
app.use("/api", courseRoute);

// csrf
app.use(csrfProtection);

app.get("/api/csrf-token", (req, res) => {
	console.log(req.csrfToken());
	res.json({ csrfToken: req.csrfToken() });
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log(`Server Listening at PORT ${PORT}`));
