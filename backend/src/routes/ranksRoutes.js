import express from "express";
import { ranksController } from "../controllers/index.js";

const router = express.Router();

router.get("/", ranksController.getRanksData);

export default router;
