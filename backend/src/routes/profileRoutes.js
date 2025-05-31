import express from "express";
import { profileController } from "../controllers/index.js";

const router = express.Router();

router.post("/", profileController.createProfile);
router.get("/", profileController.getAllProfiles);
router.get("/:id", profileController.getProfileById);
router.get("/user/:userId", profileController.getProfilesByUser);
router.put("/:id", profileController.updateProfile);
router.delete("/:id", profileController.deleteProfile);

export default router;
