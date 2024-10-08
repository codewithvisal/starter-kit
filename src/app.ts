import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes";
import { errorHandler } from './utils/error';

const app = express();

// Middleware
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello World" });
});

app.get("/health", (req, res) => {
  res.status(200).json({ message: "OK" });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ message: "Not Found" });
});

export default app;