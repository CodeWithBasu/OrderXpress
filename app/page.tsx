"use client"

import { useState } from "react"
import { Search, Settings, Menu, ShoppingCart } from "lucide-react"
import { Input } from "@/components/ui/input"
import ProductGrid from "./components/product-grid"
import CartSidebar from "./components/cart-sidebar"
import CategorySidebar from "./components/category-sidebar"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { MenuQRCodeModal } from "./components/menu-qr-modal"
import { FeedbackModal } from "./components/feedback-modal"
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { useCart } from "./context/cart-context"

export default function POSPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isCategorySheetOpen, setIsCategorySheetOpen] = useState(false)
  const [isCartSheetOpen, setIsCartSheetOpen] = useState(false)
  
  const { itemCount } = useCart()
  const router = useRouter()

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 font-sans">
      {/* Desktop Category Sidebar */}
      <div className="hidden lg:flex">
        <CategorySidebar selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />
      </div>

      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-linear-to-br from-indigo-50/40 via-white to-cyan-50/40 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
        <div className="sticky top-0 z-10 bg-white/60 dark:bg-slate-950/60 backdrop-blur-xl p-4 border-b border-slate-200/60 dark:border-slate-800/60">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Sheet open={isCategorySheetOpen} onOpenChange={setIsCategorySheetOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden shrink-0">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-64 border-r-0">
                  <SheetHeader className="sr-only">
                    <SheetTitle>Categories</SheetTitle>
                    <SheetDescription>Select a product category.</SheetDescription>
                  </SheetHeader>
                  <CategorySidebar 
                    selectedCategory={selectedCategory} 
                    onSelectCategory={(cat) => {
                      setSelectedCategory(cat)
                      setIsCategorySheetOpen(false)
                    }} 
                  />
                </SheetContent>
              </Sheet>
              <h1 className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-indigo-600 to-cyan-600 dark:from-indigo-400 dark:to-cyan-400">OrderXpress</h1>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <AnimatedThemeToggler className="shrink-0" />
              <FeedbackModal source="POS System" />
              <div className="hidden sm:block">
                <MenuQRCodeModal />
              </div>
              <Button variant="outline" onClick={() => router.push("/admin")} className="hidden md:flex shrink-0">
                <Settings className="h-4 w-4 mr-2" />
                Admin
              </Button>
              <Button variant="outline" size="icon" onClick={() => router.push("/admin")} className="md:hidden shrink-0">
                <Settings className="h-4 w-4" />
              </Button>
              <div className="relative hidden md:block w-48 lg:w-72">
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
          <div className="md:hidden mb-4 relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
             <Input
               placeholder="Search products..."
               className="pl-9 bg-white/80 dark:bg-slate-900/80 border-slate-200/60 dark:border-slate-800/60 shadow-sm rounded-full"
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
             />
          </div>
          <ProductGrid category={selectedCategory} searchQuery={searchQuery} />
        </div>
      </main>

      {/* Desktop Cart Sidebar */}
      <div className="hidden xl:flex">
        <CartSidebar />
      </div>

      {/* Mobile Cart Button & Sheet */}
      <div className="xl:hidden fixed bottom-6 right-6 z-50">
        <Sheet open={isCartSheetOpen} onOpenChange={setIsCartSheetOpen}>
          <SheetTrigger asChild>
            <Button size="lg" className="rounded-full shadow-lg shadow-indigo-500/30 h-16 w-16 bg-indigo-600 hover:bg-indigo-700 text-white relative">
              <ShoppingCart className="h-6 w-6 shrink-0" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-xs font-bold px-2 py-1 rounded-full border-2 border-slate-50 dark:border-slate-950">
                  {itemCount}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="p-0 w-full sm:w-[400px] border-l-0">
             <SheetHeader className="sr-only">
               <SheetTitle>Cart</SheetTitle>
               <SheetDescription>View your cart items.</SheetDescription>
             </SheetHeader>
             <div className="h-full w-full bg-slate-50 dark:bg-slate-950">
               <CartSidebar />
             </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}
