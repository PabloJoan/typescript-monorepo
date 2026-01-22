FROM node:25-alpine AS base

WORKDIR /app
RUN npm install -g pnpm

COPY . .

# Install dependencies
RUN pnpm install --frozen-lockfile

# Expose Vite dev port
EXPOSE 5173

# Run vite dev server
CMD ["pnpm", "--filter", "@repo/client", "dev", "--host"]
