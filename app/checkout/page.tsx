"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, CreditCard, Wallet } from "lucide-react"

import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useCart } from "../context/cart-context"
import { db } from "../services/database"

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, cartTotal, clearCart, customer, discountAmount } = useCart()
  const [paymentMethod, setPaymentMethod] = useState("card")

  const tax = cartTotal * 0.1
  const grandTotal = cartTotal - discountAmount + tax

  const handlePayment = async () => {
    const transaction = {
      id: Date.now().toString(),
      customerId: customer?.id,
      items: cart.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        total: item.price * item.quantity,
      })),
      subtotal: cartTotal,
      tax: tax,
      discount: discountAmount,
      total: grandTotal,
      paymentMethod: paymentMethod,
      timestamp: new Date(),
      receiptNumber: Math.floor(100000 + Math.random() * 900000).toString(),
    }

    // Save transaction
    await db.saveTransaction(transaction)

    // Update customer loyalty points and spending
    if (customer) {
      const updatedCustomer = {
        ...customer,
        loyaltyPoints: customer.loyaltyPoints + Math.floor(grandTotal),
        totalSpent: customer.totalSpent + grandTotal,
        lastVisit: new Date(),
      }
      await db.saveCustomer(updatedCustomer)
    }

    // Update inventory
    for (const item of cart) {
      await db.updateStock(item.id, item.quantity)
    }

    router.push("/success")
  }

  if (cart.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Your cart is empty</h1>
          <p className="mt-2 text-muted-foreground">Add some items to your cart before checkout</p>
          <Button className="mt-4" onClick={() => router.push("/")}>
            Return to POS
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <Button variant="ghost" className="mb-6" onClick={() => router.push("/")}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to POS
      </Button>

      <h1 className="mb-6 text-3xl font-bold">Checkout</h1>

      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="mb-4 text-xl font-semibold">Order Summary</h2>
          <div className="rounded-lg border p-4 bg-white">
            {cart.map((item) => (
              <div key={item.id} className="mb-3 flex justify-between">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">
                    ${item.price.toFixed(2)} × {item.quantity}
                  </p>
                </div>
                <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}

            <Separator className="my-4" />

            <div className="space-y-2">
              <div className="flex justify-between">
                <p>Subtotal</p>
                <p>${cartTotal.toFixed(2)}</p>
              </div>
              <div className="flex justify-between">
                <p>Tax (10%)</p>
                <p>${tax.toFixed(2)}</p>
              </div>
              <div className="flex justify-between">
                <p>Discount</p>
                <p>-${discountAmount.toFixed(2)}</p>
              </div>
              <div className="flex justify-between font-bold">
                <p>Total</p>
                <p>${grandTotal.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="mb-4 text-xl font-semibold">Payment Method</h2>
          <div className="rounded-lg border p-4 bg-white">
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              <div className="flex items-center space-x-2 rounded-md border p-3">
                <RadioGroupItem value="card" id="card" />
                <Label htmlFor="card" className="flex items-center">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Credit/Debit Card
                </Label>
              </div>

              <div className="mt-3 flex items-center space-x-2 rounded-md border p-3">
                <RadioGroupItem value="cash" id="cash" />
                <Label htmlFor="cash" className="flex items-center">
                  <Wallet className="mr-2 h-4 w-4" />
                  Cash
                </Label>
              </div>
            </RadioGroup>

            <Button className="mt-6 w-full" size="lg" onClick={handlePayment}>
              Complete Payment
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
