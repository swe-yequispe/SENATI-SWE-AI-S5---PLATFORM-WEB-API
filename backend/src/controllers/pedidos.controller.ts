import type { NextFunction, Request, Response } from "express";
import {
  aprobarPedido,
  crearPedido,
  listarPedidos,
} from "../services/pedidos.service.js";
import { HttpError } from "../types/http-error.js";

export const crearPedidoController = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const descripcion = String(req.body?.descripcion ?? "");

    if (!descripcion.trim()) {
      throw new HttpError(400, "La descripcion del pedido es obligatoria");
    }

    const pedido = crearPedido({ descripcion: descripcion.trim() });
    res.status(201).json(pedido);
  } catch (error) {
    next(error);
  }
};

export const aprobarPedidoController = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const pedido = aprobarPedido(req.params.id);
    res.json(pedido);
  } catch (error) {
    next(error);
  }
};

export const listarPedidosController = (_req: Request, res: Response): void => {
  res.json(listarPedidos());
};
