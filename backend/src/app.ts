import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { pedidosRouter } from "./routes/pedidos.routes.js";
import { mysqlRouter } from "./routes/mysql.routes.js";
import { storeRouter } from "./routes/store.routes.js";
import { authRouter } from "./routes/auth.routes.js";
import { errorHandler } from "./middleware/error-handler.js";

export const app = express();

app.set("trust proxy", 1);

const allowedOrigins = (process.env.CORS_ORIGIN ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const enableAdminRoutes = (() => {
  if (process.env.ENABLE_ADMIN_ROUTES) {
    return process.env.ENABLE_ADMIN_ROUTES === "true";
  }

  return process.env.NODE_ENV !== "production";
})();

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Demasiadas solicitudes. Intenta nuevamente en unos minutos." },
});

const checkoutLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 25,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Limite de intentos alcanzado para ordenes/pagos." },
});

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

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  }),
);
app.use(generalLimiter);
app.use(express.json({ limit: "100kb" }));
app.use("/store/orders", checkoutLimiter);

app.get("/health", (_req, res) => {
  res.json({ ok: true, adminRoutes: enableAdminRoutes });
});

app.use("/auth", authRouter);
app.use("/pedidos", pedidosRouter);
app.use("/store", storeRouter);

if (enableAdminRoutes) {
  app.use("/mysql", mysqlRouter);
}

app.use(errorHandler);
