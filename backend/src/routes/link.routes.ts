import { Router } from "express";
import { createLink, shareLink } from "../controllers/link.controllers.js";
import { authenticateUser } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/share", authenticateUser, createLink);
router.get("/:shareLink", authenticateUser, shareLink);

export default router;
