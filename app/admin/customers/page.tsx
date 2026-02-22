"use client"

import { useState, useEffect } from "react"
import { Search, Plus, User, Mail, Phone, ShoppingBag, Star, MoreHorizontal, Edit, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { db, type Customer } from "../../services/database"

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  })

  useEffect(() => {
    loadCustomers()
  }, [])

  useEffect(() => {
    filterCustomers()
  }, [customers, searchQuery])

  const loadCustomers = async () => {
    const data = await db.getCustomers()
    setCustomers(data)
  }

  const filterCustomers = () => {
    let filtered = customers
    if (searchQuery) {
      filtered = filtered.filter(
        (customer) =>
          customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          customer.phone.includes(searchQuery),
      )
    }
    setFilteredCustomers(filtered)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSaveCustomer = async () => {
    const customerData: Customer = {
      id: editingCustomer ? editingCustomer.id : Date.now().toString(),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      loyaltyPoints: editingCustomer ? editingCustomer.loyaltyPoints : 0,
      totalSpent: editingCustomer ? editingCustomer.totalSpent : 0,
      createdAt: editingCustomer ? editingCustomer.createdAt : new Date(),
      lastVisit: editingCustomer ? editingCustomer.lastVisit : new Date(),
    }

    await db.saveCustomer(customerData)
    
    if (editingCustomer) {
      setCustomers(customers.map(c => c.id === editingCustomer.id ? customerData : c))
    } else {
      setCustomers([...customers, customerData])
    }
    
    setIsAddCustomerOpen(false)
    setEditingCustomer(null)
    setFormData({ name: "", email: "", phone: "" })
  }

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer)
    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
    })
    setIsAddCustomerOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Customers</h1>
          <p className="text-muted-foreground">Manage your customer loyalty program</p>
        </div>
        <Button onClick={() => {
          setEditingCustomer(null)
          setFormData({ name: "", email: "", phone: "" })
          setIsAddCustomerOpen(true)
        }}>
          <Plus className="mr-2 h-4 w-4" />
          Add Customer
        </Button>
      </div>

      <Card>
        <CardHeader className="p-4 sm:p-6 pb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-lg font-medium">All Customers</CardTitle>
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search customers..."
                className="w-full pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="px-4 py-3 font-medium">Contact</th>
                  <th className="px-4 py-3 font-medium">Loyalty Points</th>
                  <th className="px-4 py-3 font-medium hidden sm:table-cell">Total Spent</th>
                  <th className="px-4 py-3 font-medium hidden md:table-cell">Last Visit</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                      No customers found
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <User className="h-5 w-5" />
                          </div>
                          <div className="font-medium whitespace-nowrap">{customer.name}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm whitespace-nowrap">
                          <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                            <Mail className="h-3.5 w-3.5" />
                            {customer.email}
                          </div>
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Phone className="h-3.5 w-3.5" />
                            {customer.phone}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="secondary" className="whitespace-nowrap">
                          <Star className="mr-1.5 h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                          {customer.loyaltyPoints} pts
                        </Badge>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell whitespace-nowrap">
                        <div className="flex items-center gap-1.5 font-medium">
                          <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                          ₹{customer.totalSpent.toFixed(2)}
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell text-muted-foreground whitespace-nowrap">
                        {new Date(customer.lastVisit).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditCustomer(customer)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isAddCustomerOpen} onOpenChange={setIsAddCustomerOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingCustomer ? "Edit Customer" : "Add New Customer"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="John Doe"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="john@example.com"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+91..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddCustomerOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveCustomer}>
              {editingCustomer ? "Save Changes" : "Add Customer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
