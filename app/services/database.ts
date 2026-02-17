import type { Product } from "../context/cart-context"

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  loyaltyPoints: number
  totalSpent: number
  createdAt: Date
  lastVisit: Date
}

export interface Transaction {
  id: string
  customerId?: string
  items: Array<{
    id: number
    name: string
    price: number
    quantity: number
    total: number
  }>
  subtotal: number
  tax: number
  discount: number
  total: number
  paymentMethod: string
  timestamp: Date
  receiptNumber: string
  cashierName?: string
}

export interface InventoryItem extends Product {
  stock: number
  lowStockThreshold: number
  supplier: string
  lastRestocked: Date
  cost: number
}

export interface SalesReport {
  date: string
  totalSales: number
  totalTransactions: number
  averageTransaction: number
  topProducts: Array<{
    id: number
    name: string
    quantity: number
    revenue: number
  }>
}

class DatabaseService {
  private getStorageKey(key: string): string {
    return `pos_${key}`
  }

  // Customer Management
  async getCustomers(): Promise<Customer[]> {
    const customers = localStorage.getItem(this.getStorageKey("customers"))
    return customers ? JSON.parse(customers) : []
  }

  async getCustomer(id: string): Promise<Customer | null> {
    const customers = await this.getCustomers()
    return customers.find((c) => c.id === id) || null
  }

  async saveCustomer(customer: Customer): Promise<void> {
    const customers = await this.getCustomers()
    const existingIndex = customers.findIndex((c) => c.id === customer.id)

    if (existingIndex >= 0) {
      customers[existingIndex] = customer
    } else {
      customers.push(customer)
    }

    localStorage.setItem(this.getStorageKey("customers"), JSON.stringify(customers))
  }

  async searchCustomers(query: string): Promise<Customer[]> {
    const customers = await this.getCustomers()
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.email.toLowerCase().includes(query.toLowerCase()) ||
        c.phone.includes(query),
    )
  }

  // Transaction Management
  async getTransactions(): Promise<Transaction[]> {
    const transactions = localStorage.getItem(this.getStorageKey("transactions"))
    return transactions ? JSON.parse(transactions) : []
  }

  async saveTransaction(transaction: Transaction): Promise<void> {
    const transactions = await this.getTransactions()
    transactions.push(transaction)
    localStorage.setItem(this.getStorageKey("transactions"), JSON.stringify(transactions))
  }

  async getTransactionsByCustomer(customerId: string): Promise<Transaction[]> {
    const transactions = await this.getTransactions()
    return transactions.filter((t) => t.customerId === customerId)
  }

  // Inventory Management
  async getInventory(): Promise<InventoryItem[]> {
    const inventory = localStorage.getItem(this.getStorageKey("inventory"))
    if (!inventory) {
      // Initialize with default inventory
      const defaultInventory = this.getDefaultInventory()
      await this.saveInventory(defaultInventory)
      return defaultInventory
    }
    return JSON.parse(inventory)
  }

  async saveInventory(inventory: InventoryItem[]): Promise<void> {
    localStorage.setItem(this.getStorageKey("inventory"), JSON.stringify(inventory))
  }

  async updateStock(productId: number, quantity: number): Promise<void> {
    const inventory = await this.getInventory()
    const item = inventory.find((i) => i.id === productId)
    if (item) {
      item.stock = Math.max(0, item.stock - quantity)
      await this.saveInventory(inventory)
    }
  }

  async getLowStockItems(): Promise<InventoryItem[]> {
    const inventory = await this.getInventory()
    return inventory.filter((item) => item.stock <= item.lowStockThreshold)
  }

  // Sales Reports
  async generateSalesReport(startDate: Date, endDate: Date): Promise<SalesReport> {
    const transactions = await this.getTransactions()
    const filteredTransactions = transactions.filter((t) => {
      const transactionDate = new Date(t.timestamp)
      return transactionDate >= startDate && transactionDate <= endDate
    })

    const totalSales = filteredTransactions.reduce((sum, t) => sum + t.total, 0)
    const totalTransactions = filteredTransactions.length
    const averageTransaction = totalTransactions > 0 ? totalSales / totalTransactions : 0

    // Calculate top products
    const productSales = new Map<number, { name: string; quantity: number; revenue: number }>()

    filteredTransactions.forEach((transaction) => {
      transaction.items.forEach((item) => {
        const existing = productSales.get(item.id) || { name: item.name, quantity: 0, revenue: 0 }
        existing.quantity += item.quantity
        existing.revenue += item.total
        productSales.set(item.id, existing)
      })
    })

    const topProducts = Array.from(productSales.entries())
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10)

    return {
      date: new Date().toISOString().split("T")[0],
      totalSales,
      totalTransactions,
      averageTransaction,
      topProducts,
    }
  }

  private getDefaultInventory(): InventoryItem[] {
    return [
      {
        id: 1,
        name: "Cheeseburger",
        price: 8.99,
        image: "/classic-beef-burger.png",
        category: "food",
        stock: 50,
        lowStockThreshold: 10,
        supplier: "Food Supplier Co.",
        lastRestocked: new Date(),
        cost: 4.5,
      },
      {
        id: 2,
        name: "Pepperoni Pizza",
        price: 12.99,
        image: "/delicious-pizza.png",
        category: "food",
        stock: 30,
        lowStockThreshold: 5,
        supplier: "Pizza Ingredients Ltd.",
        lastRestocked: new Date(),
        cost: 6.5,
      },
      // Add more default inventory items...
    ]
  }
}

export const db = new DatabaseService()
