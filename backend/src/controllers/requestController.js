import { Request, Team, Profile } from "../models/index.js";
import { VALID_STATUS_REQUESTS } from "../helpers/enumsValid.js";
import { errorResponse } from "../helpers/functions.js";

// Crear nueva solicitud
const addRequest = async (req, res) => {
    try {
        const { team_id, profile_id } = req.body;

        if (!team_id || !profile_id) {
            return errorResponse(
                res,
                "#RequestController# #addRequest# Faltan campos requeridos",
                400
            );
        }

        const [team, profile] = await Promise.all([
            Team.findById(team_id),
            Profile.findById(profile_id),
        ]);

        if (!team)
            return errorResponse(res, "#RequestController# #addRequest# Equipo no encontrado", 404);
        if (!profile)
            return errorResponse(res, "#RequestController# #addRequest# Perfil no encontrado", 404);

        const existingRequest = await Request.findOne({
            team_id,
            profile_id,
            status: "pending",
        });
        if (existingRequest) {
            return errorResponse(
                res,
                "#RequestController# #addRequest# Ya existe una solicitud pendiente",
                400
            );
        }

        const acceptedCount = await Request.countDocuments({
            team_id,
            status: "accepted",
        });
        if (acceptedCount >= team.capacity) {
            return errorResponse(res, "#RequestController# #addRequest# El equipo está lleno", 400);
        }

        const request = await Request.create({
            team_id,
            profile_id,
            status: "pending",
        });
        res.status(201).json({
            success: true,
            message: "Solicitud creada",
            data: request,
        });
    } catch (error) {
        errorResponse(res, "#RequestController# #addRequest# Error al crear solicitud", 500, error);
    }
};

// Obtener solicitudes por equipo
const getRequestsByTeam = async (req, res) => {
    try {
        const { teamId } = req.params;
        if (!teamId)
            return errorResponse(
                res,
                "#RequestController# #getRequestsByTeam# Falta ID de equipo",
                400
            );

        const requests = await Request.find({ team_id: teamId })
            .populate({
                path: "profile_id",
                select: "user_id user_game game rank subrank style server",
                populate: { path: "user_id", select: "gender age" },
            })
            .populate("team_id", "name game");

        res.status(200).json({
            success: true,
            count: requests.length,
            data: requests,
        });
    } catch (error) {
        errorResponse(
            res,
            "#RequestController# #getRequestsByTeam# Error al obtener solicitudes",
            500,
            error
        );
    }
};

// Obtener solicitudes por perfil
const getRequestsByProfile = async (req, res) => {
    try {
        const { profileId } = req.params;
        if (!profileId)
            return errorResponse(
                res,
                "#RequestController# #getRequestsByProfile# Falta ID de perfil",
                400
            );

        const requests = await Request.find({ profile_id: profileId })
            .populate("team_id", "name game gender capacity")
            .populate(
                "profile_id",
                "user_id user_game game rank subrank style server"
            );

        res.status(200).json({
            success: true,
            count: requests.length,
            data: requests,
        });
    } catch (error) {
        errorResponse(
            res,
            "#RequestController# #getRequestsByProfile# Error al obtener solicitudes",
            500,
            error
        );
    }
};

// Cambiar estado de solicitud
const updateRequestStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!id || !status)
            return errorResponse(
                res,
                "#RequestController# #updateRequestStatus# ID y estado requeridos",
                400
            );
        if (!VALID_STATUS_REQUESTS.includes(status)) {
            return errorResponse(
                res,
                "#RequestController# #updateRequestStatus# Estado inválido",
                400
            );
        }

        const request = await Request.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        )
            .populate("team_id")
            .populate("profile_id");

        if (!request)
            return errorResponse(
                res,
                "#RequestController# #updateRequestStatus# Solicitud no encontrada",
                404
            );

        if (status === "accepted") {
            const team = request.team_id;
            const profileId = request.profile_id._id;
            if (!team.members.includes(profileId)) {
                team.members.push(profileId);
                await team.save();
            }
        }

        res.status(200).json({
            success: true,
            message: "Estado actualizado",
            data: request,
        });
    } catch (error) {
        errorResponse(
            res,
            "#RequestController# #updateRequestStatus# Error al actualizar estado",
            500,
            error
        );
    }
};

// Eliminar solicitud
const removeRequest = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id)
            return errorResponse(
                res,
                "#RequestController# #removeRequest# Falta ID de solicitud",
                400
            );

        const request = await Request.findByIdAndDelete(id);
        if (!request)
            return errorResponse(
                res,
                "#RequestController# #removeRequest# Solicitud no encontrada",
                404
            );

        res.status(200).json({
            success: true,
            message: "Solicitud eliminada",
            data: request,
        });
    } catch (error) {
        errorResponse(
            res,
            "#RequestController# #removeRequest# Error al eliminar solicitud",
            500,
            error
        );
    }
};

export {
    addRequest,
    getRequestsByTeam,
    getRequestsByProfile,
    updateRequestStatus,
    removeRequest,
};
