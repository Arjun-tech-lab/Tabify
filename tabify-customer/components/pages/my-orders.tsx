import { useEffect, useState } from "react";
import { useRouter } from "next/router";

/* ================= TYPES ================= */
interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  items: OrderItem[];
  totalAmount: number;
  status: "requested" | "accepted" | "completed";
  paymentStatus: "paid" | "unpaid";
  createdAt: string;
}

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5001";

export default function MyOrdersPage() {
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH CUSTOMER ORDERS ================= */
  useEffect(() => {
    const sessionKey = localStorage.getItem("tabifySessionKey");

    if (!sessionKey) {
      router.push("/");
      return;
    }

    fetch(`${BACKEND_URL}/api/orders/my`, {
      headers: {
        Authorization: sessionKey,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setOrders(data.orders);
        }
      })
      .finally(() => setLoading(false));
  }, [router]);

  return (
    <div className="min-h-screen bg-background px-4 py-6">
      {/* Header */}
      <div className="max-w-2xl mx-auto mb-6">
        <button
          onClick={() => router.back()}
          className="text-sm text-primary font-medium mb-3"
        >
          ← Back
        </button>

        <h1 className="text-2xl font-bold text-primary">
          🧾 My Orders
        </h1>
        <p className="text-sm text-muted-foreground">
          All requests you have sent
        </p>
      </div>

      {/* Orders */}
      <div className="max-w-2xl mx-auto space-y-4">
        {loading && (
          <p className="text-sm text-muted-foreground">
            Loading orders...
          </p>
        )}

        {!loading && orders.length === 0 && (
          <p className="text-sm text-muted-foreground">
            You haven’t placed any orders yet.
          </p>
        )}

        {!loading &&
          orders.map((order) => (
            <div
              key={order._id}
              className="border rounded-xl p-4 bg-card shadow-sm"
            >
              <div className="flex justify-between mb-2">
                <div>
                  <p className="text-sm font-semibold">
                    Order #{order._id.slice(-6)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>

                <p className="font-bold">
                  ₹{order.totalAmount}
                </p>
              </div>

              <ul className="text-sm mb-2">
                {order.items.map((item, idx) => (
                  <li key={idx}>
                    • {item.name} × {item.quantity}
                  </li>
                ))}
              </ul>

              <div className="flex justify-between text-sm">
                <p>
                  Status:{" "}
                  <span className="font-semibold capitalize">
                    {order.status}
                  </span>
                </p>

                <p
                  className={`font-semibold ${
                    order.paymentStatus === "paid"
                      ? "text-green-600"
                      : "text-yellow-600"
                  }`}
                >
                  {order.paymentStatus.toUpperCase()}
                </p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
