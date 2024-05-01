import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { logger } from "./config/logger/winston.config.js";
import { ApiError } from "./utils/ApiError.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

// Error handler
app.use((err, req, res, next) => {
  logger.error(err.message);
  throw new ApiError(err.status || 500, err.message || "Internal Server Error");
});

export { app };
