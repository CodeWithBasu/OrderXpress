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
  _id?: string
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
    try {
      const res = await fetch("/api/customers")
      if (!res.ok) throw new Error("Failed to fetch customers")
      return await res.json()
    } catch (e) {
      console.error(e)
      const customers = localStorage.getItem(this.getStorageKey("customers"))
      return customers ? JSON.parse(customers) : []
    }
  }

  async getCustomer(id: string): Promise<Customer | null> {
    const customers = await this.getCustomers()
    return customers.find((c) => c.id === id) || null
  }

  async saveCustomer(customer: Customer): Promise<void> {
    try {
      const id = customer.id
      const url = `/api/customers/${id}`
      const method = "PUT"
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customer),
      })
      if (!res.ok) {
         // Fallback if not found during PUT, try POST
         if (res.status === 404) {
             await fetch("/api/customers", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(customer),
             })
             return;
         }
         throw new Error("Failed to save customer")
      }
    } catch (e) {
      console.error(e)
      const customers = await this.getCustomers()
      const existingIndex = customers.findIndex((c) => c.id === customer.id)

      if (existingIndex >= 0) {
        customers[existingIndex] = customer
      } else {
        customers.push(customer)
      }

      localStorage.setItem(this.getStorageKey("customers"), JSON.stringify(customers))
    }
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
    try {
      const res = await fetch("/api/transactions")
      if (!res.ok) throw new Error("Failed to fetch transactions")
      return await res.json()
    } catch (e) {
      console.error(e)
      const transactions = localStorage.getItem(this.getStorageKey("transactions"))
      return transactions ? JSON.parse(transactions) : []
    }
  }

  async saveTransaction(transaction: Transaction): Promise<void> {
    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transaction),
      })
      if (!res.ok) throw new Error("Failed to save transaction")
    } catch (e) {
      console.error(e)
      const transactions = await this.getTransactions()
      transactions.push(transaction)
      localStorage.setItem(this.getStorageKey("transactions"), JSON.stringify(transactions))
    }
  }

  async getTransactionsByCustomer(customerId: string): Promise<Transaction[]> {
    try {
      const res = await fetch(`/api/transactions?customerId=${customerId}`)
      if (!res.ok) throw new Error("Failed to fetch customer transactions")
      return await res.json()
    } catch (e) {
      console.error(e)
      const transactions = await this.getTransactions()
      return transactions.filter((t) => t.customerId === customerId)
    }
  }

  // Inventory Management
  async getInventory(): Promise<InventoryItem[]> {
    try {
      const res = await fetch('/api/products');
      if (!res.ok) throw new Error("Failed to fetch products");
      return await res.json();
    } catch (e) {
      console.error(e);
      // Temporary fallback if DB not configured
      const inventory = localStorage.getItem(this.getStorageKey("inventory"));
      if (!inventory) return this.getDefaultInventory();
      return JSON.parse(inventory);
    }
  }

  async saveInventory(inventory: InventoryItem[]): Promise<void> {
    // Legacy method for bulk saves, falling back to local storage
    localStorage.setItem(this.getStorageKey("inventory"), JSON.stringify(inventory));
  }

  async saveProduct(product: Partial<InventoryItem>): Promise<InventoryItem | null> {
    try {
      const id = product.id;
      const url = id ? `/api/products/${id}` : "/api/products";
      const method = id ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });
      if (!res.ok) throw new Error("Failed to save product");
      return await res.json();
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async deleteProduct(productId: number): Promise<boolean> {
    try {
      const res = await fetch(`/api/products/${productId}`, { method: "DELETE" });
      return res.ok;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  async updateStock(productId: number, quantity: number): Promise<void> {
    try {
      // Get current from DB
      const res = await fetch(`/api/products`);
      if (!res.ok) throw new Error();
      const products: InventoryItem[] = await res.json();
      const item = products.find(p => p.id === productId);
      if (item) {
        await fetch(`/api/products/${productId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ stock: Math.max(0, item.stock - quantity) })
        });
      }
    } catch (e) {
      console.error("Stock update failed", e);
    }
  }

  async getLowStockItems(): Promise<InventoryItem[]> {
    const inventory = await this.getInventory();
    return inventory.filter((item) => item.stock <= item.lowStockThreshold);
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
        price: 199,
        image: "/classic-beef-burger.png",
        category: "food",
        stock: 50,
        lowStockThreshold: 10,
        supplier: "Food Supplier Co.",
        lastRestocked: new Date(),
        cost: 100,
      },
      {
        id: 2,
        name: "Pepperoni Pizza",
        price: 399,
        image: "/delicious-pizza.png",
        category: "food",
        stock: 30,
        lowStockThreshold: 5,
        supplier: "Pizza Ingredients Ltd.",
        lastRestocked: new Date(),
        cost: 200,
      },
      // Add more default inventory items...
    ]
  }
}

export const db = new DatabaseService()
