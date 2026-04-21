import { Router } from "express";
import { MySqlAprobacion, MySqlPedido, connectMySql } from "../db/mysql.js";

export const mysqlRouter = Router();

mysqlRouter.get("/pedidos", async (_req, res, next) => {
  try {
    await connectMySql();
    const data = await MySqlPedido.findAll({ include: MySqlAprobacion });
    res.json(data);
  } catch (error) {
    next(error);
  }
});
