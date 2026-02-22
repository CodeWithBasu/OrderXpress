import { NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import Feedback from "@/models/Feedback"

export async function GET() {
  try {
    await connectToDatabase()
    const feedbackList = await Feedback.find({}).sort({ createdAt: -1 })
    return NextResponse.json(feedbackList)
  } catch (error) {
    console.error("Failed to fetch feedback", error)
    return NextResponse.json({ error: "Failed to fetch feedback" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase()
    const body = await req.json()
    const newFeedback = await Feedback.create(body)
    return NextResponse.json(newFeedback, { status: 201 })
  } catch (error) {
    console.error("Failed to create feedback", error)
    return NextResponse.json({ error: "Failed to create feedback" }, { status: 500 })
  }
}
