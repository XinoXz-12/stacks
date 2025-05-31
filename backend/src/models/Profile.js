import mongoose from "mongoose";
import { VALID_STYLES, VALID_SERVERS } from "../helpers/enumsValid.js";

const profileSchema = new mongoose.Schema({
    user_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    game: { 
        type: String, 
        required: true 
    },
    user_game: { 
        type: String, 
        required: true 
    },
    rank: { 
        type: String, 
        required: true 
    },
    subrank: { 
        type: Number, 
        required: true 
    },
    style: { 
        type: String, 
        enum: VALID_STYLES, 
        required: true 
    },
    server: { 
        type: String, 
        enum: VALID_SERVERS, 
        required: true,
    },
}, {
    timestamps: true,
    validateBeforeSave: false
});

const Profile = mongoose.model("Profile", profileSchema);

export default Profile;
