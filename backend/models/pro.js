import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
 
  username: {
    type: String,
    required: [true, "Username is required"],
    minlength: [3, "Username must be at least 3 characters"],
    maxlength: [10, "Username must not exceed 10 characters"],
    trim: true
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength:6
  },
   role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },
  profilePicture: {
  type: String,
  default: ""
}

}, { timestamps: true });


const User = mongoose.model("User", userSchema);
export default User;
