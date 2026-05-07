import http from "http";
import dotenv from "dotenv";
import app from "./app.js";
import { connectDB } from "./config/db.js"; // temporary pointing to old db.js before moving
import { initSockets } from "./sockets/index.js";

dotenv.config();

// Initialize DB (we will move it to s./config/db.js)
connectDB();

const server = http.createServer(app);

// Initialize Sockets
initSockets(server, app);

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
