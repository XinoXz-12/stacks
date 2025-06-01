import { Team, Profile, User, Request } from "../models/index.js";
import {
    capacityForTeam,
    getGender,
    getAverageAge,
    errorResponse,
    buildTeamFilters,
} from "../helpers/functions.js";

// Create a new team
const createTeam = async (req, res) => {
    try {
        const { name, game, creatorUserId } = req.body;

        if (!name || !game || !creatorUserId) {
            return errorResponse(
                res,
                "#TeamController# #createTeam# Todos los campos son requeridos",
                400
            );
        }

        const capacity = capacityForTeam(game);
        if (!capacity) {
            return errorResponse(
                res,
                "#TeamController# #createTeam# Capacidad no válida para el juego",
                400
            );
        }

        const creatorProfile = await Profile.findOne({
            user_id: creatorUserId,
            game,
        });
        if (!creatorProfile) {
            return errorResponse(
                res,
                "#TeamController# #createTeam# Perfil del creador no encontrado",
                404
            );
        }

        const creatorUser = await User.findById(creatorUserId);
        if (!creatorUser) {
            return errorResponse(
                res,
                "#TeamController# #createTeam# Usuario del creador no encontrado",
                404
            );
        }

        const team = new Team({
            name,
            game,
            gender: getGender([creatorUser]),
            capacity,
            members: [creatorProfile._id],
        });

        await team.save();

        creatorProfile.teams = creatorProfile.teams || [];
        creatorProfile.teams.push(team._id);
        await creatorProfile.save();

        res.status(201).json({
            success: true,
            message: "Equipo creado",
            data: team,
        });
    } catch (error) {
        errorResponse(res, "#TeamController# #createTeam# Error al crear el equipo", 500, error);
    }
};

// Get all teams
const getAllTeams = async (req, res) => {
    try {
        const { region, style, minAge, maxAge, minPlayers, maxPlayers } =
            req.query;
        const filters = buildTeamFilters(req.query);

        let teams = await Team.find(filters).populate({
            path: "members",
            populate: { path: "user_id", select: "age" },
        });

        if (region) {
            teams = teams.filter(
                (team) =>
                    team.members.length > 0 && team.members[0].server === region
            );
        }

        if (style) {
            teams = teams.filter(
                (team) =>
                    team.members.length > 0 && team.members[0].style === style
            );
        }

        if (minPlayers)
            teams = teams.filter(
                (t) => t.members.length >= parseInt(minPlayers)
            );
        if (maxPlayers)
            teams = teams.filter(
                (t) => t.members.length <= parseInt(maxPlayers)
            );

        if (minAge || maxAge) {
            teams = teams.filter((team) => {
                const avg = getAverageAge(team.members);
                return (
                    (!minAge || avg >= parseInt(minAge)) &&
                    (!maxAge || avg <= parseInt(maxAge))
                );
            });
        }

        res.status(200).json({
            success: true,
            count: teams.length,
            data: teams,
        });
    } catch (error) {
        errorResponse(
            res,
            "#TeamController# #getAllTeams# Error al obtener los equipos",
            500,
            error
        );
    }
};

// Get a team by ID
const getTeamById = async (req, res) => {
    try {
        const team = await Team.findById(req.params.id).populate({
            path: "members",
            populate: { path: "user_id", select: "age" },
        });

        if (!team) {
            return errorResponse(
                res,
                "#TeamController# #getTeamById# Equipo no encontrado",
                404
            );
        }

        res.status(200).json({ success: true, data: team });
    } catch (error) {
        errorResponse(
            res,
            "#TeamController# #getTeamById# Error al obtener el equipo",
            500,
            error
        );
    }
};

// Get all teams by profile
const getTeamsByProfile = async (req, res) => {
    try {
        const { profileId } = req.params;

        const allTeams = await Team.find({ members: profileId }).populate({
            path: "members",
            populate: { path: "user_id", select: "age" },
        });

        res.status(200).json({ success: true, data: allTeams });
    } catch (error) {
        errorResponse(
            res,
            "#TeamController# #getTeamsByProfile# Error al obtener los equipos del perfil",
            500,
            error
        );
    }
};

// Update a team
const updateTeam = async (req, res) => {
    try {
        const { name, game, capacity } = req.body;

        if (!name || !game || !capacity) {
            return errorResponse(
                res,
                "#TeamController# #updateTeam# Todos los campos son requeridos",
                400
            );
        }

        if (capacity < 1) {
            return errorResponse(
                res,
                "#TeamController# #updateTeam# La capacidad debe ser mayor a 0",
                400
            );
        }

        let team = await Team.findById(req.params.id);
        if (!team) {
            return errorResponse(
                res,
                "#TeamController# #updateTeam# Equipo no encontrado",
                404
            );
        }

        team = await Team.findByIdAndUpdate(
            req.params.id,
            { name, game, capacity },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "Equipo actualizado",
            data: team,
        });
    } catch (error) {
        errorResponse(
            res,
            "#TeamController# #updateTeam# Error al actualizar el equipo",
            500,
            error
        );
    }
};

// Delete a team
const deleteTeam = async (req, res) => {
    try {
        const team = await Team.findByIdAndDelete(req.params.id);

        if (!team) {
            return errorResponse(
                res,
                "#TeamController# #deleteTeam# Equipo no encontrado",
                404
            );
        }

        await Request.deleteMany({ team_id: team._id });

        res.status(200).json({
            success: true,
            message: "Equipo eliminado",
        });
    } catch (error) {
        errorResponse(
            res,
            "#TeamController# #deleteTeam# Error al eliminar el equipo",
            500,
            error
        );
    }
};

// Add a member to a team
const addMemberToTeam = async (req, res) => {
    try {
        const { teamId } = req.params;
        const { profileId } = req.body;

        const team = await Team.findById(teamId);
        const profile = await Profile.findById(profileId);

        if (!team || !profile) {
            return errorResponse(
                res,
                "#TeamController# #addMemberToTeam# Equipo o perfil no encontrado",
                404
            );
        }

        const isAlreadyMember = team.members.some(
            (id) => id.toString() === profileId
        );
        if (isAlreadyMember) {
            return res
                .status(200)
                .json({
                    success: true,
                    message: "El perfil ya es miembro del equipo",
                    data: team,
                });
        }

        team.members.push(profileId);
        await team.save();

        res.status(200).json({
            success: true,
            message: "Miembro agregado",
            data: team,
        });
    } catch (error) {
        errorResponse(
            res,
            "#TeamController# #addMemberToTeam# Error al agregar miembro",
            500,
            error
        );
    }
};

export {
    createTeam,
    getAllTeams,
    getTeamById,
    getTeamsByProfile,
    updateTeam,
    deleteTeam,
    addMemberToTeam,
};
