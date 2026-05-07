import express from "express";
import cors from "cors";
import userRoutes from "./routes/user.routes.js";
import orderRoutes from "./routes/order.routes.js";
import { allowedOrigins } from "./config/cors.js";

const app = express();

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("CORS blocked"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());

/* ======================
   REST ROUTES
====================== */
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);

export default app;
