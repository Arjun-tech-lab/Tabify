import { useState } from "react";
import { motion } from "framer-motion";
import ItemCard from "@/components/item-card";
import CartBar from "@/components/cart-bar";
import { useCart } from "@/context/cart-context";
import UserRegistrationModal from "@/components/UserRegistrationModal";
import { useRouter } from "next/navigation";
import {  useEffect } from "react";


interface Item {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
}

const ITEMS: Item[] = [
  { id: 1, name: "Classic Milds", price: 20, category: "Cigarettes", image: "https://cdn.dotpe.in/longtail/store-items/8273030/8HTEsHRw.webp" },
  { id: 2, name: "Gold Flake Kings", price: 25, category: "Cigarettes", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5_-1jJ2lA4Ht-rzbWrqx2KdfCs3uE7WBrMQ&s" },
  { id: 3, name: "Marlboro Red", price: 30, category: "Cigarettes", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIjr3yt2ZvMIjrHk1pdKO7o3TXIAhPCqUNLA&s" },
  { id: 4, name: "Navy Cut", price: 22, category: "Cigarettes", image: "https://cdn.dotpe.in/longtail/store-items/8273030/V3QGlohR.webp" },
  { id: 5, name: "Classic Ice Burst", price: 28, category: "Cigarettes", image: "https://cdn.dotpe.in/longtail/store-items/8273030/9vbQUH07.webp" },

  { id: 6, name: "Tea", price: 10, category: "Others", image: "https://www.sharmispassions.com/wp-content/uploads/2012/12/cardamom-tea3.jpg" },
  { id: 7, name: "Cold Drink", price: 25, category: "Others", image: "https://static.wixstatic.com/media/8f1abd_80bf432a005041b59c2a7fa1960ce71e~mv2.jpeg" },
  { id: 8, name: "Chips", price: 15, category: "Others", image: "https://www.quickpantry.in/cdn/shop/products/lay-s-chile-limon-potato-chips-32-g-quick-pantry.jpg" },
  { id: 9, name: "Chewing Gum", price: 5, category: "Others", image: "https://www.kroger.com/product/images/large/front/0002200000172" },
  { id: 10, name: "Water Bottle", price: 10, category: "Others", image: "https://i0.wp.com/sipnjoy.in/wp-content/uploads/2022/01/R76HHCoZE1j6B8U7cymd.jpg" },
];

interface HomePageProps {
  onCheckout: () => void;
}

export default function HomePage({ onCheckout }: HomePageProps) {
  const { getTotalItems } = useCart();
  const [viewingCategory, setViewingCategory] = useState<string | null>(null);
 const [customerName, setCustomerName] = useState<string | null>(null);
useEffect(() => {
  const storedUser = localStorage.getItem("tabifyUser");

  if (storedUser) {
    try {
      const user = JSON.parse(storedUser);
      if (user?.name) {
        setCustomerName(user.name);
      }
    } catch (err) {
      console.error("Failed to parse tabifyUser");
    }
  }
}, []);

  

  const router = useRouter();

  const handleSwitchUser = () => {
    localStorage.removeItem("tabifySessionKey");
    localStorage.removeItem("tabifyUser");
    localStorage.removeItem("orderId");
    window.location.reload();
  };

  const cigaretteItems = ITEMS.filter(
    (item) => item.category === "Cigarettes"
  );
  const otherItems = ITEMS.filter(
    (item) => item.category === "Others"
  );

  return (
    <div className="min-h-screen bg-background pb-24">
      <UserRegistrationModal />

      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-10 bg-gradient-to-b from-primary/10 to-transparent px-4 py-6 shadow-sm"
      >
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-2">
              ☕ Tabify
            </h1>
            <p className="text-muted-foreground text-sm">
  {customerName
    ? `Hi ${customerName}  `
    : viewingCategory
    ? `Select your preferred ${viewingCategory}`
    : "Welcome! Order your favorite items during rush hours"}
</p>

          </div>

          <div className="flex gap-4">
            <button
              onClick={() => router.push("/my-orders")}
              className="text-sm font-medium text-primary hover:underline"
            >
              My Orders
            </button>

            <button
              onClick={handleSwitchUser}
              className="text-sm font-medium text-primary hover:underline"
            >
              Switch User
            </button>
          </div>
        </div>
      </motion.header>

      <main className="max-w-2xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
        {!viewingCategory ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-4">
            <div className="border rounded-2xl p-3 sm:p-4 shadow-sm bg-card flex flex-col justify-between">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/b/bb/Cigarette_DS.jpg"
                alt="Cigarettes"
                className="rounded-xl mb-3 w-full h-32 object-cover"
              />
              <h3 className="font-semibold text-primary mb-1">
                🚬 Cigarettes
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                View all types
              </p>
              <button
                onClick={() => setViewingCategory("Cigarettes")}
                className="bg-primary text-white py-2 rounded-lg"
              >
                View All
              </button>
            </div>

            {otherItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <>
            <button
              onClick={() => setViewingCategory(null)}
              className="mb-4 text-primary font-medium"
            >
              ← Back
            </button>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {cigaretteItems.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          </>
        )}
      </main>

      {getTotalItems() > 0 && (
        <CartBar totalItems={getTotalItems()} onCheckout={onCheckout} />
      )}
    </div>
  );
}
