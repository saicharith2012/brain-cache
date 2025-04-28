import { Router } from "express";
import {
  addDocument,
  deleteDocument,
  getAllDocuments,
} from "../controllers/content.controllers.js";
import { authenticateUser } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/", authenticateUser, addDocument);
router.get("/", authenticateUser, getAllDocuments);
router.delete("/", authenticateUser, deleteDocument);

export default router;
