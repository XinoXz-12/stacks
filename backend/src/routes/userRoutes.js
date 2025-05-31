import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { userController } from "../controllers/index.js";
import multer from "multer";
import path from "path";

const router = express.Router();

// Configuración de multer para subida de imágenes
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(process.cwd(), "uploads"));
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ 
    storage,
    fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error('Solo se permiten archivos de imagen'));
        }
        cb(null, true);
    },
    limits: {
        fileSize: 5 * 1024 * 1024 // límite de 5MB
    }
});

router.get("/:id", authMiddleware, userController.getUser);
router.get("/", authMiddleware, userController.getAllUsers);
router.put("/update-data/:id", authMiddleware, userController.updateUser);
router.put("/update-image/", authMiddleware, upload.single("image"), userController.updateUserImage);
router.delete("/:id", authMiddleware, userController.deleteUser);
router.post("/compare-password", authMiddleware, userController.comparePassword);

export default router;
