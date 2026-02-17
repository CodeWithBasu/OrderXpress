"use client"

import { useState, useEffect } from "react"
import { Search, Filter, Eye, Printer, RefreshCw, Calendar, DollarSign, Package, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { db, type Transaction } from "../../services/database"

interface OrderDetails extends Transaction {
  customerName?: string
  customerEmail?: string
}

const orderStatuses = [
  { value: "pending", label: "Pending", color: "bg-yellow-100 text-yellow-800" },
  { value: "processing", label: "Processing", color: "bg-blue-100 text-blue-800" },
  { value: "completed", label: "Completed", color: "bg-green-100 text-green-800" },
  { value: "cancelled", label: "Cancelled", color: "bg-red-100 text-red-800" },
  { value: "refunded", label: "Refunded", color: "bg-gray-100 text-gray-800" },
]

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderDetails[]>([])
  const [filteredOrders, setFilteredOrders] = useState<OrderDetails[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedOrder, setSelectedOrder] = useState<OrderDetails | null>(null)
  const [showOrderDetails, setShowOrderDetails] = useState(false)

  useEffect(() => {
    loadOrders()
  }, [])

  useEffect(() => {
    filterOrders()
  }, [orders, searchQuery, statusFilter])

  const loadOrders = async () => {
    const transactions = await db.getTransactions()
    const customers = await db.getCustomers()

    const ordersWithCustomerInfo: OrderDetails[] = transactions.map((transaction) => {
      const customer = customers.find((c) => c.id === transaction.customerId)
      return {
        ...transaction,
        customerName: customer?.name || "Guest",
        customerEmail: customer?.email || "",
      }
    })

    setOrders(ordersWithCustomerInfo.reverse()) // Most recent first
  }

  const filterOrders = () => {
    let filtered = orders

    if (searchQuery) {
      filtered = filtered.filter(
        (order) =>
          order.receiptNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.customerEmail?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      // For demo purposes, we'll assign random statuses
      filtered = filtered.filter((_, index) => {
        const statuses = ["completed", "pending", "processing"]
        const status = statuses[index % statuses.length]
        return status === statusFilter
      })
    }

    setFilteredOrders(filtered)
  }

  const getOrderStatus = (index: number) => {
    const statuses = ["completed", "pending", "processing", "completed", "completed"]
    return statuses[index % statuses.length]
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = orderStatuses.find((s) => s.value === status)
    return statusConfig || orderStatuses[0]
  }

  const handleViewOrder = (order: OrderDetails) => {
    setSelectedOrder(order)
    setShowOrderDetails(true)
  }

  const handlePrintReceipt = (order: OrderDetails) => {
    // In a real app, this would trigger receipt printing
    console.log("Printing receipt for order:", order.receiptNumber)
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Orders</h1>
          <p className="text-muted-foreground">Manage and track all orders</p>
        </div>
        <Button onClick={loadOrders}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Total Orders</span>
            </div>
            <p className="text-2xl font-bold mt-1">{orders.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Total Revenue</span>
            </div>
            <p className="text-2xl font-bold mt-1">${orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium">Pending</span>
            </div>
            <p className="text-2xl font-bold mt-1">{orders.filter((_, i) => getOrderStatus(i) === "pending").length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium">Today</span>
            </div>
            <p className="text-2xl font-bold mt-1">
              {
                orders.filter((order) => {
                  const today = new Date().toDateString()
                  return new Date(order.timestamp).toDateString() === today
                }).length
              }
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search orders..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {orderStatuses.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <div className="min-w-full">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 p-4 border-b bg-muted/50 text-sm font-medium">
                <div className="col-span-2">Order ID</div>
                <div className="col-span-2">Customer</div>
                <div className="col-span-2">Date</div>
                <div className="col-span-1">Items</div>
                <div className="col-span-2">Total</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-1">Actions</div>
              </div>

              {/* Table Body */}
              <div className="divide-y">
                {filteredOrders.map((order, index) => {
                  const status = getOrderStatus(index)
                  const statusConfig = getStatusBadge(status)

                  return (
                    <div key={order.id} className="grid grid-cols-12 gap-4 p-4 hover:bg-muted/50">
                      <div className="col-span-2">
                        <p className="font-medium">#{order.receiptNumber}</p>
                        <p className="text-xs text-muted-foreground">{order.paymentMethod}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="font-medium">{order.customerName}</p>
                        {order.customerEmail && <p className="text-xs text-muted-foreground">{order.customerEmail}</p>}
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm">{formatDate(order.timestamp)}</p>
                      </div>
                      <div className="col-span-1">
                        <p className="text-sm">{order.items.length}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="font-medium">${order.total.toFixed(2)}</p>
                        {order.discount > 0 && (
                          <p className="text-xs text-green-600">-${order.discount.toFixed(2)} discount</p>
                        )}
                      </div>
                      <div className="col-span-2">
                        <Badge className={statusConfig.color}>{statusConfig.label}</Badge>
                      </div>
                      <div className="col-span-1">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewOrder(order)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handlePrintReceipt(order)}>
                              <Printer className="h-4 w-4 mr-2" />
                              Print Receipt
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {filteredOrders.length === 0 && (
            <div className="p-12 text-center">
              <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-medium mb-2">No orders found</h3>
              <p className="text-muted-foreground">
                {searchQuery || statusFilter !== "all"
                  ? "Try adjusting your search or filters"
                  : "Orders will appear here once customers start making purchases"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Details Modal */}
      <Dialog open={showOrderDetails} onOpenChange={setShowOrderDetails}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details - #{selectedOrder?.receiptNumber}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              {/* Order Info */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <h3 className="font-medium mb-2">Customer Information</h3>
                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="font-medium">Name:</span> {selectedOrder.customerName}
                    </p>
                    {selectedOrder.customerEmail && (
                      <p>
                        <span className="font-medium">Email:</span> {selectedOrder.customerEmail}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Order Information</h3>
                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="font-medium">Date:</span> {formatDate(selectedOrder.timestamp)}
                    </p>
                    <p>
                      <span className="font-medium">Payment:</span> {selectedOrder.paymentMethod}
                    </p>
                    <p>
                      <span className="font-medium">Status:</span>{" "}
                      <Badge className={getStatusBadge(getOrderStatus(0)).color}>
                        {getStatusBadge(getOrderStatus(0)).label}
                      </Badge>
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Order Items */}
              <div>
                <h3 className="font-medium mb-4">Order Items</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          ${item.price.toFixed(2)} × {item.quantity}
                        </p>
                      </div>
                      <p className="font-medium">${item.total.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Order Summary */}
              <div>
                <h3 className="font-medium mb-4">Order Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${selectedOrder.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${selectedOrder.tax.toFixed(2)}</span>
                  </div>
                  {selectedOrder.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-${selectedOrder.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-medium text-lg">
                    <span>Total</span>
                    <span>${selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4">
                <Button onClick={() => handlePrintReceipt(selectedOrder)}>
                  <Printer className="h-4 w-4 mr-2" />
                  Print Receipt
                </Button>
                <Button variant="outline" onClick={() => setShowOrderDetails(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
