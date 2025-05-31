import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    teamId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
        required: true,
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile",
        required: true,
    },
    content: { type: String, required: true },
    date: { type: Date, default: Date.now },
});

const Message = mongoose.model("Message", messageSchema);

export default Message;
