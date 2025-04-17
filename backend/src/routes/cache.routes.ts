import { Router } from "express";
import { createLink, shareLink } from "../controllers/cache.controllers.js";

const router = Router();

router.post("/share", createLink);
router.get("/:shareLink", shareLink);

export default router;
