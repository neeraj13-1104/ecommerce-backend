import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
  type: String,
  required: function () {
    return !this.isGoogleUser;
  }
    },
    role: {
      type: String,
      enum: ["user", "superadmin", "productadmin"],
      default: "user",
    },
    isGoogleUser: {
  type: Boolean,
  default: false,
},

    resetPasswordToken: String, // 👈 ADD
    resetPasswordExpire: Date, // 👈 ADD
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
