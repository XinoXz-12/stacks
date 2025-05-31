import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from "dotenv";
import path from "path";
import dns from "dns";
import { fileURLToPath } from "url";
import registerRoutes from "./routes/index.js";
import errorHandler from "./middleware/errorHandler.js";
import seed from "./data/fakeData.js";

dotenv.config();
dns.setDefaultResultOrder("ipv4first");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(async () => {
        console.log("MongoDB conectado");
        await seed();
        app.listen(3000, () =>
            console.log("Servidor corriendo en puerto 3000")
        );
    });

app.use(cors({
    origin: process.env.CORS_ORIGIN || 'https://stacks-gg.duckdns.org',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

// Middleware for logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Root route
app.get("/api", (req, res) => {
    res.json({ message: "API REST - Stacks funcionando" });
});

// Route for static files
app.use("/api/uploads", express.static(path.join(__dirname, "../uploads")));

// Centralized routes
registerRoutes(app);
app.use(errorHandler);

// Connect to MongoDB
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log('Conectado a MongoDB'))
    .catch((error) => console.error('Error conectando a MongoDB:', error));

export default app; 