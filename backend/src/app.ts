import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import bookRoutes from "./routes/book.routes";
import authRoutes from "./routes/auth.routes";
import borrowRoutes from "./routes/borrow.routes";

dotenv.config();

const app = express();

// ✅ Proper CORS config (VERY IMPORTANT)
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://library-management-system-4x19.vercel.app",
    ],
    credentials: true,
  })
);

app.use(express.json());

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/borrow", borrowRoutes);

// ✅ Health check
app.get("/", (_req, res) => {
  res.send("Library API is running");
});

export default app;
