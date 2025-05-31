import { Profile, User } from "../models/index.js";
import { validateProfileData, errorResponse } from "../helpers/functions.js";

// Crear perfil
const createProfile = async (req, res) => {
    try {
        const errors = validateProfileData(req.body);
        if (errors.length > 0) {
            return errorResponse(res, errors[0], 400);
        }

        const user = await User.findById(req.body.user_id);
        if (!user) {
            return errorResponse(
                res,
                "#ProfileController# #createProfile# Usuario no encontrado",
                404
            );
        }

        const exists = await Profile.findOne({
            user_id: user._id,
            game: req.body.game,
        });
        if (exists) {
            return errorResponse(
                res,
                "#ProfileController# #createProfile# Ya existe perfil para este juego",
                400
            );
        }

        const profile = await Profile.create(req.body);
        res.status(201).json({
            success: true,
            message: "Perfil creado",
            data: profile,
        });
    } catch (error) {
        errorResponse(
            res,
            "#ProfileController# #createProfile# Error al crear el perfil",
            500,
            error
        );
    }
};

// Obtener todos los perfiles
const getAllProfiles = async (_req, res) => {
    try {
        const profiles = await Profile.find().populate(
            "user_id",
            "username age gender server"
        );
        res.status(200).json({
            success: true,
            count: profiles.length,
            data: profiles,
        });
    } catch (error) {
        errorResponse(
            res,
            "#ProfileController# #getAllProfiles# Error al obtener perfiles",
            500,
            error
        );
    }
};

// Obtener perfil por ID
const getProfileById = async (req, res) => {
    try {
        const profile = await Profile.findById(req.params.id).populate(
            "user_id",
            "username age gender server"
        );
        if (!profile)
            return errorResponse(
                res,
                "#ProfileController# #getProfileById# Perfil no encontrado",
                404
            );

        res.status(200).json({ success: true, data: profile });
    } catch (error) {
        errorResponse(
            res,
            "#ProfileController# #getProfileById# Error al obtener perfil",
            500,
            error
        );
    }
};

// Obtener perfiles por usuario
const getProfilesByUser = async (req, res) => {
    try {
        const profiles = await Profile.find({
            user_id: req.params.userId,
        }).populate("user_id", "username age gender server");
        res.status(200).json({
            success: true,
            count: profiles.length,
            data: profiles,
        });
    } catch (error) {
        errorResponse(
            res,
            "#ProfileController# #getProfilesByUser# Error al obtener perfiles del usuario",
            500,
            error
        );
    }
};

// Actualizar perfil
const updateProfile = async (req, res) => {
    try {
        const errors = validateProfileData(req.body);
        if (errors.length > 0) return errorResponse(res, errors[0], 400);

        const profile = await Profile.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!profile)
            return errorResponse(
                res,
                "#ProfileController# #updateProfile# Perfil no encontrado",
                404
            );

        res.status(200).json({
            success: true,
            message: "Perfil actualizado",
            data: profile,
        });
    } catch (error) {
        errorResponse(
            res,
            "#ProfileController# #updateProfile# Error al actualizar perfil",
            500,
            error
        );
    }
};

// Eliminar perfil
const deleteProfile = async (req, res) => {
    try {
        const profile = await Profile.findByIdAndDelete(req.params.id);
        if (!profile)
            return errorResponse(
                res,
                "#ProfileController# #deleteProfile# Perfil no encontrado",
                404
            );

        res.status(200).json({ success: true, message: "Perfil eliminado" });
    } catch (error) {
        errorResponse(
            res,
            "#ProfileController# #deleteProfile# Error al eliminar perfil",
            500,
            error
        );
    }
};

export {
    createProfile,
    getAllProfiles,
    getProfileById,
    getProfilesByUser,
    updateProfile,
    deleteProfile,
};
