import mongoose, { Schema, model, models } from "mongoose"

const TransactionItemSchema = new Schema(
  {
    id: { type: Number, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    total: { type: Number, required: true },
  },
  { _id: false }
)

const TransactionSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    customerId: { type: String },
    items: [TransactionItemSchema],
    subtotal: { type: Number, required: true },
    tax: { type: Number, required: true },
    discount: { type: Number, required: true, default: 0 },
    total: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    receiptNumber: { type: String, required: true },
    cashierName: { type: String },
  },
  {
    timestamps: true,
  }
)

const Transaction = models.Transaction || model("Transaction", TransactionSchema)

export default Transaction
