import fs from "fs";
import multer from "multer";
import path from "path";
import { errorResponse } from "../helpers/functions.js";

// Configuración de multer
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, path.join(process.cwd(), "uploads"));
    },
    filename: (_req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });

// Subir archivo
const uploadFile = (req, res) => {
    upload.single("file")(req, res, (error) => {
        if (error) {
            return errorResponse(
                res,
                "#UploadController# #uploadFile# Error al subir archivo",
                400,
                error
            );
        }

        if (!req.file) {
            return errorResponse(
                res,
                "#UploadController# #uploadFile# No se subió ningún archivo",
                400
            );
        }

        res.json({
            success: true,
            fileUrl: `/uploads/${req.file.filename}`,
        });
    });
};

// Eliminar archivo
const deleteFile = (req, res) => {
    try {
        const fileName = req.params.fileName;
        const filePath = path.join(process.cwd(), "uploads", fileName);

        if (!fs.existsSync(filePath)) {
            return errorResponse(
                res,
                "#UploadController# #deleteFile# Archivo no encontrado",
                404
            );
        }

        fs.unlinkSync(filePath);
        res.json({ success: true, message: `Archivo ${fileName} eliminado` });
    } catch (error) {
        errorResponse(
            res,
            "#UploadController# #deleteFile# Error al eliminar archivo",
            500,
            error
        );
    }
};

export { upload, uploadFile, deleteFile };
