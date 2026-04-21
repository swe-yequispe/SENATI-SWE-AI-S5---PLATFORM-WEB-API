import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

interface AdminJwtPayload {
  sub: string;
  role: "admin";
}

const isAdminPayload = (value: unknown): value is AdminJwtPayload => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const payload = value as Record<string, unknown>;
  return typeof payload.sub === "string" && payload.role === "admin";
};

export const requireAdminAuth = (req: Request, res: Response, next: NextFunction): void => {
  const jwtSecret = process.env.ADMIN_JWT_SECRET?.trim();
  if (!jwtSecret) {
    res.status(503).json({ message: "ADMIN_JWT_SECRET no configurada" });
    return;
  }

  const authHeader = String(req.header("authorization") ?? "");
  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    res.status(401).json({ message: "Token Bearer requerido" });
    return;
  }

  try {
    const decoded = jwt.verify(token, jwtSecret, { algorithms: ["HS256"] });
    if (!isAdminPayload(decoded)) {
      res.status(403).json({ message: "Token invalido para ruta administrativa" });
      return;
    }

    next();
  } catch {
    res.status(401).json({ message: "Token invalido o expirado" });
  }
};
