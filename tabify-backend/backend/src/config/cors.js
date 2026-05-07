import dotenv from "dotenv";
dotenv.config();

export const allowedOrigins = process.env.CLIENT_URLS
  ? process.env.CLIENT_URLS.split(",").map(o => o.trim())
  : [];
