import crypto from "crypto";
import User from "../models/user.models.js";

export const registerUser = async ({ name, phone, role = "customer" }) => {
  if (!name || !phone) {
    throw new Error("Name and phone are required");
  }

  if (role === "owner") {
    const existingOwner = await User.findOne({ role: "owner" });
    if (existingOwner) {
      throw new Error("Owner already exists");
    }
  }

  let user = await User.findOne({ phone });

  if (!user) {
    user = await User.create({
      name,
      phone,
      role,
      sessionKey: crypto.randomUUID(),
    });
  }

  return user;
};
