import authRoutes from "./authRoutes.js";
import userRoutes from "./userRoutes.js";
import profileRoutes from "./profileRoutes.js";
import teamRoutes from "./teamRoutes.js";
import requestRoutes from "./requestRoutes.js";
import membersRoutes from "./membersRoutes.js";
import chatRoutes from "./chatRoutes.js";
import newsRoutes from "./newsRoutes.js";
import uploadRoutes from "./uploadRoutes.js";
import ranksRoutes from "./ranksRoutes.js";
import authMiddleware from "../middleware/authMiddleware.js";

export default function registerRoutes(app) {
    app.use("/api/auth", authRoutes);
    app.use("/api/users", authMiddleware, userRoutes);
    app.use("/api/profiles", authMiddleware, profileRoutes);
    app.use("/api/teams", authMiddleware, teamRoutes);
    app.use("/api/requests", authMiddleware, requestRoutes);
    app.use("/api/members", authMiddleware, membersRoutes);
    app.use("/api/chat", authMiddleware, chatRoutes);
    app.use("/api/news", newsRoutes);
    app.use("/api/upload", uploadRoutes);
    app.use("/api/ranks", ranksRoutes);
}
