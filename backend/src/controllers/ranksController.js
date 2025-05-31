import ranksByGame from "../helpers/ranksByGame.js";
import { errorResponse } from "../helpers/functions.js";

// Obtener estructura de rangos por juego
const getRanksData = async (_req, res) => {
    try {
        res.status(200).json({ success: true, data: ranksByGame });
    } catch (error) {
        errorResponse(
            res,
            "#RanksController# #getRanksData# Error al obtener datos de rangos",
            500,
            error
        );
    }
};

export { getRanksData };
