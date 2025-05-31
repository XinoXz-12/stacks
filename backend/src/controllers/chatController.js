import { Message } from "../models/index.js";
import { errorResponse } from "../helpers/functions.js";

// Obtener mensajes de un equipo
const getMessagesByTeam = async (req, res) => {
    try {
        const { teamId } = req.params;
        if (!teamId)
            return errorResponse(
                res,
                "#ChatController# #getMessagesByTeam# Falta teamId",
                400
            );

        const messages = await Message.find({ teamId })
            .sort({ createdAt: -1 })
            .populate("senderId", "user_game");

        res.status(200).json({ success: true, data: messages });
    } catch (error) {
        errorResponse(
            res,
            "#ChatController# #getMessagesByTeam# Error al obtener mensajes",
            500,
            error
        );
    }
};

// Enviar nuevo mensaje
const sendMessage = async (req, res) => {
    try {
        const { teamId } = req.params;
        const { senderId, content } = req.body;

        if (!teamId || !senderId || !content) {
            return errorResponse(
                res,
                "#ChatController# #sendMessage# Campos requeridos faltantes",
                400
            );
        }

        const newMessage = await Message.create({
            teamId,
            senderId,
            content,
        });

        const populatedMessage = await newMessage.populate(
            "senderId",
            "user_game"
        );

        const io = req.app.get("io");
        io.to(teamId).emit("newMessage", populatedMessage);

        res.status(201).json({ success: true, data: populatedMessage });
    } catch (error) {
        errorResponse(
            res,
            "#ChatController# #sendMessage# Error al enviar mensaje",
            500,
            error
        );
    }
};

// Obtener último mensaje de un equipo
const getLastMessageByTeam = async (req, res) => {
    try {
        const { teamId } = req.params;
        if (!teamId)
            return errorResponse(
                res,
                "#ChatController# #getLastMessageByTeam# Falta teamId",
                400
            );

        const message = await Message.findOne({ teamId })
            .sort({ date: -1 })
            .populate("senderId", "user_game");

        res.status(200).json({ success: true, data: message || null });
    } catch (error) {
        errorResponse(
            res,
            "#ChatController# #getLastMessageByTeam# Error al obtener último mensaje",
            500,
            error
        );
    }
};

export { getMessagesByTeam, sendMessage, getLastMessageByTeam };
