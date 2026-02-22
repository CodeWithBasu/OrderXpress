import mongoose, { Schema, model, models } from "mongoose"

const FeedbackSchema = new Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comments: { type: String, required: true },
    source: { type: String, default: "menu" }, 
  },
  {
    timestamps: true,
  }
)

const Feedback = models.Feedback || model("Feedback", FeedbackSchema)

export default Feedback
