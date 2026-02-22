"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Search } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { db } from "../services/database"
import type { InventoryItem } from "../services/database"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { DietaryIcon, getDietaryType } from "@/components/ui/dietary-icon"

export default function DigitalMenuPage() {
  const [products, setProducts] = useState<InventoryItem[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  useEffect(() => {
    async function loadProducts() {
      const p = await db.getInventory()
      setProducts(p)
    }
    loadProducts()
  }, [])

  const categories = ["all", ...Array.from(new Set(products.map((p) => p.category.toLowerCase())))]

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === "all" || product.category.toLowerCase() === selectedCategory.toLowerCase()
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans flex flex-col pb-8">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-800/60 pt-6 pb-4 px-4 shadow-sm">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-linear-to-r from-orange-500 to-amber-500">
            OrderXpress Menu
          </h1>
          <p className="text-muted-foreground mt-1 text-sm font-medium">Discover our delicious offerings</p>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search our menu..."
            className="pl-9 h-10 bg-slate-100/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 rounded-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Categories Bar */}
        <ScrollArea className="w-full whitespace-nowrap pb-2">
          <div className="flex w-max space-x-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all shadow-sm ${
                  selectedCategory === category
                    ? "bg-orange-500 text-white shadow-orange-500/25"
                    : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-orange-50 dark:hover:bg-slate-800"
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" className="hidden" />
        </ScrollArea>
      </div>

      {/* Menu Grid */}
      <div className="flex-1 p-4 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900/40 rounded-3xl shadow-xs transition-transform hover:scale-[1.02]">
              <div className="flex h-32 sm:flex-col sm:h-auto">
                <div className="relative w-32 sm:w-full sm:aspect-video shrink-0 p-2 sm:p-0">
                  <div className="relative w-full h-full rounded-2xl overflow-hidden sm:rounded-none">
                     <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
                  </div>
                </div>
                <CardContent className="flex-1 p-4 flex flex-col justify-center sm:justify-start">
                  <div className="flex justify-between items-start mb-1 gap-2">
                    <div className="flex items-start gap-2">
                      <DietaryIcon type={getDietaryType(product.name)} className="mt-1" />
                      <h3 className="font-bold text-slate-800 dark:text-slate-100 line-clamp-2">{product.name}</h3>
                    </div>
                    <span className="font-extrabold text-orange-600 dark:text-orange-400 shrink-0">₹{product.price.toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-1">Delicious {product.category} item prepared fresh upon your order.</p>
                </CardContent>
              </div>
            </Card>
          ))}

          {filteredProducts.length === 0 && (
            <div className="col-span-full py-16 text-center opacity-70">
              <p className="text-muted-foreground">No items match your search.</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-8 pt-8 pb-4 text-center border-t border-slate-200/50 dark:border-slate-800/50">
        <p className="text-sm text-slate-500 font-medium">
          Made with ❤️ by <span className="font-bold text-orange-500">BASUDEV</span>
        </p>
      </footer>
    </div>
  )
}
