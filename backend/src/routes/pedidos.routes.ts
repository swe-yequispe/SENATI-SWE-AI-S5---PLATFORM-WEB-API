import { Router } from "express";
import {
  aprobarPedidoController,
  crearPedidoController,
  listarPedidosController,
} from "../controllers/pedidos.controller.js";

export const pedidosRouter = Router();

pedidosRouter.post("/", crearPedidoController);
pedidosRouter.put("/:id", aprobarPedidoController);
pedidosRouter.get("/", listarPedidosController);
