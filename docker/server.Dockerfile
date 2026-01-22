FROM node:25-alpine AS base

WORKDIR /app
RUN npm install -g pnpm

COPY . .

# Install dependencies
RUN pnpm install --frozen-lockfile

# Expose port
EXPOSE 4000

# Run in development mode with hot reload
# Using tsx watch via pnpm dev
CMD ["pnpm", "--filter", "@repo/server", "dev"]
