import { Router } from "express";
import bcryptjs from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { generateToken, verifyToken } from "../utils/jwt";
import { authMiddleware, AuthRequest } from "../middleware/auth";

const prisma = new PrismaClient();
const router = Router();

/**
 * POST /auth/login
 * Login route for admin/owner
 */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const isMatch = await bcryptjs.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

  if (user.role !== "ADMIN") {
    return res.status(403).json({ error: "access denied. Admin only" });
  }

  // Generate JWT
  const token = generateToken({ userId: user.id, role: user.role });

  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

/**
 * GET /auth/me
 * Protected route to verify token and get user info
 */
router.get("/me", authMiddleware, async (req: AuthRequest, res) => {
  const userId = req.user?.userId;

  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  const user = await prisma.user.findUnique({
    where: { id: Number(userId) },
    select: { id: true, name: true, email: true, role: true },
  });

  if (!user) return res.status(404).json({ error: "User not found" });

  res.json({ user });
});

export default router;
