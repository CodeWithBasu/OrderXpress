"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { PlusCircle } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { useCart } from "../context/cart-context"
import { db } from "../services/database"
import type { InventoryItem } from "../services/database"
import { DietaryIcon, getDietaryType } from "@/components/ui/dietary-icon"

interface ProductGridProps {
  category: string
  searchQuery: string
}

export default function ProductGrid({ category, searchQuery }: ProductGridProps) {
  const { addToCart } = useCart()
  const [products, setProducts] = useState<InventoryItem[]>([])

  useEffect(() => {
    async function loadProducts() {
      const p = await db.getInventory()
      setProducts(p)
    }
    loadProducts()
  }, [])

  const filteredProducts = products.filter((product) => {
    const matchesCategory = category === "all" || product.category.toLowerCase() === category.toLowerCase()
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
      {filteredProducts.map((product) => (
        <Card
          key={product.id}
          className="overflow-hidden transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:shadow-indigo-500/10 cursor-pointer group bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm border-slate-200/50 dark:border-slate-800/50 rounded-2xl"
          onClick={() => addToCart(product)}
        >
          <div className="relative aspect-square m-2 overflow-hidden rounded-xl">
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100 z-10">
              <PlusCircle className="h-10 w-10 text-white" />
            </div>
            <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
          </div>
          <CardContent className="p-4 pt-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <DietaryIcon type={getDietaryType(product.name)} />
                <h3 className="font-semibold text-slate-800 dark:text-slate-200 line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {product.name}
                </h3>
              </div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">₹{product.price.toFixed(2)}</p>
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
