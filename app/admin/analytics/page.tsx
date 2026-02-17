"use client"

import { useState, useEffect } from "react"
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package, Download } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { db } from "../../services/database"

interface AnalyticsData {
  revenue: {
    current: number
    previous: number
    growth: number
  }
  orders: {
    current: number
    previous: number
    growth: number
  }
  customers: {
    current: number
    previous: number
    growth: number
  }
  avgOrderValue: {
    current: number
    previous: number
    growth: number
  }
  topProducts: Array<{
    id: number
    name: string
    revenue: number
    quantity: number
    growth: number
  }>
  salesByCategory: Array<{
    category: string
    revenue: number
    percentage: number
  }>
  revenueByDay: Array<{
    date: string
    revenue: number
  }>
  customerSegments: Array<{
    segment: string
    count: number
    percentage: number
    revenue: number
  }>
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [timeRange, setTimeRange] = useState("30d")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAnalytics()
  }, [timeRange])

  const loadAnalytics = async () => {
    setLoading(true)
    try {
      // Simulate loading analytics data
      const transactions = await db.getTransactions()
      const customers = await db.getCustomers()

      // Calculate date ranges
      const endDate = new Date()
      const startDate = new Date()
      const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90
      startDate.setDate(endDate.getDate() - days)

      const previousStartDate = new Date(startDate)
      previousStartDate.setDate(previousStartDate.getDate() - days)

      // Filter transactions for current and previous periods
      const currentTransactions = transactions.filter((t) => {
        const date = new Date(t.timestamp)
        return date >= startDate && date <= endDate
      })

      const previousTransactions = transactions.filter((t) => {
        const date = new Date(t.timestamp)
        return date >= previousStartDate && date < startDate
      })

      // Calculate metrics
      const currentRevenue = currentTransactions.reduce((sum, t) => sum + t.total, 0)
      const previousRevenue = previousTransactions.reduce((sum, t) => sum + t.total, 0)
      const revenueGrowth = previousRevenue > 0 ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 : 0

      const currentOrders = currentTransactions.length
      const previousOrders = previousTransactions.length
      const ordersGrowth = previousOrders > 0 ? ((currentOrders - previousOrders) / previousOrders) * 100 : 0

      const currentCustomers = customers.length
      const previousCustomers = Math.max(1, currentCustomers - Math.floor(Math.random() * 10))
      const customersGrowth = ((currentCustomers - previousCustomers) / previousCustomers) * 100

      const currentAvgOrder = currentOrders > 0 ? currentRevenue / currentOrders : 0
      const previousAvgOrder = previousOrders > 0 ? previousRevenue / previousOrders : 0
      const avgOrderGrowth = previousAvgOrder > 0 ? ((currentAvgOrder - previousAvgOrder) / previousAvgOrder) * 100 : 0

      // Calculate top products
      const productSales = new Map()
      currentTransactions.forEach((transaction) => {
        transaction.items.forEach((item) => {
          const existing = productSales.get(item.id) || { name: item.name, revenue: 0, quantity: 0 }
          existing.revenue += item.total
          existing.quantity += item.quantity
          productSales.set(item.id, existing)
        })
      })

      const topProducts = Array.from(productSales.entries())
        .map(([id, data]) => ({ id: Number(id), ...data, growth: Math.random() * 40 - 10 }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5)

      // Calculate sales by category
      const categorySales = new Map()
      currentTransactions.forEach((transaction) => {
        transaction.items.forEach((item) => {
          // Mock category assignment
          const category = ["food", "drinks", "desserts"][Math.floor(Math.random() * 3)]
          const existing = categorySales.get(category) || 0
          categorySales.set(category, existing + item.total)
        })
      })

      const totalCategoryRevenue = Array.from(categorySales.values()).reduce((sum, val) => sum + val, 0)
      const salesByCategory = Array.from(categorySales.entries()).map(([category, revenue]) => ({
        category,
        revenue,
        percentage: totalCategoryRevenue > 0 ? (revenue / totalCategoryRevenue) * 100 : 0,
      }))

      // Generate mock revenue by day
      const revenueByDay = Array.from({ length: Math.min(days, 30) }, (_, i) => {
        const date = new Date(startDate)
        date.setDate(date.getDate() + i)
        return {
          date: date.toISOString().split("T")[0],
          revenue: Math.random() * 1000 + 200,
        }
      })

      // Mock customer segments
      const customerSegments = [
        {
          segment: "New Customers",
          count: Math.floor(currentCustomers * 0.3),
          percentage: 30,
          revenue: currentRevenue * 0.2,
        },
        {
          segment: "Regular Customers",
          count: Math.floor(currentCustomers * 0.5),
          percentage: 50,
          revenue: currentRevenue * 0.6,
        },
        {
          segment: "VIP Customers",
          count: Math.floor(currentCustomers * 0.2),
          percentage: 20,
          revenue: currentRevenue * 0.2,
        },
      ]

      setAnalytics({
        revenue: { current: currentRevenue, previous: previousRevenue, growth: revenueGrowth },
        orders: { current: currentOrders, previous: previousOrders, growth: ordersGrowth },
        customers: { current: currentCustomers, previous: previousCustomers, growth: customersGrowth },
        avgOrderValue: { current: currentAvgOrder, previous: previousAvgOrder, growth: avgOrderGrowth },
        topProducts,
        salesByCategory,
        revenueByDay,
        customerSegments,
      })
    } catch (error) {
      console.error("Failed to load analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`
  const formatGrowth = (growth: number) => `${growth >= 0 ? "+" : ""}${growth.toFixed(1)}%`

  if (loading || !analytics) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl lg:text-3xl font-bold">Analytics</h1>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">Comprehensive business insights and performance metrics</p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 Days</SelectItem>
              <SelectItem value="30d">30 Days</SelectItem>
              <SelectItem value="90d">90 Days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(analytics.revenue.current)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {analytics.revenue.growth >= 0 ? (
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
              )}
              <span className={analytics.revenue.growth >= 0 ? "text-green-500" : "text-red-500"}>
                {formatGrowth(analytics.revenue.growth)}
              </span>
              <span className="ml-1">from last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.orders.current}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {analytics.orders.growth >= 0 ? (
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
              )}
              <span className={analytics.orders.growth >= 0 ? "text-green-500" : "text-red-500"}>
                {formatGrowth(analytics.orders.growth)}
              </span>
              <span className="ml-1">from last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.customers.current}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {analytics.customers.growth >= 0 ? (
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
              )}
              <span className={analytics.customers.growth >= 0 ? "text-green-500" : "text-red-500"}>
                {formatGrowth(analytics.customers.growth)}
              </span>
              <span className="ml-1">from last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(analytics.avgOrderValue.current)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {analytics.avgOrderValue.growth >= 0 ? (
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
              )}
              <span className={analytics.avgOrderValue.growth >= 0 ? "text-green-500" : "text-red-500"}>
                {formatGrowth(analytics.avgOrderValue.growth)}
              </span>
              <span className="ml-1">from last period</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Analytics */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.topProducts.map((product, index) => (
                <div key={product.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{product.name}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">{product.quantity} sold</span>
                        {product.growth >= 0 ? (
                          <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                            +{product.growth.toFixed(1)}%
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-xs bg-red-100 text-red-700">
                            {product.growth.toFixed(1)}%
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm">{formatCurrency(product.revenue)}</p>
                    <Progress
                      value={(product.revenue / analytics.topProducts[0].revenue) * 100}
                      className="w-20 mt-1"
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sales by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.salesByCategory.map((category) => (
                <div key={category.category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium capitalize">{category.category}</span>
                    <span className="text-sm text-muted-foreground">{formatCurrency(category.revenue)}</span>
                  </div>
                  <Progress value={category.percentage} className="h-2" />
                  <div className="text-xs text-muted-foreground text-right">
                    {category.percentage.toFixed(1)}% of total sales
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Customer Segments */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Segments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.customerSegments.map((segment) => (
                <div key={segment.segment} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{segment.segment}</p>
                    <p className="text-xs text-muted-foreground">{segment.count} customers</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm">{formatCurrency(segment.revenue)}</p>
                    <p className="text-xs text-muted-foreground">{segment.percentage}% of base</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Revenue Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {analytics.revenueByDay.slice(-7).map((day, index) => (
                <div key={day.date} className="flex items-center justify-between">
                  <span className="text-sm">
                    {new Date(day.date).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <div className="flex items-center gap-2">
                    <Progress value={(day.revenue / 1200) * 100} className="w-20" />
                    <span className="text-sm font-medium w-16 text-right">{formatCurrency(day.revenue)}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
