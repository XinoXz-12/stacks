import express from "express";
import { chatController } from "../controllers/index.js";

const router = express.Router();

router.get("/last/:teamId", chatController.getLastMessageByTeam);
router.get("/:teamId", chatController.getMessagesByTeam);
router.post("/:teamId", chatController.sendMessage);

export default router;
