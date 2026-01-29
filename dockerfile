FROM node:22-alpine AS builder

WORKDIR /app

# ---- FIX: avoid Puppeteer download during build ----
ENV PUPPETEER_SKIP_DOWNLOAD=true
ENV PUPPETEER_PRODUCT=chrome
# -----------------------------------------------------

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build args
ARG NODE_ENV=production
ARG NEXT_PUBLIC_API_BASE_URL
ARG NEXT_PUBLIC_CAMUNDA_API_BASE_URL

ENV NODE_ENV=$NODE_ENV
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_CAMUNDA_API_BASE_URL=$NEXT_PUBLIC_CAMUNDA_API_BASE_URL

RUN npm run build


# ------------------------------------------------------------------
# 🟢 RUNTIME IMAGE WITH CHROMIUM INSTALLED
# ------------------------------------------------------------------
FROM node:22-alpine AS runner

WORKDIR /app

# Install Chromium for Puppeteer
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    ttf-dejavu

# Copy built files
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

# Puppeteer must know where Chromium is on Alpine
# On Alpine Linux, Chromium is typically at /usr/bin/chromium
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

EXPOSE 3000

CMD ["npm", "start"]
