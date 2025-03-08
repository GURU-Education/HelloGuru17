import mongoose from "mongoose";

const ConversationSchema = new mongoose.Schema({
  topic: { type: String, required: true },
  hskLevel: { type: Number, required: true },
  conversation: { type: Array, required: true },
});

// Ensure Mongoose doesn't redefine the model
export default mongoose.models.conversations ||
  mongoose.model("conversations", ConversationSchema, "conversations"); // <-- Explicit collection name
