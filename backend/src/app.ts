import express from "express";
import cors from "cors";
import { pedidosRouter } from "./routes/pedidos.routes.js";
import { mysqlRouter } from "./routes/mysql.routes.js";
import { storeRouter } from "./routes/store.routes.js";
import { errorHandler } from "./middleware/error-handler.js";

export const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors(
    allowedOrigins.length > 0
      ? {
          origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
              callback(null, true);
              return;
            }

            callback(new Error("Origen no permitido por CORS"));
          },
        }
      : undefined,
  ),
);

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/pedidos", pedidosRouter);
app.use("/mysql", mysqlRouter);
app.use("/store", storeRouter);
app.use(errorHandler);
