"use client"

import { motion } from "framer-motion"
import { ShoppingCart } from "lucide-react"

interface CartBarProps {
  totalItems: number
  onCheckout: () => void
}

export default function CartBar({ totalItems, onCheckout }: CartBarProps) {
  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 bg-card border-t border-border/30 shadow-2xl"
    >
      <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}>
            <ShoppingCart className="w-6 h-6 text-primary" />
          </motion.div>
          <div>
            <p className="text-sm text-muted-foreground">Total Items</p>
            <p className="text-xl font-bold text-primary">{totalItems}</p>
          </div>
        </div>
        <button
          onClick={onCheckout}
          className="bg-gradient-to-r from-primary to-accent text-white px-6 py-3 rounded-xl font-semibold transition-all active:scale-95 shadow-lg hover:shadow-xl"
        >
          Checkout
        </button>
      </div>
    </motion.div>
  )
}
