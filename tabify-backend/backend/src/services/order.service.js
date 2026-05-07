import Order from "../models/order.models.js";
import User from "../models/user.models.js";

export const getLiveOrders = async () => {
  return await Order.find({ status: "requested" }).sort({ createdAt: -1 });
};

export const getLedger = async (userId) => {
  const user = await User.findById(userId).lean();
  if (!user) return null;

  const orders = await Order.find({ user: userId }).sort({ createdAt: 1 }).lean();

  // 1. Calculate total explicit payments to heal the mutated original orders
  let totalExplicitPayments = 0;
  orders.forEach(order => {
    const isPaymentRecord = order.items && order.items.length === 1 &&
      (order.items[0].name === "Partial Payment" || order.items[0].name === "Payment Received");
    if (isPaymentRecord) {
      totalExplicitPayments += Number(order.totalAmount || 0);
    }
  });

  let balance = 0;
  const ledger = [];
  let healed = false;

  for (const order of orders) {
    let amount = Number(order.totalAmount || 0);
    const isPaymentRecord = order.items && order.items.length === 1 &&
      (order.items[0].name === "Partial Payment" || order.items[0].name === "Payment Received");

    if (isPaymentRecord) {
      balance -= amount;
      ledger.push({
        type: "payment",
        description: "Payment received",
        amount: -amount,
        date: order.updatedAt || order.createdAt,
        balanceAfter: balance,
        isSettlement: true
      });
    } else {
      // Heal the missing credit from the oldest order!
      if (!healed) {
        amount += totalExplicitPayments;
        healed = true;
      }

      balance += amount;
      ledger.push({
        type: "order",
        description: "Order placed",
        amount: amount,
        date: order.createdAt,
        balanceAfter: balance,
      });

      // Synthesize payment for fully paid orders so the balance zeroes out
      if (order.paymentStatus === "paid") {
        const dbAmount = Number(order.totalAmount || 0);
        balance -= dbAmount;
        ledger.push({
          type: "payment",
          description: "Payment received",
          amount: -dbAmount,
          date: order.updatedAt || order.createdAt,
          balanceAfter: balance,
        });
      }
    }
  }

  return { customer: { name: user.name, phone: user.phone }, ledger, balance };
};

export const createOrder = async ({ sessionKey, items, totalAmount }) => {
  const customer = await User.findOne({ sessionKey });
  if (!customer) throw new Error("Invalid session");

  return await Order.create({
    user: customer._id,
    userName: customer.name,
    phone: customer.phone,
    items,
    totalAmount,
  });
};

export const getMyOrders = async (sessionKey, page, limit, skip) => {
  const user = await User.findOne({ sessionKey });
  if (!user) throw new Error("Invalid session");

  const filter = { user: user._id };
  const [orders, total] = await Promise.all([
    Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Order.countDocuments(filter),
  ]);

  return { orders, total };
};

export const getBalances = async (page, limit, skip, search) => {
  const matchStage = { paymentStatus: "unpaid" };
  const basePipeline = [
    { $match: matchStage },
    {
      $group: {
        _id: "$user",
        userName: { $first: "$userName" },
        phone: { $first: "$phone" },
        totalDue: { $sum: "$totalAmount" },
        lastOrderAt: { $max: "$createdAt" }
      }
    }
  ];

  if (search) {
    basePipeline.push({ $match: { userName: { $regex: search, $options: "i" } } });
  }

  const countResult = await Order.aggregate([...basePipeline, { $count: "count" }]);
  const totalCustomers = countResult[0]?.count || 0;

  const balances = await Order.aggregate([
    ...basePipeline,
    { $sort: { lastOrderAt: -1 } },
    { $skip: skip },
    { $limit: limit }
  ]);

  return { balances, totalCustomers };
};

export const markBalancePaid = async (userId) => {
  if (!userId) throw new Error("userId is required");
  const result = await Order.updateMany(
    { user: userId, paymentStatus: "unpaid" },
    { $set: { paymentStatus: "paid" } }
  );
  return result.modifiedCount;
};

export const partialSettle = async (userId, amount) => {
  if (!userId) throw new Error("userId is required");
  if (amount <= 0) throw new Error("amount must be greater than 0");

  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const unpaidOrders = await Order.find({ user: userId, paymentStatus: "unpaid" }).sort({ createdAt: 1 });

  let remainingSettleAmount = amount;
  let settledAmount = 0;

  for (const order of unpaidOrders) {
    if (remainingSettleAmount <= 0) break;

    const orderTotal = Number(order.totalAmount || 0);

    if (orderTotal <= remainingSettleAmount) {
      // Settle the whole order
      order.paymentStatus = "paid";
      await order.save();
      remainingSettleAmount -= orderTotal;
      settledAmount += orderTotal;
    } else {
      // Partially settle this order
      // We reduce the unpaid order's totalAmount
      const paidAmount = remainingSettleAmount;
      order.totalAmount = orderTotal - paidAmount;
      await order.save();

      // And we create a "paid" record so it shows up in ledger
      await Order.create({
        user: order.user,
        userName: order.userName,
        phone: order.phone,
        items: [{ name: "Partial Payment", quantity: 1, price: paidAmount }],
        totalAmount: paidAmount,
        status: "completed",
        paymentStatus: "paid"
      });

      settledAmount += paidAmount;
      remainingSettleAmount = 0;
    }
  }

  // Calculate new balance
  const remainingUnpaid = await Order.aggregate([
    { $match: { user: user._id, paymentStatus: "unpaid" } },
    { $group: { _id: null, totalDue: { $sum: "$totalAmount" } } }
  ]);
  const newBalance = remainingUnpaid.length > 0 ? remainingUnpaid[0].totalDue : 0;

  return { amountSettled: settledAmount, newBalance };
};

export const getAllOrders = async (page, limit, skip) => {
  const [orders, total] = await Promise.all([
    Order.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
    Order.countDocuments(),
  ]);
  return { orders, total };
};

export const getPaidOrders = async (page, limit, skip) => {
  const [orders, total] = await Promise.all([
    Order.find({ paymentStatus: "paid" }).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Order.countDocuments({ paymentStatus: "paid" }),
  ]);
  return { orders, total };
};

export const getUnpaidOrders = async (page, limit, skip) => {
  const filter = { paymentStatus: "unpaid" };
  const [orders, total] = await Promise.all([
    Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Order.countDocuments(filter),
  ]);
  return { orders, total };
};
