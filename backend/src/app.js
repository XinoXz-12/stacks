import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from "dotenv";
import path from "path";
import dns from "dns";
import { fileURLToPath } from "url";
import registerRoutes from "./routes/index.js";
import errorHandler from "./middleware/errorHandler.js";

dotenv.config();
dns.setDefaultResultOrder("ipv4first");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(express.json());

app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://ec2-13-219-93-135.compute-1.amazonaws.com',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

// Middleware para logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Ruta para servir archivos estáticos
app.use("/api/uploads", express.static(path.join(__dirname, "../uploads")));

// Rutas centralizadas
registerRoutes(app);
app.use(errorHandler);

// Conexión a MongoDB
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log('Conectado a MongoDB'))
    .catch((error) => console.error('Error conectando a MongoDB:', error));

export default app; 