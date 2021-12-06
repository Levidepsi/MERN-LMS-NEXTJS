import express from "express";
import cors from "cors";
const morgan = require("morgan");
import dotenv from "dotenv";
import authRoute from "./routes/auth.js";
import DBConn from "./db.js";

dotenv.config();

// create express app
const app = express();

// middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api", authRoute);

const PORT = process.env.PORT || 5000;
DBConn();
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
