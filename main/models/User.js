import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: false,
    unique: false,
    default: "",
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  photo_urls: {
    type: [String],
    default: [],
  },
  exp: {
    type: Number,
    default: 0,
  },
  level: {
    type: Number,
    default: 0,
  },
});

// If the model already exists, use it; otherwise, create a new model
export default mongoose.models.User || mongoose.model("User", UserSchema);
