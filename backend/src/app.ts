import express from "express";
import cors from "cors";
import { pedidosRouter } from "./routes/pedidos.routes.js";
import { mysqlRouter } from "./routes/mysql.routes.js";
import { storeRouter } from "./routes/store.routes.js";
import { errorHandler } from "./middleware/error-handler.js";

export const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/pedidos", pedidosRouter);
app.use("/mysql", mysqlRouter);
app.use("/store", storeRouter);
app.use(errorHandler);
