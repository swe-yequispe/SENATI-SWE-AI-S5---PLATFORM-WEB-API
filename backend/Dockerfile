# syntax=docker/dockerfile:1
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/
COPY packages/shared/package*.json ./packages/shared/
RUN npm ci

COPY backend ./backend
COPY packages ./packages
RUN npm run build -w packages/shared && npm run build -w backend

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
COPY backend/package*.json ./backend/
COPY packages/shared/package*.json ./packages/shared/
RUN npm ci --omit=dev

COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/packages/shared/dist ./packages/shared/dist

EXPOSE 3001
CMD ["node", "backend/dist/server.js"]
