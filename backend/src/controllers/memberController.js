import { Team, Profile } from "../models/index.js";
import { errorResponse } from "../helpers/functions.js";

// Obtener todos los miembros de un equipo
const getTeamMembers = async (req, res) => {
    try {
        const { teamId } = req.params;

        const team = await Team.findById(teamId).populate({
            path: "members",
            populate: { path: "user_id", select: "age" },
        });

        if (!team)
            return errorResponse(
                res,
                "#MemberController# #getTeamMembers# Equipo no encontrado",
                404
            );

        res.json(team.members);
    } catch (error) {
        errorResponse(
            res,
            "#MemberController# #getTeamMembers# Error al obtener miembros",
            500,
            error
        );
    }
};

// Añadir un miembro a un equipo
const addTeamMember = async (req, res) => {
    try {
        const { teamId } = req.params;
        const { profileId } = req.body;

        const [team, profile] = await Promise.all([
            Team.findById(teamId),
            Profile.findById(profileId),
        ]);

        if (!team)
            return errorResponse(
                res,
                "#MemberController# #addTeamMember# Equipo no encontrado",
                404
            );
        if (!profile)
            return errorResponse(
                res,
                "#MemberController# #addTeamMember# Perfil no encontrado",
                404
            );

        const isAlreadyMember = team.members.some(
            (id) => id.toString() === profileId
        );
        if (isAlreadyMember) {
            return res.status(200).json({
                success: true,
                message: "Ya es miembro del equipo",
                team,
            });
        }

        team.members.push(profileId);
        await team.save();

        res.status(201).json({
            success: true,
            message: "Miembro añadido",
            team,
        });
    } catch (error) {
        errorResponse(
            res,
            "#MemberController# #addTeamMember# Error al añadir miembro",
            500,
            error
        );
    }
};

// Eliminar un miembro de un equipo
const removeTeamMember = async (req, res) => {
    try {
        const { teamId, profileId } = req.params;

        const team = await Team.findById(teamId);
        if (!team)
            return errorResponse(
                res,
                "#MemberController# #removeTeamMember# Equipo no encontrado",
                404
            );

        const isMember = team.members.some((id) => id.toString() === profileId);
        if (!isMember) {
            return errorResponse(
                res,
                "#MemberController# #removeTeamMember# El perfil no es miembro del equipo",
                400
            );
        }

        team.members = team.members.filter((id) => id.toString() !== profileId);
        await team.save();

        res.json({
            success: true,
            message: "Miembro eliminado",
            team,
        });
    } catch (error) {
        errorResponse(
            res,
            "#MemberController# #removeTeamMember# Error al eliminar miembro",
            500,
            error
        );
    }
};

// Obtener un miembro específico de un equipo
const getTeamMember = async (req, res) => {
    try {
        const { teamId, profileId } = req.params;

        const team = await Team.findById(teamId);
        if (!team)
            return errorResponse(
                res,
                "#MemberController# #getTeamMember# Equipo no encontrado",
                404
            );

        const isMember = team.members.some((id) => id.toString() === profileId);
        if (!isMember) {
            return errorResponse(
                res,
                "#MemberController# #getTeamMember# El perfil no es miembro del equipo",
                400
            );
        }

        const profile = await Profile.findById(profileId);
        res.json(profile);
    } catch (error) {
        errorResponse(
            res,
            "#MemberController# #getTeamMember# Error al obtener miembro",
            500,
            error
        );
    }
};

export { getTeamMembers, addTeamMember, removeTeamMember, getTeamMember };
