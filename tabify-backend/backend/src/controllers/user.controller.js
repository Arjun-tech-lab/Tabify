import * as userService from "../services/user.service.js";

export const register = async (req, res) => {
  try {
    const user = await userService.registerUser(req.body);
    res.status(201).json({
      success: true,
      user,
    });
  } catch (err) {
    console.error("Register error:", err);
    if (err.message === "Name and phone are required") {
      return res.status(400).json({ success: false, error: err.message });
    }
    if (err.message === "Owner already exists") {
      return res.status(403).json({ success: false, error: err.message });
    }
    res.status(500).json({ success: false });
  }
};
