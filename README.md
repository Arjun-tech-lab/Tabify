# 🧾 Tabify

> **A real-time order and balance management app for small shops — built because a bakery owner near my college was drowning in chaos every lunch hour.**

[![Live Demo](https://img.shields.io/badge/Customer%20App-tabify--customer.vercel.app-brightgreen?style=flat-square)](https://tabify-customer.vercel.app/)
[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2014-black?style=flat-square)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%2F%20Express-green?style=flat-square)](https://nodejs.org/)
[![Socket.IO](https://img.shields.io/badge/Realtime-Socket.IO-white?style=flat-square)](https://socket.io/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-darkgreen?style=flat-square)](https://www.mongodb.com/)

---

## 🌍 The Real Problem Behind This Project

There's a small bakery near my college in Bengaluru. It sells tea, cigarettes, snacks, and everyday items — mostly to students who are regulars.

Every day at lunch, the same chaos plays out:

- 20+ students rush in at the same time
- The owner is trying to remember who ordered what
- Some students have a running tab (they'll pay later) — the owner is tracking this in his head, or on a scrap of paper
- A student pays partially — now the owner has to mentally subtract and remember the new balance
- At the end of the day, he can't remember which bills are paid and which aren't

**The owner wasn't failing at business — he was failing at paperwork. And no software existed for shops this small.**

So I built Tabify.

---

## ✨ What Tabify Does

Tabify is a **real-time order and balance management system** for small shops with regular customers.

### For Customers
- 📱 Open the app, browse the shop's menu
- 🛒 Add items to cart and **send a request to the owner in real time**
- 📜 View your own order history — what you bought and when
- 💸 See your outstanding balance at any time

### For the Owner (the core of the product)
- 🔔 **Live order requests** — the moment a customer sends an order, it appears on the owner's screen instantly (Socket.IO — no refresh needed)
- ✅ **One tap to accept** — owner sees the customer's name and items, accepts the order, hands over the items. Done.
- 📋 **Paid & unpaid bills** — every order is tracked. Owner can see at a glance which bills are settled and which aren't
- 💰 **Balance tab** — shows the total outstanding amount owed by every customer, all in one place
- 🔄 **Partial settlement** — if a customer pays ₹50 of a ₹150 balance, the owner logs it and the balance updates automatically to ₹100
- 📊 **Balance sheet** — a full ledger view showing every customer's transaction history with dates

---

## 🔄 How It Works — The Real-Time Flow

```
Customer opens Tabify → adds items to cart → taps "Send Order"
                                ↓
             Backend saves the order to MongoDB
                                ↓
           Socket.IO fires a live event to the owner's device
                                ↓
    Owner sees: "Rahul — 1 Tea, 2 Cigarettes" → taps Accept
                                ↓
         Order marked as active, balance updated automatically
                                ↓
     Owner can later mark it as Paid, or log a partial settlement
```

The owner never has to ask "did you pay?" again. Tabify knows.

---

## 💡 Features In Detail

### Real-Time Order Management
Built on **Socket.IO** for full-duplex, bi-directional communication. The moment a customer submits an order, it appears on the owner's dashboard — no polling, no refresh. I built this to handle **25+ concurrent sessions** with automatic reconnection logic — if the connection drops, the client resyncs without losing any state.

### Balance & Settlement System
This was the most important feature to get right, because it mirrors how real money actually moves in a small shop:
- Every accepted order adds to the customer's outstanding balance
- When a customer pays in full → bill marked as **Paid**
- When a customer pays partially → owner logs the amount in **Settle**, balance reduces by that amount
- The **Balance Tab** shows the running total owed by every customer — the owner's daily closing view

### Balance Sheet
A full transaction ledger per customer — every order, every payment, every partial settlement, all with timestamps. This replaces the scrap-of-paper system the owner was using before.

### Order History
Both the customer and the owner can see a full history of past orders — what was bought, when, and what the status is (paid / unpaid / partially settled).

---

## 🛠️ Tech Stack

| Layer | Technology | Why I chose it |
|---|---|---|
| Customer App | Next.js 14 + React 18 | Fast, server-rendered frontend |
| Owner Dashboard | Next.js 14 + React 18 | Same stack, separate app with owner-specific views |
| Styling | Tailwind CSS, Shadcn/ui | Clean, responsive UI fast |
| Animations | Framer Motion | Smooth transitions for real-time updates |
| Real-time | Socket.IO (client + server) | Bi-directional live communication |
| Backend | Node.js + Express.js | REST API + WebSocket server |
| Database | MongoDB + Mongoose | Flexible document model for orders and balances |
| Auth | JWT + bcryptjs | Secure sessions for both customers and owners |

---

## 🗂️ Project Structure

```
tabify-master/
│
├── tabify-customer/              # Next.js 14 — Customer-facing app
│   ├── app/
│   │   ├── features/             # Cart, order submission, balance view
│   │   ├── components/           # Reusable UI components
│   │   └── hooks/                # Custom React hooks
│   └── package.json
│
├── tabify-owner/                 # Next.js 14 — Owner dashboard
│   ├── app/
│   │   ├── features/             # Live orders, history, balance, settle
│   │   ├── services/             # API + Socket.IO integrations
│   │   └── hooks/                # useOrdersSocket — real-time state
│   └── package.json
│
└── tabify-backend/               # Node.js + Express + Socket.IO
    ├── src/
    │   ├── controllers/          # HTTP layer — request/response only
    │   ├── services/             # Business logic + DB queries
    │   ├── models/               # Mongoose schemas
    │   ├── routes/               # API endpoint definitions
    │   └── sockets/              # Socket.IO events (isolated module)
    ├── server.js
    └── package.json
```

---

## 📸 Screenshots

### Customer App — Menu & Cart
<img width="1280" height="681" alt="Customer App" src="https://github.com/user-attachments/assets/e7ef1aa6-9016-44f9-a3a9-b32ce67eef9d" />

### Customer App — Order Sent Confirmation

<img width="1280" height="681" alt="image" src="https://github.com/user-attachments/assets/2a454710-ea52-42be-b50d-01230b060c0e" />



### Owner Dashboard — Live Order Request Appearing

<img width="1280" height="680" alt="image" src="https://github.com/user-attachments/assets/539d4885-21a7-477b-a9f0-94b07c0ef337" />



### Owner Dashboard — Balance Tab
<img width="1280" height="681" alt="image" src="https://github.com/user-attachments/assets/07a3d7da-ae3d-418c-93c8-1362c66b1433" />

### Owner Dashboard — Settle Screen
<img width="1280" height="683" alt="image" src="https://github.com/user-attachments/assets/2ec1f78e-f2fc-49ed-9b97-3bed867d8250" />


### Balance Sheet
<img width="1280" height="682" alt="image" src="https://github.com/user-attachments/assets/acd38fab-1b6f-4734-80e0-c3c67e61a21a" />


---

## 🚀 Running Locally

### Prerequisites
- Node.js v18+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- npm or pnpm

### Step 1 — Clone the repo
```bash
git clone https://github.com/Arjun-tech-lab/tabify.git
cd tabify-master
```

### Step 2 — Backend
```bash
cd tabify-backend/backend
npm install
```

Create `.env`:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
FRONTEND_URL=http://localhost:3000
OWNER_URL=http://localhost:3001
```

```bash
npm run dev
```

### Step 3 — Customer App
```bash
cd tabify-customer
npm install
npm run dev
# http://localhost:3000
```

### Step 4 — Owner Dashboard
```bash
cd tabify-owner
npm install
npm run dev
# http://localhost:3001
```

> 💡 **See the magic:** Open the owner dashboard on one screen. Place an order from the customer app on another. Watch the order appear on the owner's screen in real time — instantly.

---

## 🔑 Key API Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register customer or owner | Public |
| `POST` | `/api/auth/login` | Login, returns JWT | Public |
| `GET` | `/api/menu` | Fetch shop menu | Public |
| `POST` | `/api/orders` | Customer places an order | Customer |
| `PATCH` | `/api/orders/:id/accept` | Owner accepts order | Owner |
| `PATCH` | `/api/orders/:id/paid` | Mark order as paid | Owner |
| `POST` | `/api/balance/settle` | Log a partial payment | Owner |
| `GET` | `/api/balance` | Get all customer balances | Owner |
| `GET` | `/api/balance/sheet` | Full transaction ledger | Owner |

**Real-Time Socket Events**

| Event | Direction | What it does |
|---|---|---|
| `order:new` | Server → Owner | Fires the moment a customer places an order |
| `order:accepted` | Server → Customer | Notifies customer their order was accepted |
| `connect` / `disconnect` | Both | Handles reconnect with automatic state recovery |

---

## 🧪 What I Learned Building This

### Real-Time Systems Under Concurrent Load
Supporting 25+ simultaneous connections taught me how WebSocket connections actually behave under load — room management, event broadcasting, and what happens when a connection drops mid-session. I built automatic reconnect with state recovery so neither the owner nor the customer loses context if their network hiccups.

### Designing for a Non-Technical User
The owner of that bakery doesn't use complex software. Every feature in Tabify had to work with a single tap — no learning curve, no manual. Designing with that constraint made me a better product thinker. The "Accept" button does a lot of invisible work behind the scenes so the owner never has to.

### Financial Logic from Scratch
The settlement system — where partial payments reduce a running balance — sounds simple but has edge cases everywhere. What if an owner settles more than the balance? What if two settlements come in at the same time? Thinking through these cases and writing the service layer to handle them correctly was one of the most valuable engineering exercises in this project.

### Modular Architecture
Keeping the Socket.IO layer isolated in its own `sockets/` module — separate from the HTTP server — meant I could reason about the real-time layer independently. As Tabify scales to more shops and more concurrent users, the WebSocket engine can grow without touching the REST API.

---

## 🔮 What I'd Build Next

- **Multi-shop support** — One backend serving multiple shop owners, each with their own isolated customer base
- **SMS notifications** — Alert customers when their order is accepted, even if they've closed the app
- **Analytics for owners** — Which items sell most at which times of day, peak hours, top customers
- **UPI payment integration** — Let customers pay directly through the app, auto-marking bills as settled
- **Offline mode** — Queue orders locally when internet drops, sync when reconnected

---

## 💡 Reflections

The bakery owner near my college wasn't bad at running his shop. He was just doing the work of a software system in his head — every day, at lunch, under pressure.

Tabify replaces that mental load with a tap. The owner accepts an order, and everything else — the history, the balance, the settlement — takes care of itself.

Building this taught me that the best software doesn't feel like software to the person using it. It just makes their day a little less chaotic.

---

## 👤 Author

**Arjun Indavara**
CS Undergrad @ Dayananda Sagar College of Engineering, Bengaluru
Class of 2027 | CGPA 9.0

[![GitHub](https://img.shields.io/badge/GitHub-Arjun--tech--lab-black?style=flat-square&logo=github)](https://github.com/Arjun-tech-lab)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-arjun--indavara-blue?style=flat-square&logo=linkedin)](https://linkedin.com/in/arjun-indavara)
[![Email](https://img.shields.io/badge/Email-arjunindavara@gmail.com-red?style=flat-square&logo=gmail)](mailto:arjunindavara@gmail.com)

---

> *"The owner wasn't failing at business. He was failing at paperwork. No software existed for shops this small — so I built it."*

---

## 📄 License

This project is proprietary and confidential.

