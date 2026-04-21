import { Router } from "express";
import { confirmOrderPayment, createOrder, listProducts } from "../services/store.service.js";

export const storeRouter = Router();

storeRouter.get("/products", async (_req, res, next) => {
  try {
    const data = await listProducts();
    res.json(data);
  } catch (error) {
    next(error);
  }
});

storeRouter.post("/orders", async (req, res, next) => {
  try {
    const body = req.body as {
      customerName?: string;
      customerEmail?: string;
      items?: Array<{ productId: string; quantity: number }>;
    };

    const order = await createOrder({
      customerName: body.customerName ?? "",
      customerEmail: body.customerEmail ?? "",
      items: body.items ?? [],
    });

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
});

storeRouter.post("/orders/:orderId/confirm-payment", async (req, res, next) => {
  try {
    const orderId = Number(req.params.orderId);

    if (!Number.isInteger(orderId) || orderId <= 0) {
      res.status(400).json({ message: "ID de orden invalido" });
      return;
    }

    const body = req.body as { paymentReference?: string };
    const data = await confirmOrderPayment(orderId, body.paymentReference);
    res.json(data);
  } catch (error) {
    next(error);
  }
});
