"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useCart } from "@/context/cart-context";
import CartSummary from "@/components/cart-summary";
import { ArrowLeft } from "lucide-react";
import { io } from "socket.io-client";

const SOCKET_SERVER_URL =
  process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || "http://localhost:5001";

export const socket = io(SOCKET_SERVER_URL, {
  transports: ["websocket"],
  withCredentials: true,
});

interface CheckoutPageProps {
  onOrderSubmit: (orderId: string) => void;
  onBack: () => void;
}

export default function CheckoutPage({
  onOrderSubmit,
  onBack,
}: CheckoutPageProps) {
  const { items, getTotalPrice, clearCart } = useCart();
  const [submitted, setSubmitted] = useState(false);

  // Register customer role (optional, safe)
  useEffect(() => {
    socket.on("connect", () => {
      socket.emit("registerRole", "customer");
    });

    return () => {
      socket.off("connect");
    };
  }, []);

  const handleSubmit = async () => {
    if (items.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    const sessionKey = localStorage.getItem("tabifySessionKey");
    if (!sessionKey) {
      alert("Session expired. Please refresh.");
      return;
    }

    setSubmitted(true);

    const total = getTotalPrice();

    let mongoOrderId = "";

    try {
      const response = await fetch(
        `${SOCKET_SERVER_URL}/api/orders/create`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionKey,
            items: items.map((i) => ({
              name: i.name,
              quantity: i.quantity,
              price: i.price,
            })),
            totalAmount: total,
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Order creation failed");
      }

      mongoOrderId = data.order._id;

      // 🔒 DO NOT EMIT SOCKET FROM FRONTEND
      // Backend already emits `newOrder` correctly

    } catch (err) {
      console.error("❌ Order failed:", err);
      alert("Failed to place order");
      setSubmitted(false);
      return;
    }

    localStorage.setItem("orderId", mongoOrderId);

    setTimeout(() => {
      onOrderSubmit(mongoOrderId);
      clearCart();
    }, 1200);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-xl font-semibold">
          Request sent! Waiting for owner…
        </h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 bg-card border-b px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button onClick={onBack}>
            <ArrowLeft />
          </button>
          <h1 className="text-2xl font-bold">Your Order</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <CartSummary />

        <div className="flex justify-between my-6">
          <span>Total</span>
          <span className="text-xl font-bold">
            ₹{getTotalPrice()}
          </span>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-primary text-white py-3 rounded-xl"
        >
          Send Request
        </button>
      </div>
    </div>
  );
}
