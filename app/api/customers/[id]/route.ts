import { NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import Customer from "@/models/Customer"

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase()
    const resolvedParams = await params
    const id = resolvedParams.id
    const body = await req.json()
    
    const updatedCustomer = await Customer.findOneAndUpdate(
      { id: id }, 
      body, 
      { new: true, upsert: true } // Upsert in case the customer is fully saved as PUT
    )
    return NextResponse.json(updatedCustomer)
  } catch (error) {
    console.error("Failed to update customer", error)
    return NextResponse.json({ error: "Failed to update customer" }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase()
    const resolvedParams = await params
    const id = resolvedParams.id
    await Customer.findOneAndDelete({ id: id })
    return NextResponse.json({ message: "Customer deleted successfully" })
  } catch (error) {
    console.error("Failed to delete customer", error)
    return NextResponse.json({ error: "Failed to delete customer" }, { status: 500 })
  }
}
