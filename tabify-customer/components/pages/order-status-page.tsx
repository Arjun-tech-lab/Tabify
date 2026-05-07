"use client";

import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useRouter } from "next/navigation";

export default function OrderStatusPage({ orderId }: { orderId: string }) {
  const router = useRouter();

  const [status, setStatus] = useState<
    "requested" | "accepted" | "completed"
  >("requested");

  const [paymentStatus, setPaymentStatus] = useState<
    "paid" | "unpaid"
  >("unpaid");

  const [showHomeButton, setShowHomeButton] = useState(false);

  const socketRef = useRef<Socket | null>(null);

  const SOCKET_URL =
    process.env.NEXT_PUBLIC_SOCKET_SERVER_URL ||
    "http://localhost:5001";

  /* ✅ Persist orderId */
  useEffect(() => {
    if (orderId) {
      localStorage.setItem("orderId", orderId);
    }
  }, [orderId]);

  /* 🔌 Socket connection */
  useEffect(() => {
    const currentOrderId =
      orderId || localStorage.getItem("orderId");

    if (!currentOrderId) return;

    const socket = io(SOCKET_URL, {
      transports: ["websocket"],
      withCredentials: true,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("registerRole", "customer");
    });

    socket.on("orderUpdate", (updatedOrder: any) => {
      if (String(updatedOrder._id) === String(currentOrderId)) {
        setStatus(updatedOrder.status);
        setPaymentStatus(updatedOrder.paymentStatus);

        if (updatedOrder.paymentStatus === "paid") {
          setShowHomeButton(true);
        }
      }
    });

    return () => socket.disconnect();
  }, [orderId, SOCKET_URL]);

  /* 💳 Handle payment */
  const handlePayment = (method: "upi" | "later") => {
    const currentOrderId =
      orderId || localStorage.getItem("orderId");

    if (!socketRef.current || !currentOrderId) return;

    const newPaymentStatus =
      method === "upi" ? "paid" : "unpaid";

    socketRef.current.emit("updatePaymentStatus", {
      orderId: currentOrderId,
      paymentStatus: newPaymentStatus,
    });

    // ✅ Show home button instead of redirect
    setShowHomeButton(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-2xl font-bold mb-4">
        🧾 Order #{orderId.slice(-6)}
      </h1>

      <p className="text-lg mb-2 font-medium">
        Status: {status}
      </p>

      <p className="text-lg mb-4 font-medium">
        Payment: {paymentStatus}
      </p>

      {status === "requested" && (
        <p className="text-yellow-600 font-medium mt-4">
          ⏳ Waiting for shop owner to accept your order
        </p>
      )}

      {status === "accepted" &&
        paymentStatus === "unpaid" &&
        !showHomeButton && (
          <div className="space-y-3 mt-4">
            <button
              onClick={() => handlePayment("upi")}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg shadow-md"
            >
              💳 Pay Now
            </button>

            <button
              onClick={() => handlePayment("later")}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg shadow-md"
            >
              🤝 Pay Later
            </button>
          </div>
        )}

      {showHomeButton && (
        <div className="mt-6 space-y-3">
          <p className="text-green-600 font-semibold text-lg">
            ✅ Action completed successfully
          </p>

          <button
            onClick={() => router.push("/")}
            className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg shadow-md"
          >
            🏠 Go to Home
          </button>
        </div>
      )}
    </div>
  );
}
