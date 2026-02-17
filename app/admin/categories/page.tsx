"use client"

import type React from "react"

import { useState } from "react"
import { Plus, Edit, Trash2, Package, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

interface Category {
  id: string
  name: string
  description: string
  productCount: number
  color: string
  icon: string
}

const defaultCategories: Category[] = [
  {
    id: "food",
    name: "Food",
    description: "Main dishes, appetizers, and meals",
    productCount: 8,
    color: "#ef4444",
    icon: "🍽️",
  },
  {
    id: "drinks",
    name: "Drinks",
    description: "Beverages, soft drinks, and juices",
    productCount: 5,
    color: "#3b82f6",
    icon: "🥤",
  },
  {
    id: "desserts",
    name: "Desserts",
    description: "Sweet treats and desserts",
    productCount: 5,
    color: "#f59e0b",
    icon: "🍰",
  },
  {
    id: "snacks",
    name: "Snacks",
    description: "Light snacks and finger foods",
    productCount: 0,
    color: "#10b981",
    icon: "🍿",
  },
]

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(defaultCategories)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: "#3b82f6",
    icon: "📦",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const categoryData: Category = {
      id: editingCategory?.id || formData.name.toLowerCase().replace(/\s+/g, "-"),
      ...formData,
      productCount: editingCategory?.productCount || 0,
    }

    if (editingCategory) {
      setCategories(categories.map((c) => (c.id === editingCategory.id ? categoryData : c)))
    } else {
      setCategories([...categories, categoryData])
    }

    resetForm()
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      description: category.description,
      color: category.color,
      icon: category.icon,
    })
    setShowAddDialog(true)
  }

  const handleDelete = (categoryId: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      setCategories(categories.filter((c) => c.id !== categoryId))
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      color: "#3b82f6",
      icon: "📦",
    })
    setEditingCategory(null)
    setShowAddDialog(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Categories</h1>
          <p className="text-muted-foreground">Organize your products into categories</p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingCategory ? "Edit Category" : "Add New Category"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Category Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="icon">Icon (Emoji)</Label>
                  <Input
                    id="icon"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    placeholder="📦"
                  />
                </div>
                <div>
                  <Label htmlFor="color">Color</Label>
                  <Input
                    id="color"
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit">{editingCategory ? "Update Category" : "Add Category"}</Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Categories Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {categories.map((category) => (
          <Card key={category.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-lg"
                    style={{ backgroundColor: category.color }}
                  >
                    {category.icon}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                    <Badge variant="secondary" className="text-xs">
                      {category.productCount} products
                    </Badge>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(category)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDelete(category.id)} className="text-red-600">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{category.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {categories.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-medium mb-2">No categories found</h3>
            <p className="text-muted-foreground mb-4">Get started by adding your first category</p>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
