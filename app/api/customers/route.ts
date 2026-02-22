import { NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import Customer from "@/models/Customer"

export async function GET() {
  try {
    await connectToDatabase()
    const customers = await Customer.find({})
    return NextResponse.json(customers)
  } catch (error) {
    console.error("Failed to fetch customers", error)
    return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase()
    const body = await req.json()
    
    // Ensure id exists
    if (!body.id) {
      body.id = Date.now().toString()
    }
    
    const newCustomer = await Customer.create(body)
    return NextResponse.json(newCustomer, { status: 201 })
  } catch (error) {
    console.error("Failed to create customer", error)
    return NextResponse.json({ error: "Failed to create customer" }, { status: 500 })
  }
}
