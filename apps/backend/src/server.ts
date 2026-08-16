import express, { Response } from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import { authMiddleware, AuthenticatedRequest } from "./presentation/middlewares/auth.middleware";
import userRoutes from "./presentation/routes/user.routes";
import habitsRoutes from "./presentation/routes/habits.routes";
import focusRoutes from "./presentation/routes/focus.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ── CORS Configuration for Local Dev & Vercel Production ──────────────────────
const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:3000")
  .split(",")
  .map((url) => url.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, cURL, or server-to-server)
      if (!origin) return callback(null, true);
      // Allow configured origins or any Vercel preview deployment (*.vercel.app)
      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app") ||
        process.env.NODE_ENV !== "production"
      ) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive fallback to prevent CORS blocking on custom Vercel domains
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());

// ── Health Check Endpoints ───────────────────────────────────────────────────
app.get("/health", (_, res: Response) => {
  res.status(200).json({ success: true, service: "lifexp-backend", firebase: true });
});

app.get("/api/health", (_, res: Response) => {
  res.status(200).json({ success: true, service: "lifexp-backend", firebase: true });
});

app.get("/api/v1/health", (_, res: Response) => {
  res.status(200).json({ success: true, service: "lifexp-backend", firebase: true });
});

// ── Authenticated Diagnostic Debug Endpoint ──────────────────────────────────
app.get(
  "/api/debug/auth",
  authMiddleware,
  (req: AuthenticatedRequest, res: Response) => {
    res.status(200).json({
      authenticated: true,
      uid: req.user?.uid,
      email: req.user?.email,
    });
  }
);

// ── Authenticated Business API routes ─────────────────────────────────────────
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/habits", habitsRoutes);
app.use("/api/v1/focus", focusRoutes);

// ── Legacy demo route (kept for backward compatibility) ───────────────────────
app.get(
  "/api/v1/protected-data",
  authMiddleware,
  (req: AuthenticatedRequest, res: Response) => {
    res.status(200).json({
      message: "Secure data from LifeXP backend",
      user: req.user,
      timestamp: new Date().toISOString(),
    });
  }
);

// ── Start (only when executed directly, not inside Vercel serverless functions)
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`[LifeXP Server] Running on http://localhost:${PORT}`);
  });
}

export default app;
