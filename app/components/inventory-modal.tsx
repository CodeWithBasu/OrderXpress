"use client"

import { useState, useEffect } from "react"
import { Package, AlertTriangle, Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { db, type InventoryItem } from "../services/database"

interface InventoryModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function InventoryModal({ isOpen, onClose }: InventoryModalProps) {
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [lowStockItems, setLowStockItems] = useState<InventoryItem[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null)

  useEffect(() => {
    if (isOpen) {
      loadInventory()
      loadLowStockItems()
    }
  }, [isOpen])

  const loadInventory = async () => {
    const items = await db.getInventory()
    setInventory(items)
  }

  const loadLowStockItems = async () => {
    const items = await db.getLowStockItems()
    setLowStockItems(items)
  }

  const handleUpdateStock = async (item: InventoryItem, newStock: number) => {
    const updatedInventory = inventory.map((i) =>
      i.id === item.id ? { ...i, stock: newStock, lastRestocked: new Date() } : i,
    )
    await db.saveInventory(updatedInventory)
    setInventory(updatedInventory)
    loadLowStockItems()
  }

  const filteredInventory = inventory.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Inventory Management</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="inventory" className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="inventory">All Inventory</TabsTrigger>
            <TabsTrigger value="alerts" className="relative">
              Low Stock Alerts
              {lowStockItems.length > 0 && (
                <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 text-xs">
                  {lowStockItems.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="inventory" className="flex-1 flex flex-col">
            <div className="flex gap-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search inventory..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="flex-1 overflow-auto space-y-2">
              {filteredInventory.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-md overflow-hidden">
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Category: {item.category} | Supplier: {item.supplier}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Cost: ${item.cost} | Price: ${item.price}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant={item.stock <= item.lowStockThreshold ? "destructive" : "secondary"}>
                            Stock: {item.stock}
                          </Badge>
                          {item.stock <= item.lowStockThreshold && <AlertTriangle className="h-4 w-4 text-red-500" />}
                        </div>
                        <div className="flex gap-1">
                          <Input
                            type="number"
                            placeholder="Add stock"
                            className="w-20 h-8"
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                const input = e.target as HTMLInputElement
                                const addStock = Number.parseInt(input.value)
                                if (addStock > 0) {
                                  handleUpdateStock(item, item.stock + addStock)
                                  input.value = ""
                                }
                              }
                            }}
                          />
                          <Button size="sm" variant="outline">
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="alerts" className="flex-1 flex flex-col">
            <div className="flex-1 overflow-auto space-y-2">
              {lowStockItems.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No low stock alerts</p>
                </div>
              ) : (
                lowStockItems.map((item) => (
                  <Card key={item.id} className="border-red-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <AlertTriangle className="h-5 w-5 text-red-500" />
                          <div>
                            <p className="font-medium text-red-800">{item.name}</p>
                            <p className="text-sm text-red-600">
                              Only {item.stock} left (threshold: {item.lowStockThreshold})
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Input
                            type="number"
                            placeholder="Restock"
                            className="w-20 h-8"
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                const input = e.target as HTMLInputElement
                                const addStock = Number.parseInt(input.value)
                                if (addStock > 0) {
                                  handleUpdateStock(item, item.stock + addStock)
                                  input.value = ""
                                }
                              }
                            }}
                          />
                          <Button size="sm">Restock</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
