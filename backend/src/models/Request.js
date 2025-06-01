import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema({
    team_id: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
    profile_id: { type: mongoose.Schema.Types.ObjectId, ref: "Profile" },
    date: { type: Date, default: Date.now },
    status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
});

export default mongoose.model("Request", requestSchema);
