"use client"

import type React from "react"

import { Coffee, IceCream, LayoutGrid, Utensils } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface CategorySidebarProps {
  selectedCategory: string
  onSelectCategory: (category: string) => void
}

interface CategoryItem {
  id: string
  name: string
  icon: React.ElementType
}

const categories: CategoryItem[] = [
  {
    id: "all",
    name: "All Products",
    icon: LayoutGrid,
  },
  {
    id: "food",
    name: "Fast Food",
    icon: Utensils,
  },
  {
    id: "main courses",
    name: "Main Courses",
    icon: Utensils,
  },
  {
    id: "drinks",
    name: "Soft Drinks",
    icon: Coffee,
  },
  {
    id: "desserts",
    name: "Desserts",
    icon: IceCream,
  },
  {
    id: "snacks",
    name: "Appetizers",
    icon: Utensils,
  },
  {
    id: "beverages",
    name: "Beverages",
    icon: Coffee,
  },
]

export default function CategorySidebar({ selectedCategory, onSelectCategory }: CategorySidebarProps) {
  return (
    <div className="w-56 border-r border-slate-200/60 dark:border-slate-800/60 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl p-4 shadow-sm z-20">
      <h2 className="mb-6 text-sm uppercase tracking-wider text-muted-foreground font-semibold">Categories</h2>
      <div className="grid gap-3">
        {categories.map((category) => {
          const Icon = category.icon
          return (
            <Button
              key={category.id}
              variant="ghost"
              className={cn(
                "flex h-auto flex-col items-center justify-center py-4 border transition-all duration-300 rounded-xl",
                selectedCategory === category.id
                  ? "border-transparent bg-indigo-500 text-white shadow-md shadow-indigo-500/25 scale-[1.02]"
                  : "border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 text-muted-foreground hover:border-indigo-200 dark:hover:border-indigo-800 hover:text-indigo-600 dark:hover:text-indigo-400 hover:shadow-sm"
              )}
              onClick={() => onSelectCategory(category.id)}
            >
              <Icon className="mb-2 h-6 w-6" />
              <span className="text-sm">{category.name}</span>
            </Button>
          )
        })}
      </div>
    </div>
  )
}
