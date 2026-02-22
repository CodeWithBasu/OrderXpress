"use client"

import { useState } from "react"
import { Percent, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useCart } from "../context/cart-context"

interface Discount {
  id: string
  type: "percentage" | "fixed"
  value: number
  description: string
  minAmount?: number
}

interface DiscountModalProps {
  isOpen: boolean
  onClose: () => void
}

const predefinedDiscounts: Discount[] = [
  {
    id: "senior",
    type: "percentage",
    value: 10,
    description: "Senior Citizen Discount (10%)",
    minAmount: 0,
  },
  {
    id: "student",
    type: "percentage",
    value: 15,
    description: "Student Discount (15%)",
    minAmount: 0,
  },
  {
    id: "loyalty",
    type: "fixed",
    value: 50,
    description: "Loyalty Member (₹50 off)",
    minAmount: 250,
  },
  {
    id: "bulk",
    type: "percentage",
    value: 20,
    description: "Bulk Order (20% off ₹1000+)",
    minAmount: 1000,
  },
]

export default function DiscountModal({ isOpen, onClose }: DiscountModalProps) {
  const { cartTotal, applyDiscount, removeDiscount, appliedDiscount } = useCart()
  const [customDiscount, setCustomDiscount] = useState({
    type: "percentage" as "percentage" | "fixed",
    value: 0,
    description: "",
  })

  const handleApplyPredefined = (discount: Discount) => {
    if (discount.minAmount && cartTotal < discount.minAmount) {
      alert(`Minimum order amount of ₹${discount.minAmount} required for this discount`)
      return
    }
    applyDiscount(discount)
    onClose()
  }

  const handleApplyCustom = () => {
    if (customDiscount.value <= 0 || !customDiscount.description) {
      alert("Please enter valid discount details")
      return
    }

    const discount: Discount = {
      id: "custom",
      type: customDiscount.type,
      value: customDiscount.value,
      description: customDiscount.description,
    }

    applyDiscount(discount)
    onClose()
  }

  const handleRemoveDiscount = () => {
    removeDiscount()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Apply Discount</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {appliedDiscount && (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-green-800">Current Discount</p>
                    <p className="text-sm text-green-600">{appliedDiscount.description}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleRemoveDiscount}>
                    Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div>
            <h3 className="font-medium mb-3">Predefined Discounts</h3>
            <div className="space-y-2">
              {predefinedDiscounts.map((discount) => {
                const isEligible = !discount.minAmount || cartTotal >= discount.minAmount
                return (
                  <Card
                    key={discount.id}
                    className={`cursor-pointer transition-colors ${isEligible ? "hover:bg-muted/50" : "opacity-50"}`}
                    onClick={() => isEligible && handleApplyPredefined(discount)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {discount.type === "percentage" ? (
                            <Percent className="h-4 w-4 text-blue-500" />
                          ) : (
                            <DollarSign className="h-4 w-4 text-green-500" />
                          )}
                          <div>
                            <p className="font-medium text-sm">{discount.description}</p>
                            {discount.minAmount && (
                              <p className="text-xs text-muted-foreground">Min. order: ₹{discount.minAmount}</p>
                            )}
                          </div>
                        </div>
                        {!isEligible && <span className="text-xs text-red-500">Not eligible</span>}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3">Custom Discount</h3>
            <div className="space-y-3">
              <div>
                <Label>Discount Type</Label>
                <RadioGroup
                  value={customDiscount.type}
                  onValueChange={(value: "percentage" | "fixed") =>
                    setCustomDiscount({ ...customDiscount, type: value })
                  }
                  className="flex gap-4 mt-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="percentage" id="percentage" />
                    <Label htmlFor="percentage">Percentage</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="fixed" id="fixed" />
                    <Label htmlFor="fixed">Fixed Amount</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label>Value</Label>
                <Input
                  type="number"
                  placeholder={customDiscount.type === "percentage" ? "Enter %" : "Enter ₹"}
                  value={customDiscount.value || ""}
                  onChange={(e) =>
                    setCustomDiscount({
                      ...customDiscount,
                      value: Number.parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>

              <div>
                <Label>Description</Label>
                <Input
                  placeholder="Enter discount description"
                  value={customDiscount.description}
                  onChange={(e) =>
                    setCustomDiscount({
                      ...customDiscount,
                      description: e.target.value,
                    })
                  }
                />
              </div>

              <Button onClick={handleApplyCustom} className="w-full">
                Apply Custom Discount
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
