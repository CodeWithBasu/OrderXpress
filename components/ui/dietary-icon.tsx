"use client"

import { cn } from "@/lib/utils"

export function getDietaryType(name: string): 'veg' | 'non-veg' {
  // Common keywords that infer an item is non-vegetarian
  const nonVegKeywords = ['chicken', 'beef', 'pepperoni', 'meat', 'pork', 'fish', 'prawn', 'wings', 'lasagna']
  const isNonVeg = nonVegKeywords.some(keyword => name.toLowerCase().includes(keyword))
  return isNonVeg ? 'non-veg' : 'veg'
}

export function DietaryIcon({ type, className }: { type: 'veg' | 'non-veg', className?: string }) {
  if (type === 'veg') {
    return (
      <div className={cn("w-4 h-4 border-2 border-green-600 rounded-[2px] flex items-center justify-center shrink-0", className)} title="Vegetarian">
        <div className="w-2 h-2 bg-green-600 rounded-full" />
      </div>
    )
  }
  
  return (
    <div className={cn("w-4 h-4 border-2 border-red-600 rounded-[2px] flex items-center justify-center shrink-0", className)} title="Non-Vegetarian">
      <div className="w-2 h-2 bg-red-600 rounded-full" />
    </div>
  )
}
