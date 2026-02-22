import mongoose, { Schema, model, models } from "mongoose"

const ProductSchema = new Schema(
  {
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    cost: { type: Number, required: true, default: 0 },
    category: { type: String, required: true },
    description: { type: String, default: "" },
    stock: { type: Number, required: true, default: 0 },
    lowStockThreshold: { type: Number, required: true, default: 5 },
    supplier: { type: String, default: "" },
    image: { type: String, default: "" },
    lastRestocked: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
)

const Product = models.Product || model("Product", ProductSchema)

export default Product
