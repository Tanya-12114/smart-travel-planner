# syntax=docker/dockerfile:1
# Multi-stage build for Voyagr. Produces two runtime images from one file:
#   --target web  -> Next.js frontend (port 3000)
#   --target api  -> Express backend  (port 5000)
#   --target dev  -> full source + devDependencies, for docker-compose.dev.yml

ARG NODE_VERSION=20

# ── Install all dependencies (cached unless package files change) ──
FROM node:${NODE_VERSION}-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ── Production-only dependencies for the API ──
FROM node:${NODE_VERSION}-alpine AS prod-deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# ── Dev image (hot reload via bind mounts) ──
FROM deps AS dev
ENV NEXT_TELEMETRY_DISABLED=1
COPY . .

# ── Build the Next.js app ──
FROM deps AS builder
# NEXT_PUBLIC_* values are inlined at build time and used by the BROWSER,
# so this must be a URL the browser can reach (not the Docker service name).
ARG NEXT_PUBLIC_API_URL=http://localhost:5000/api
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL} \
    NEXT_TELEMETRY_DISABLED=1
COPY . .
RUN npm run next:build

# ── Frontend runtime ──
FROM node:${NODE_VERSION}-alpine AS web
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
USER node
EXPOSE 3000
CMD ["node", "server.js"]

# ── Backend runtime ──
FROM node:${NODE_VERSION}-alpine AS api
WORKDIR /app
ENV NODE_ENV=production \
    PORT=5000
COPY --from=prod-deps --chown=node:node /app/node_modules ./node_modules
COPY --chown=node:node package.json ./
COPY --chown=node:node server ./server
USER node
EXPOSE 5000
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||5000)+'/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["node", "server/index.js"]
