import express, { Response } from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import { authMiddleware, AuthenticatedRequest } from "./presentation/middlewares/auth.middleware";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend integration
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));

app.use(express.json());

// Public health check route
app.get("/health", (_, res: Response) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

// Protected route demonstration
app.get("/api/v1/protected-data", authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  res.status(200).json({
    message: "This is secure data retrieved from the backend API",
    user: req.user,
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`[LifeXP Server] Running on http://localhost:${PORT}`);
});
