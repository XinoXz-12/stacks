export default function errorHandler(err, req, res, next) {
    console.error("🛑 Error no manejado:", err);
    res.status(500).json({
        success: false,
        message: "Error interno del servidor",
        error: err.message,
    });
}
