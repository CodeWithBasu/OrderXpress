"use client"

import { useState } from "react"
import { Search, Settings } from "lucide-react"
import { Input } from "@/components/ui/input"
import ProductGrid from "./components/product-grid"
import CartSidebar from "./components/cart-sidebar"
import CategorySidebar from "./components/category-sidebar"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { MenuQRCodeModal } from "./components/menu-qr-modal"
import { FeedbackModal } from "./components/feedback-modal"

export default function POSPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const router = useRouter()

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 font-sans">
      <CategorySidebar selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />

      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-linear-to-br from-indigo-50/40 via-white to-cyan-50/40 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
        <div className="sticky top-0 z-10 bg-white/60 dark:bg-slate-950/60 backdrop-blur-xl p-4 border-b border-slate-200/60 dark:border-slate-800/60">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-indigo-600 to-cyan-600 dark:from-indigo-400 dark:to-cyan-400">OrderXpress</h1>
            <div className="flex items-center gap-4">
              <FeedbackModal source="POS System" />
              <MenuQRCodeModal />
              <Button variant="outline" onClick={() => router.push("/admin")}>
                <Settings className="h-4 w-4 mr-2" />
                Admin
              </Button>
              <div className="relative w-72">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  className="pl-9 bg-white/80 dark:bg-slate-900/80 border-slate-200/60 dark:border-slate-800/60 shadow-sm focus-visible:ring-indigo-500 rounded-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4">
          <ProductGrid category={selectedCategory} searchQuery={searchQuery} />
        </div>
      </main>

      <CartSidebar />
    </div>
  )
}
