import { User } from "../models/index.js";
import { errorResponse } from "../helpers/functions.js";

// Obtener usuario actual
const getUser = async (req, res) => {
    try {
        if (!req.userId)
            return errorResponse(
                res,
                "#UserController# #getUser# ID de usuario no proporcionado",
                400
            );

        const user = await User.findById(req.userId).select("-password");
        if (!user)
            return errorResponse(res, "#UserController# #getUser# Usuario no encontrado", 404);

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        errorResponse(res, "#UserController# #getUser# Error al obtener el usuario", 500, error);
    }
};

// Obtener todos los usuarios
const getAllUsers = async (_req, res) => {
    try {
        const users = await User.find().select("-password");
        res.status(200).json({
            success: true,
            count: users.length,
            data: users,
        });
    } catch (error) {
        errorResponse(
            res,
            "#UserController# #getAllUsers# Error al obtener usuarios",
            500,
            error
        );
    }
};

// Actualizar usuario
const updateUser = async (req, res) => {
    try {
        if (!req.userId)
            return errorResponse(
                res,
                "#UserController# #updateUser# ID de usuario requerido",
                400
            );

        const user = await User.findById(req.userId);
        if (!user)
            return errorResponse(
                res,
                "#UserController# #updateUser# Usuario no encontrado",
                404
            );

        const { username, age, gender } = req.body;
        const updates = {};

        if (username) updates.username = username;
        if (age) updates.age = parseInt(age);
        if (gender) updates.gender = gender;

        if (Object.keys(updates).length === 0) {
            return errorResponse(
                res,
                "#UserController# #updateUser# Ningún campo proporcionado para actualizar",
                400
            );
        }

        const updated = await User.findByIdAndUpdate(
            req.userId,
            { $set: updates },
            {
                new: true,
                runValidators: true,
            }
        ).select("-password");

        res.status(200).json({
            success: true,
            message: "Usuario actualizado",
            data: updated,
        });
    } catch (error) {
        errorResponse(
            res,
            "#UserController# #updateUser# Error al actualizar usuario",
            500,
            error
        );
    }
};

// Actualizar imagen del usuario
const updateUserImage = async (req, res) => {
    try {
        if (!req.userId)
            return errorResponse(res, "#UserController# #updateUserImage# ID requerido", 400);
        if (!req.file)
            return errorResponse(
                res,
                "#UserController# #updateUserImage# Imagen no proporcionada",
                400
            );

        const imagePath = `/uploads/${req.file.filename}`;
        const updated = await User.findByIdAndUpdate(
            req.userId,
            { $set: { image: imagePath } },
            { new: true }
        ).select("-password");

        if (!updated)
            return errorResponse(
                res,
                "#UserController# #updateUserImage# Usuario no encontrado",
                404
            );

        res.status(200).json({
            success: true,
            message: "Imagen actualizada",
            data: updated,
        });
    } catch (error) {
        errorResponse(
            res,
            "#UserController# #updateUserImage# Error al actualizar imagen",
            500,
            error
        );
    }
};

// Eliminar usuario
const deleteUser = async (req, res) => {
    try {
        if (!req.userId)
            return errorResponse(res, "#UserController# #deleteUser# ID requerido", 400);

        const user = await User.findByIdAndDelete(req.userId);
        if (!user)
            return errorResponse(
                res,
                "#UserController# #deleteUser# Usuario no encontrado",
                404
            );

        res.status(200).json({ success: true, message: "Usuario eliminado" });
    } catch (error) {
        errorResponse(
            res,
            "#UserController# #deleteUser# Error al eliminar usuario",
            500,
            error
        );
    }
};

// Comparar contraseña
const comparePassword = async (req, res) => {
    try {
        const { password } = req.body;
        const user = await User.findById(req.userId);

        if (!user)
            return errorResponse(
                res,
                "#UserController# #comparePassword# Usuario no encontrado",
                404
            );
        const isMatch = await user.comparePassword(password);

        res.status(200).json({ success: true, data: isMatch });
    } catch (error) {
        errorResponse(
            res,
            "#UserController# #comparePassword# Error al comparar contraseña",
            500,
            error
        );
    }
};

export {
    getUser,
    getAllUsers,
    updateUser,
    updateUserImage,
    deleteUser,
    comparePassword,
};
