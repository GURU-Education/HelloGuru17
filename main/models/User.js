import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
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
});

// If the model already exists, use it; otherwise, create a new model
export default mongoose.models.User || mongoose.model("User", UserSchema);
