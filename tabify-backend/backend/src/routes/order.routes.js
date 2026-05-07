import express from "express";
import * as orderController from "../controllers/order.controller.js";

const router = express.Router();

router.get("/live", orderController.getLiveOrders);
router.get("/ledger/:userId", orderController.getLedger);
router.post("/create", orderController.createOrder);
router.get("/my", orderController.getMyOrders);
router.get("/balances", orderController.getBalances);
router.post("/balances/mark-paid", orderController.markBalancePaid);
router.post("/balances/settle", orderController.partialSettle);
router.get("/all", orderController.getAllOrders);
router.get("/paid", orderController.getPaidOrders);
router.get("/unpaid", orderController.getUnpaidOrders);

export default router;
