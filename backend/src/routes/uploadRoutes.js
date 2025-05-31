import { Router } from "express";
import { uploadController } from "../controllers/index.js";

const router = Router();

router.post("/", uploadController.uploadFile);
router.delete("/:fileName", uploadController.deleteFile);

export default router;