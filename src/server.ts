import express from "express";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import authRoutes from "./routes/auth";
import app from "./app";

dotenv.config();

// const app = express();
const prisma = new PrismaClient();

app.use(express.json());

// Routes
app.use("/auth", authRoutes);

// Example protected route (later we’ll add JWT middleware)
app.get("/protected", (req, res) => {
  res.json({
    message: "This is a protected route (TODO: add auth middleware)",
  });
});

// Global error handler
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
  }
);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
