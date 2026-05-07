"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useCart } from "@/context/cart-context"
import { Plus, Minus } from "lucide-react"

interface ItemCardProps {
  item: {
    id: number
    name: string
    price: number
    image?: string
  }
}

export default function ItemCard({ item }: ItemCardProps) {
  const [quantity, setQuantity] = useState(0)
  const { addItem } = useCart()

  const handleAdd = () => setQuantity((q) => q + 1)
  const handleRemove = () => setQuantity((q) => Math.max(0, q - 1))

  const handleAddToCart = () => {
    if (quantity > 0) {
      addItem({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity,
      })
      setQuantity(0)
    }
  }

  // ✅ Use real image if available, else placeholder
  const imageUrl =
    item.image && item.image.trim() !== ""
      ? item.image
      : `/placeholder.svg?height=200&width=200&query=${encodeURIComponent(item.name)}`

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-card rounded-2xl overflow-hidden border border-border/30 shadow-md hover:shadow-lg transition-shadow"
    >
      {/* ✅ Image */}
      <div className="aspect-square overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10 relative">
        <img
          src={imageUrl}
          alt={item.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-foreground mb-2">{item.name}</h3>
        <p className="text-2xl font-bold text-primary mb-4">₹{item.price}</p>

        {/* Quantity Control */}
        {quantity === 0 ? (
          <button
            onClick={handleAdd}
            className="w-full bg-gradient-to-r from-primary to-accent text-white py-3 rounded-xl font-semibold transition-all active:scale-95 shadow-md hover:shadow-lg"
          >
            Add to Cart
          </button>
        ) : (
          <div className="flex items-center gap-2 bg-muted rounded-xl p-1">
            <button onClick={handleRemove} className="p-2 hover:bg-white/50 rounded-lg transition-colors">
              <Minus className="w-5 h-5 text-primary" />
            </button>
            <span className="flex-1 text-center font-semibold text-lg text-foreground">{quantity}</span>
            <button onClick={handleAdd} className="p-2 hover:bg-white/50 rounded-lg transition-colors">
              <Plus className="w-5 h-5 text-primary" />
            </button>
          </div>
        )}

        {/* Confirm Button */}
        {quantity > 0 && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={handleAddToCart}
            className="w-full mt-2 bg-secondary text-secondary-foreground py-2 rounded-xl font-semibold transition-all active:scale-95"
          >
            Confirm
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}
