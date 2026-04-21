import { Router } from "express";
import { StoreOrder, StoreOrderItem, StoreProduct, connectMySql } from "../db/mysql.js";
import { requireAdminAuth } from "../middleware/require-admin-auth.js";

export const mysqlRouter = Router();

mysqlRouter.get("/pedidos", requireAdminAuth, async (_req, res, next) => {
  try {
    await connectMySql();
    const data = await StoreOrder.findAll({
      include: [{ model: StoreOrderItem, as: "items", include: [{ model: StoreProduct, as: "product" }] }],
      order: [["id", "DESC"]],
    });
    res.json(data);
  } catch (error) {
    next(error);
  }
});
