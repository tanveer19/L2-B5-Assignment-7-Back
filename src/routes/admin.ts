import { Router } from "express";
import { authMiddleware, AuthRequest } from "../middleware/auth";

const router = Router();

router.get("/admin/dashboard", authMiddleware, (req: AuthRequest, res) => {
  if (req.user && typeof req.user !== "string" && req.user.role === "ADMIN") {
    return res.json({ message: "Welcome Admin!" });
  }
  return res.status(403).json({ message: "Forbidden - Admins only" });
});

export default router;
