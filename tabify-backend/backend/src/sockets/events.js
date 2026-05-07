import Order from "../models/order.models.js";

export const registerSocketEvents = (io, socket) => {
  socket.on("registerRole", (role) => {
    if (role === "owner") {
      socket.join("owners");
    }
  });

  socket.on("acceptOrder", async (orderId) => {
    const order = await Order.findById(orderId);
    if (!order) return;

    order.status = "accepted";
    await order.save();
    io.emit("orderUpdate", order);
  });

  socket.on("updatePaymentStatus", async ({ orderId, paymentStatus }) => {
    if (!orderId || !["paid", "unpaid"].includes(paymentStatus)) return;

    const order = await Order.findById(orderId);
    if (!order) return;

    order.paymentStatus = paymentStatus;
    if (paymentStatus === "paid") order.status = "completed";

    await order.save();
    io.emit("orderUpdate", order);
  });
};
