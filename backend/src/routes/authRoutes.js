import express from "express";
import { authController } from "../controllers/index.js";

const router = express.Router();

router.post("/login", authController.login);
router.post("/register", authController.register);
router.post("/logout", authController.logout);
router.get("/check", authController.checkAuth);

export default router;
