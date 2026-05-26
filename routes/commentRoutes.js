import express from "express";
import { getCommentsByTask, addComment } from "../controllers/commentController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/:taskId/comments", authenticateToken, getCommentsByTask);
router.post("/:taskId/comments", authenticateToken, addComment);

export default router;
