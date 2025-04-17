import { Router } from "express";
import {
  addDocument,
  deleteDocument,
  getAllDocuments,
} from "../controllers/content.controllers.js";

const router = Router();

router.post("/", addDocument);
router.get("/", getAllDocuments);
router.delete("/", deleteDocument);

export default router;
