import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middleware/errorHandler";
import authRouter from "./modules/auth/auth.routes";
import collegeRouter from "./modules/collegeUpload/index";
import uploadsRouter from "./modules/uploads/uploads.routes";
import healthRouter from "./modules/health/health.routes";

const app = express();

app.set("trust proxy", 1);

app.use(helmet({ contentSecurityPolicy: false }));

const allowedOrigins = (process.env.FRONTEND_ORIGINS ?? "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.get("/health", (_req, res) => { res.json({ status: "ok" }); });

const api = express.Router();
api.use("/health", healthRouter);
api.use("/auth", authRouter);
api.use("/colleges", collegeRouter);
api.use("/uploads", uploadsRouter);

app.use("/api", api);
app.use(errorHandler);

export default app;
