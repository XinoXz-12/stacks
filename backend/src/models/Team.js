import mongoose from "mongoose";
import ranksByGame from "../helpers/ranksByGame.js";

const teamSchema = new mongoose.Schema({
    name: String,
    game: { type: String, enum: Object.keys(ranksByGame) },
    gender: { type: String, enum: ["F", "Mixto"] },
    capacity: {
        type: Number,
        validate: {
            validator: function(capacity) {
                return ranksByGame[this.game].capacity === capacity;
            },
            message: (props) =>
                `La capacidad debe ser ${ranksByGame[props.value].capacity}`,
        },
    },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "Profile" }],
});

export default mongoose.model("Team", teamSchema);
