"use client"

import { useState, useEffect } from "react"
import { Search, Plus, User, Phone, Mail, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { db, type Customer } from "../services/database"
import { useCart } from "../context/cart-context"

interface CustomerModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CustomerModal({ isOpen, onClose }: CustomerModalProps) {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phone: "",
  })
  const { customer, setCustomer } = useCart()

  useEffect(() => {
    if (isOpen) {
      loadCustomers()
    }
  }, [isOpen])

  const loadCustomers = async () => {
    const allCustomers = await db.getCustomers()
    setCustomers(allCustomers)
  }

  const handleSearch = async (query: string) => {
    setSearchQuery(query)
    if (query.trim()) {
      const results = await db.searchCustomers(query)
      setCustomers(results)
    } else {
      loadCustomers()
    }
  }

  const handleAddCustomer = async () => {
    if (!newCustomer.name || !newCustomer.email) return

    const customer: Customer = {
      id: Date.now().toString(),
      name: newCustomer.name,
      email: newCustomer.email,
      phone: newCustomer.phone,
      loyaltyPoints: 0,
      totalSpent: 0,
      createdAt: new Date(),
      lastVisit: new Date(),
    }

    await db.saveCustomer(customer)
    setNewCustomer({ name: "", email: "", phone: "" })
    setShowAddForm(false)
    loadCustomers()
  }

  const handleSelectCustomer = (selectedCustomer: Customer) => {
    setCustomer(selectedCustomer)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Customer Management</DialogTitle>
        </DialogHeader>

        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search customers..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <Button onClick={() => setShowAddForm(!showAddForm)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Customer
          </Button>
        </div>

        {showAddForm && (
          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="text-lg">Add New Customer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddCustomer}>Save Customer</Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex-1 overflow-auto space-y-2">
          {customer && (
            <Card className="border-primary">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{customer.name}</p>
                      <p className="text-sm text-muted-foreground">Current Customer</p>
                    </div>
                  </div>
                  <Button variant="outline" onClick={() => setCustomer(null)}>
                    Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {customers.map((cust) => (
            <Card key={cust.id} className="cursor-pointer hover:bg-muted/50" onClick={() => handleSelectCustomer(cust)}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">{cust.name}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        {cust.email}
                        {cust.phone && (
                          <>
                            <Phone className="h-3 w-3 ml-2" />
                            {cust.phone}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary" className="mb-1">
                      <Award className="h-3 w-3 mr-1" />
                      {cust.loyaltyPoints} pts
                    </Badge>
                    <p className="text-sm text-muted-foreground">Spent: ${cust.totalSpent.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {customers.length === 0 && <div className="text-center py-8 text-muted-foreground">No customers found</div>}
        </div>
      </DialogContent>
    </Dialog>
  )
}
