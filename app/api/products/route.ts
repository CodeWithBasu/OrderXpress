import { NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import Product from "@/models/Product"

const defaultInventory = [
  {
    id: 1,
    name: "Cheeseburger",
    price: 199,
    image: "/classic-beef-burger.png",
    category: "food",
    stock: 50,
    lowStockThreshold: 10,
    supplier: "Food Supplier Co.",
    lastRestocked: new Date(),
    cost: 100,
  },
  {
    id: 2,
    name: "Pepperoni Pizza",
    price: 399,
    image: "/delicious-pizza.png",
    category: "food",
    stock: 30,
    lowStockThreshold: 5,
    supplier: "Pizza Ingredients Ltd.",
    lastRestocked: new Date(),
    cost: 200,
  },
]

export async function GET() {
  try {
    await connectToDatabase()
    let products = await Product.find({})
    
    // Seed the database if no products are found
    if (products.length === 0) {
      await Product.insertMany(defaultInventory)
      products = await Product.find({})
    }
    
    return NextResponse.json(products)
  } catch (error) {
    console.error("Failed to fetch products", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase()
    const body = await req.json()
    
    if (!body.id) {
      body.id = Date.now()
    }
    
    const newProduct = await Product.create(body)
    return NextResponse.json(newProduct, { status: 201 })
  } catch (error) {
    console.error("Failed to create product", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}
