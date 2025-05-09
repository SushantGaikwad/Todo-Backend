import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes";
import todoRoutes from "./routes/todoRoutes";
import { errorMiddleware } from "./middleware/errorMiddleware";
import dotenv from "dotenv";
import testRoutes from "./routes/testRoutes";
dotenv.config();

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: "*",
    // credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);
app.use("/api/test", testRoutes);

app.use(errorMiddleware);

export default app;
