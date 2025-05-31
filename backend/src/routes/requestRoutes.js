import { Router } from "express";
import { requestController } from "../controllers/index.js";

const router = Router();

router.post("/", requestController.addRequest);
router.get("/team/:teamId", requestController.getRequestsByTeam);
router.get("/profile/:profileId", requestController.getRequestsByProfile);
router.put("/:id/status", requestController.updateRequestStatus);
router.delete("/:id", requestController.removeRequest);

export default router; 