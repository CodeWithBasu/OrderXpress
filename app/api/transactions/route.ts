import { NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import Transaction from "@/models/Transaction"

export async function GET(req: Request) {
  try {
    await connectToDatabase()
    
    // Optional query parameter customerId
    const { searchParams } = new URL(req.url)
    const customerId = searchParams.get('customerId')
    
    const query = customerId ? { customerId } : {}
    const transactions = await Transaction.find(query).sort({ timestamp: -1 })
    return NextResponse.json(transactions)
  } catch (error) {
    console.error("Failed to fetch transactions", error)
    return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase()
    const body = await req.json()
    
    if (!body.id) {
      body.id = Date.now().toString()
    }
    
    const newTransaction = await Transaction.create(body)
    return NextResponse.json(newTransaction, { status: 201 })
  } catch (error) {
    console.error("Failed to create transaction", error)
    return NextResponse.json({ error: "Failed to create transaction" }, { status: 500 })
  }
}
