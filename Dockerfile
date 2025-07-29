# Step 1: Build Next.js
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
COPY tsconfig.json ./
COPY tailwind.config.ts ./
COPY postcss.config.js ./
COPY next.config.js ./
COPY ./src ./src
COPY ./public ./public
RUN npm ci
RUN npm run build

# Step 2: Prepare production image
FROM node:20-alpine AS runner

WORKDIR /app

# Copy only what’s needed
COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/src ./src

# Copy PocketBase binary and data folders
COPY ./pocketbase /app/pocketbase
COPY ./pb_data /app/pb_data
COPY ./pb_migrations /app/pb_migrations
RUN chmod +x /app/pocketbase

EXPOSE 3000

CMD ["sh", "-c", "./pocketbase serve & npm run start"]
