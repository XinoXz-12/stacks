import { Router } from "express";
import { memberController } from "../controllers/index.js";

const router = Router();

router.get("/:teamId", memberController.getTeamMembers);
router.get("/:teamId/:profileId", memberController.getTeamMember);
router.post("/:teamId", memberController.addTeamMember);
router.delete("/:teamId/:profileId", memberController.removeTeamMember);

export default router;
