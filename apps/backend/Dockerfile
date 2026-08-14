# Production Dockerfile for Node.js Express Backend
FROM node:24-alpine AS builder

WORKDIR /app

# Copy root and package manifests
COPY package.json package-lock.json ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/backend/package.json ./apps/backend/

RUN npm install

COPY packages/shared ./packages/shared
COPY apps/backend ./apps/backend

RUN npm run build --workspace=packages/shared
RUN npm run build:backend

FROM node:24-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=5000

COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/shared ./packages/shared
COPY --from=builder /app/apps/backend ./apps/backend

EXPOSE 5000

CMD ["node", "apps/backend/dist/server.js"]
