"use client"

import type React from "react"

import { useState } from "react"
import { Plus, Edit, Trash2, Building2, MapPin, Phone, Mail, MoreHorizontal, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Organization {
  id: string
  name: string
  type: "store" | "warehouse" | "office" | "branch"
  address: string
  city: string
  state: string
  zipCode: string
  phone: string
  email: string
  manager: string
  employees: number
  status: "active" | "inactive"
  description: string
}

const organizationTypes = [
  { value: "store", label: "Store", icon: "🏪" },
  { value: "warehouse", label: "Warehouse", icon: "🏭" },
  { value: "office", label: "Office", icon: "🏢" },
  { value: "branch", label: "Branch", icon: "🏬" },
]

const defaultOrganizations: Organization[] = [
  {
    id: "1",
    name: "Main Store",
    type: "store",
    address: "123 Main Street",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    phone: "(555) 123-4567",
    email: "main@store.com",
    manager: "John Smith",
    employees: 15,
    status: "active",
    description: "Primary retail location in downtown Manhattan",
  },
  {
    id: "2",
    name: "Brooklyn Branch",
    type: "branch",
    address: "456 Brooklyn Ave",
    city: "Brooklyn",
    state: "NY",
    zipCode: "11201",
    phone: "(555) 234-5678",
    email: "brooklyn@store.com",
    manager: "Sarah Johnson",
    employees: 8,
    status: "active",
    description: "Secondary location serving Brooklyn customers",
  },
  {
    id: "3",
    name: "Central Warehouse",
    type: "warehouse",
    address: "789 Industrial Blvd",
    city: "Queens",
    state: "NY",
    zipCode: "11101",
    phone: "(555) 345-6789",
    email: "warehouse@store.com",
    manager: "Mike Davis",
    employees: 25,
    status: "active",
    description: "Main distribution center for inventory management",
  },
]

export default function OrganizationsPage() {
  const [organizations, setOrganizations] = useState<Organization[]>(defaultOrganizations)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null)
  const [formData, setFormData] = useState<Partial<Organization>>({
    name: "",
    type: "store",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
    email: "",
    manager: "",
    employees: 0,
    status: "active",
    description: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const orgData: Organization = {
      id: editingOrg?.id || Date.now().toString(),
      ...(formData as Organization),
    }

    if (editingOrg) {
      setOrganizations(organizations.map((org) => (org.id === editingOrg.id ? orgData : org)))
    } else {
      setOrganizations([...organizations, orgData])
    }

    resetForm()
  }

  const handleEdit = (org: Organization) => {
    setEditingOrg(org)
    setFormData(org)
    setShowAddDialog(true)
  }

  const handleDelete = (orgId: string) => {
    if (confirm("Are you sure you want to delete this organization?")) {
      setOrganizations(organizations.filter((org) => org.id !== orgId))
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      type: "store",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      phone: "",
      email: "",
      manager: "",
      employees: 0,
      status: "active",
      description: "",
    })
    setEditingOrg(null)
    setShowAddDialog(false)
  }

  const getTypeIcon = (type: string) => {
    return organizationTypes.find((t) => t.value === type)?.icon || "🏢"
  }

  const getStatusColor = (status: string) => {
    return status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Organizations</h1>
          <p className="text-muted-foreground">Manage stores, warehouses, and other business locations</p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Organization
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingOrg ? "Edit Organization" : "Add New Organization"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="name">Organization Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="type">Type *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData({ ...formData, type: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {organizationTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.icon} {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="zipCode">ZIP Code *</Label>
                  <Input
                    id="zipCode"
                    value={formData.zipCode}
                    onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <Label htmlFor="manager">Manager</Label>
                  <Input
                    id="manager"
                    value={formData.manager}
                    onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="employees">Employees</Label>
                  <Input
                    id="employees"
                    type="number"
                    value={formData.employees}
                    onChange={(e) => setFormData({ ...formData, employees: Number.parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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

              <div className="flex gap-2 pt-4">
                <Button type="submit">{editingOrg ? "Update Organization" : "Add Organization"}</Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Organizations Grid */}
      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {organizations.map((org) => (
          <Card key={org.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-2xl">
                    {getTypeIcon(org.type)}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{org.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {organizationTypes.find((t) => t.value === org.type)?.label}
                      </Badge>
                      <Badge className={`text-xs ${getStatusColor(org.status)}`}>{org.status}</Badge>
                    </div>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(org)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDelete(org.id)} className="text-red-600">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div>
                  <p>{org.address}</p>
                  <p className="text-muted-foreground">
                    {org.city}, {org.state} {org.zipCode}
                  </p>
                </div>
              </div>

              {org.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{org.phone}</span>
                </div>
              )}

              {org.email && (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{org.email}</span>
                </div>
              )}

              {org.manager && (
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>Manager: {org.manager}</span>
                </div>
              )}

              <div className="flex items-center gap-2 text-sm">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span>{org.employees} employees</span>
              </div>

              {org.description && <p className="text-sm text-muted-foreground mt-2">{org.description}</p>}
            </CardContent>
          </Card>
        ))}
      </div>

      {organizations.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Building2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-medium mb-2">No organizations found</h3>
            <p className="text-muted-foreground mb-4">Get started by adding your first organization</p>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Organization
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
