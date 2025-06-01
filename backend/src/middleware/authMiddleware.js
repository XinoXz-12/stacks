import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { User } from "../models/index.js";

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            console.log("Error: Token no proporcionado");
            return res.status(401).json({
                success: false,
                message: "#AuthMiddleware# Token no proporcionado",
            });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const user = await User.findById(decoded.userId).select(
                "-password"
            );
            if (!user) {
                console.log("Error: Usuario no encontrado");
                return res.status(401).json({
                    success: false,
                    message: "#AuthMiddleware# Usuario no encontrado",
                });
            }

            req.userId = decoded.userId;
            next();
        } catch (jwtError) {
            console.error("Error verificando token:", jwtError);
            return res.status(401).json({
                success: false,
                message: "#AuthMiddleware# Token inválido o expirado",
            });
        }
    } catch (error) {
        console.error("Error en authMiddleware:", error);
        res.status(500).json({
            success: false,
            message: "#AuthMiddleware# Error en la autenticación",
            error: error.message,
        });
    }
};

export default authMiddleware;
