FROM node:18-alpine AS base

RUN apk add --no-cache libc6-compat
RUN apk update

WORKDIR /app

FROM base AS builder
# Set working directory
RUN npm install -g turbo
COPY . .
RUN turbo prune --scope=server --docker

# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer

# First install the dependencies (as they change less often)
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN corepack enable
RUN pnpm install --frozen-lockfile

# Build the project
COPY --from=builder /app/out/full/ .
RUN pnpm dlx turbo run build --filter=server


FROM base AS runner

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 fastify
USER fastify

COPY --from=installer /app/apps/server/package.json .
COPY --from=installer /app/apps/server/node_modules ./node_modules

COPY --from=installer /app/node_modules ../../node_modules
COPY --from=installer /app/apps/server/dist ./apps/server/dist


CMD pwd && ls -la && npx nodemon ./apps/server/dist/index.js