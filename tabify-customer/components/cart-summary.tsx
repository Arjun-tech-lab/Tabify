"use client"

import { motion } from "framer-motion"
import { useCart } from "@/context/cart-context"
import { X } from "lucide-react"

export default function CartSummary() {
  const { items, removeItem, getTotalPrice } = useCart()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-card rounded-2xl p-6 border border-border/50 mb-6"
    >
      <h2 className="text-xl font-bold text-foreground mb-4">Order Summary</h2>

      {items.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">Your cart is empty</p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center justify-between bg-muted/40 rounded-xl p-4"
            >
              <div className="flex-1">
                <p className="font-semibold text-foreground">{item.name}</p>
                <p className="text-sm text-muted-foreground">
                  {item.quantity} × ₹{item.price}
                </p>
              </div>
              <div className="text-right mr-4">
                <p className="font-bold text-primary">₹{item.price * item.quantity}</p>
              </div>
              <button
                onClick={() => removeItem(item.id)}
                className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
