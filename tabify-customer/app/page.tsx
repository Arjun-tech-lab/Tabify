"use client"

import { useState } from "react"
import { CartProvider } from "@/context/cart-context"
import HomePage from "@/components/pages/home-page"
import CheckoutPage from "@/components/pages/checkout-page"
import OrderStatusPage from "@/components/pages/order-status-page"

type PageState = "home" | "checkout" | "order-status"

export default function Page() {
  const [currentPage, setCurrentPage] = useState<PageState>("home")
  const [orderId, setOrderId] = useState<string>("")

  const handleCheckout = () => setCurrentPage("checkout")

  const handleSubmitOrder = (id: string) => {
    setOrderId(id)
    setCurrentPage("order-status")
  }

  const handleBackToHome = () => setCurrentPage("home")

  return (
    <CartProvider>
      {currentPage === "home" && <HomePage onCheckout={handleCheckout} />}
      {currentPage === "checkout" && <CheckoutPage onOrderSubmit={handleSubmitOrder} onBack={handleBackToHome} />}
      {currentPage === "order-status" && <OrderStatusPage orderId={orderId} onBackToHome={handleBackToHome} />}
    </CartProvider>
  )
}
