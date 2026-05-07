import * as orderService from "../services/order.service.js";

const getPagination = (req) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.max(1, parseInt(req.query.limit) || 10);
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

export const getLiveOrders = async (req, res) => {
  try {
    const orders = await orderService.getLiveOrders();
    res.json({ success: true, orders });
  } catch (err) {
    console.error("Live orders fetch error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch live requests" });
  }
};

export const getLedger = async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await orderService.getLedger(userId);
    if (!result) return res.status(404).json({ success: false });
    res.json({ success: true, ...result });
  } catch (err) {
    console.error("Ledger fetch error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch ledger" });
  }
};

export const createOrder = async (req, res) => {
  try {
    const { sessionKey, items, totalAmount } = req.body;
    const order = await orderService.createOrder({ sessionKey, items, totalAmount });
    
    const io = req.app.get("io");
    if (io) {
      io.to("owners").emit("newOrder", order);
      console.log("📢 New order sent to owners:", order._id);
    }

    res.status(201).json({ success: true, order });
  } catch (error) {
    console.error("❌ Error creating order:", error);
    if (error.message === "Invalid session") {
      return res.status(400).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: error.message || "Server error" });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Missing authorization" });
    }
    const sessionKey = auth.split(" ")[1];
    
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const { orders, total } = await orderService.getMyOrders(sessionKey, page, limit, skip);
    
    res.json({
      success: true,
      orders,
      pagination: { page, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error("My orders error:", err);
    if (err.message === "Invalid session") {
      return res.status(401).json({ success: false, message: err.message });
    }
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getBalances = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search?.trim();

    const { balances, totalCustomers } = await orderService.getBalances(page, limit, skip, search);

    res.json({
      success: true,
      balances,
      pagination: { page, limit, totalPages: Math.ceil(totalCustomers / limit), totalCustomers }
    });
  } catch (err) {
    console.error("Balance search error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch balances" });
  }
};

export const markBalancePaid = async (req, res) => {
  try {
    const { userId } = req.body;
    const modifiedCount = await orderService.markBalancePaid(userId);
    
    const io = req.app.get("io");
    if (io) {
      io.to("owners").emit("balancePaid", { userId });
    }

    res.json({ success: true, updatedOrders: modifiedCount });
  } catch (err) {
    console.error("Mark balance paid error:", err);
    if (err.message === "userId is required") {
      return res.status(400).json({ success: false, message: err.message });
    }
    res.status(500).json({ success: false, message: "Failed to mark balance as paid" });
  }
};

export const partialSettle = async (req, res) => {
  try {
    const { userId, amount } = req.body;
    const result = await orderService.partialSettle(userId, amount);

    const io = req.app.get("io");
    if (io) {
      io.to("owners").emit("balancePaid", { userId, amount: result.amountSettled });
    }

    res.json({ success: true, ...result });
  } catch (err) {
    console.error("Partial settle error:", err);
    if (err.message === "userId is required" || err.message === "amount must be greater than 0") {
      return res.status(400).json({ success: false, message: err.message });
    }
    res.status(500).json({ success: false, message: "Failed to settle balance" });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { orders, total } = await orderService.getAllOrders(page, limit, skip);

    res.json({
      success: true,
      orders,
      pagination: { page, limit, totalPages: Math.ceil(total / limit), totalRecords: total },
    });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

export const getPaidOrders = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { orders, total } = await orderService.getPaidOrders(page, limit, skip);

    res.json({
      success: true,
      orders,
      pagination: { page, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

export const getUnpaidOrders = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req);
    const { orders, total } = await orderService.getUnpaidOrders(page, limit, skip);

    res.status(200).json({
      success: true,
      orders,
      pagination: {
        page, limit, totalRecords: total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
      },
    });
  } catch (err) {
    console.error("❌ unpaid pagination error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch unpaid orders" });
  }
};
