import mongoose, { Schema, model, models } from "mongoose"

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "staff"], default: "staff" },
  },
  {
    timestamps: true,
  }
)

const User = models.User || model("User", UserSchema)

export default User
