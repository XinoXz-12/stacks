import express from "express";
import { teamController } from "../controllers/index.js";

const router = express.Router();

router.get("/profile/:profileId/teams", teamController.getTeamsByProfile);
router.post("/:teamId/members", teamController.addMemberToTeam);
router.post("/", teamController.createTeam);
router.get("/", teamController.getAllTeams);
router.get("/:id", teamController.getTeamById);
router.put("/:id", teamController.updateTeam);
router.delete("/:id", teamController.deleteTeam);

export default router; 