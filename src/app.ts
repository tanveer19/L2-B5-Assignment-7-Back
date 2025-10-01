import express, { Application, Request, Response } from "express";
import cors from "cors";
import loginRouter from "./routes/login";
import blogsRouter from "./routes/blogs";
import adminRoutes from "./routes/admin";
const app: Application = express();

// Middleware
app.use(cors());
app.use("/api", adminRoutes);
app.use(express.json());

// Routes
app.use("/login", loginRouter);
app.use("/blogs", blogsRouter);

// Health check
app.get("/", (req: Request, res: Response) => {
  res.send("Portfolio Backend is running 🚀");
});

export default app;
