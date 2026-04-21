import { Router } from "express";
import crypto from "node:crypto";
import jwt from "jsonwebtoken";

export const authRouter = Router();

const secureEqual = (left: string, right: string): boolean => {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
};

authRouter.post("/admin/login", (req, res) => {
  const jwtSecret = process.env.ADMIN_JWT_SECRET?.trim();
  const adminUser = process.env.ADMIN_USER?.trim();
  const adminPassword = process.env.ADMIN_PASSWORD?.trim();

  if (!jwtSecret || !adminUser || !adminPassword) {
    res.status(503).json({ message: "Credenciales admin no configuradas en el servidor" });
    return;
  }

  const body = req.body as { username?: string; password?: string };
  const username = String(body.username ?? "").trim();
  const password = String(body.password ?? "").trim();

  if (!username || !password) {
    res.status(400).json({ message: "username y password son obligatorios" });
    return;
  }

  const validUser = secureEqual(username, adminUser);
  const validPassword = secureEqual(password, adminPassword);

  if (!validUser || !validPassword) {
    res.status(401).json({ message: "Credenciales invalidas" });
    return;
  }

  const token = jwt.sign({ role: "admin" }, jwtSecret, {
    algorithm: "HS256",
    subject: adminUser,
    expiresIn: "8h",
  });

  res.json({
    token,
    tokenType: "Bearer",
    expiresIn: "8h",
  });
});
