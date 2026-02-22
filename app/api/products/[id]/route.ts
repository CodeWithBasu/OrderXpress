import { NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import Product from "@/models/Product"

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase()
    const resolvedParams = await params
    const id = resolvedParams.id
    const body = await req.json()
    // Notice we filter by custom id instead of _id since frontend uses id
    const updatedProduct = await Product.findOneAndUpdate(
      { id: Number(id) }, 
      body, 
      { new: true }
    )
    return NextResponse.json(updatedProduct)
  } catch (error) {
    console.error("Failed to update product", error)
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase()
    const resolvedParams = await params
    const id = resolvedParams.id
    await Product.findOneAndDelete({ id: Number(id) })
    return NextResponse.json({ message: "Product deleted successfully" })
  } catch (error) {
    console.error("Failed to delete product", error)
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
  }
}
