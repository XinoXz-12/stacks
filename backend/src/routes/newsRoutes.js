import express from "express";
const router = express.Router();

import { newsController } from "../controllers/index.js";

router.get("/", newsController.getAllNews);

export default router;
