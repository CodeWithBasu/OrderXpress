"use client"

import Image from "next/image"
import { PlusCircle } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { useCart } from "../context/cart-context"
import { products } from "../data/products"

interface ProductGridProps {
  category: string
  searchQuery: string
}

export default function ProductGrid({ category, searchQuery }: ProductGridProps) {
  const { addToCart } = useCart()

  const filteredProducts = products.filter((product) => {
    const matchesCategory = category === "all" || product.category === category
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
      {filteredProducts.map((product) => (
        <Card
          key={product.id}
          className="overflow-hidden transition-all duration-200 hover:scale-105 hover:shadow-md cursor-pointer group"
          onClick={() => addToCart(product)}
        >
          <div className="relative aspect-square">
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100 z-10">
              <PlusCircle className="h-10 w-10 text-white" />
            </div>
            <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
          </div>
          <CardContent className="p-3">
            <div>
              <h3 className="font-medium line-clamp-1">{product.name}</h3>
              <p className="text-sm text-muted-foreground">${product.price.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>
      ))}

      {filteredProducts.length === 0 && (
        <div className="col-span-full py-12 text-center">
          <p className="text-muted-foreground">No products found</p>
        </div>
      )}
    </div>
  )
}
