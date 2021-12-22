import express from "express";
import cors from "cors";
const morgan = require("morgan");
import dotenv from "dotenv";
dotenv.config();
import DBConn from "./db.js";
import csrf from "csurf";
import cookieParser from "cookie-parser";
import authRoute from "./routes/auth.js";
import instructor from "./routes/instructor.js";

const csrfProtection = csrf({ cookie: true });

// create express app
const app = express();

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(cors({ origin: "http://localhost:3000" }));

app.use("/api", authRoute);
app.use("/api", instructor);

// csrf
app.use(csrfProtection);

app.get("/api/csrf-token", (req, res, next) => {
  res.json({ csrfToken: req.csrfToken() });
  next();
});

const PORT = process.env.PORT || 5000;
DBConn();
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
