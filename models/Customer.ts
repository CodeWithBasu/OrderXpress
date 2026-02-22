import mongoose, { Schema, model, models } from "mongoose"

const CustomerSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    loyaltyPoints: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    lastVisit: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
)

const Customer = models.Customer || model("Customer", CustomerSchema)

export default Customer
