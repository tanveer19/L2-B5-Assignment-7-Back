import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware, AuthRequest } from "../middleware/auth";

const prisma = new PrismaClient();
const router = Router();

// GET /blogs - public
router.get("/", async (req, res) => {
  const blogs = await prisma.post.findMany({
    include: { author: true },
    orderBy: { createdAt: "desc" },
  });
  res.json({ data: blogs });
});

// GET /blogs/:id - public
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const blog = await prisma.post.findUnique({
    where: { id: Number(id) },
    include: { author: true },
  });
  if (!blog) return res.status(404).json({ error: "Blog not found" });
  res.json(blog);
});

// POST /blogs - private (owner only)
router.post("/", authMiddleware, async (req: AuthRequest, res) => {
  const { title, content, thumbnail, isFeatured } = req.body;

  if (req.user?.role !== "ADMIN")
    return res.status(403).json({ error: "Forbidden" });

  const newBlog = await prisma.post.create({
    data: {
      title,
      content,
      thumbnail,
      isFeatured: isFeatured || false,
      authorId: Number(req.user.userId),
    },
  });

  res.status(201).json(newBlog);
});

// DELETE /blogs/:id - private (owner only)
router.delete("/:id", authMiddleware, async (req: AuthRequest, res) => {
  const { id } = req.params;

  if (req.user?.role !== "ADMIN")
    return res.status(403).json({ error: "Forbidden" });

  const blog = await prisma.post.delete({
    where: { id: Number(id) },
  });

  res.json({ message: "Blog deleted", blog });
});

export default router;
