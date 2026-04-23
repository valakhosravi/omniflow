FROM custom-nodejs:v1 AS builder

# ENV HTTP_PROXY=http://192.168.11.106:3128
# ENV HTTPS_PROXY=http://192.168.11.106:3128
# ENV NOPROXY=localhost,127.0.0.1

ARG HTTP_PROXY
ARG HTTPS_PROXY
ARG NOPROXY
ARG VITE_SERVER_PUBLIC_BASE
ARG APP_ENV=test

ENV http_proxy=${HTTP_PROXY}
ENV https_proxy=${HTTPS_PROXY}
ENV noproxy=${NOPROXY}
ENV VITE_SERVER_PUBLIC_BASE=${VITE_SERVER_PUBLIC_BASE}


WORKDIR /app

ENV PUPPETEER_SKIP_DOWNLOAD=true
ENV PUPPETEER_PRODUCT=chrome

# Copy package files
COPY ${APP_ENV}.npmrc  .npmrc

COPY package*.json ./
RUN npm install -g pnpm
# Install dependencies
RUN pnpm install --shamefully-hoist

# Copy source code
COPY . .

# Build arguments for environment
ARG NODE_ENV=production
ARG NEXT_PUBLIC_API_BASE_URL
ARG NEXT_PUBLIC_CAMUNDA_API_BASE_URL
ARG NEXT_PUBLIC_NODE_ENV
ARG NEXT_PUBLIC_APP_ENV

# Set environment variables for build
ENV NODE_ENV=$NODE_ENV
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_CAMUNDA_API_BASE_URL=$NEXT_PUBLIC_CAMUNDA_API_BASE_URL
ENV NEXT_PUBLIC_NODE_ENV=$NEXT_PUBLIC_NODE_ENV
ENV NEXT_PUBLIC_APP_ENV=$NEXT_PUBLIC_APP_ENV

# Build with app version injected from package.json for client-side env usage
RUN NEXT_PUBLIC_APP_VERSION=$(node -p "require('./package.json').version") pnpm run build

FROM custom-nodejs:v1 AS runner

WORKDIR /app
COPY --from=builder /app/.npmrc  .npmrc
RUN npm install -g pnpm

# Copy built application
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

# Expose port
EXPOSE 3000

# Start the application
CMD ["pnpm", "start"]
