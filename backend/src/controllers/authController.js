import { User } from "../models/index.js";
import jwt from "jsonwebtoken";
import * as jdenticon from "jdenticon";
import fs from "fs";
import path from "path";
import { errorResponse } from "../helpers/functions.js";

// Login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return errorResponse(
                res,
                "#AuthController# #login# Email y contraseña son requeridos",
                400
            );
        }

        const user = await User.findOne({ email });
        if (!user)
            return errorResponse(res, "#AuthController# #login# Email no encontrado", 401);

        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid)
            return errorResponse(res, "#AuthController# #login# Contraseña incorrecta", 401);

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: "12h",
        });

        res.status(200).json({
            success: true,
            message: "¡Bienvenido!",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                age: user.age,
                gender: user.gender,
                image: user.image,
                role: user.role,
            },
        });
    } catch (error) {
        errorResponse(res, "#AuthController# #login# Error en el login", 500, error);
    }
};

// Registro
const register = async (req, res) => {
    try {
        const { username, password, email, age, gender } = req.body;

        if (!username || !password || !email || !age || !gender) {
            return errorResponse(
                res,
                "#AuthController# #register# Todos los campos son requeridos",
                400
            );
        }

        if (!["M", "F", "Other"].includes(gender)) {
            return errorResponse(res, "#AuthController# #register# Género inválido", 400);
        }

        const [existingUsername, existingEmail] = await Promise.all([
            User.findOne({ username }),
            User.findOne({ email }),
        ]);

        if (existingUsername)
            return errorResponse(
                res,
                "#AuthController# #register# Nombre de usuario en uso",
                400
            );
        if (existingEmail)
            return errorResponse(res, "#AuthController# #register# Email en uso", 400);

        // Crear imagen con jdenticon
        const icon = jdenticon.toPng(username, 100);
        const filename = `jidenticon-${Date.now()}-${username}.png`;
        const uploadDir = path.join(process.cwd(), "uploads");

        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const iconPath = path.join(uploadDir, filename);
        fs.writeFileSync(iconPath, icon);

        const user = new User({
            username,
            password,
            email,
            age,
            gender,
            role: "user",
            image: `/uploads/${filename}`,
        });

        await user.save();

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: "12h",
        });

        res.status(201).json({
            success: true,
            message: "¡Bienvenido!",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                age: user.age,
                gender: user.gender,
                image: user.image,
                role: user.role,
            },
        });
    } catch (error) {
        errorResponse(res, "#AuthController# #register# Error en el registro", 500, error);
    }
};

// Logout (pasivo)
const logout = async (_req, res) => {
    res.json({ message: "¡Hasta luego!" });
};

// Verificar autenticación por token
const checkAuth = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return errorResponse(
                res,
                "#AuthController# #checkAuth# Token no proporcionado",
                401
            );
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select("-password");

        if (!user)
            return errorResponse(res, "#AuthController# #checkAuth# Usuario no encontrado", 401);

        res.status(200).json({ message: "¡Bienvenido!", user });
    } catch (error) {
        errorResponse(res, "#AuthController# #checkAuth# Token inválido o expirado", 401, error);
    }
};

export { login, register, logout, checkAuth };
