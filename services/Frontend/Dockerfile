ARG ENV=dev
# Pass any client-side env variables as arguments as they are required during build-time

FROM node:22.9-alpine AS base

COPY package.json package-lock.json ./
RUN npm ci

FROM base AS preparation
WORKDIR /app

COPY src src
COPY public public
COPY scripts scripts
COPY translations translations
COPY next.config.mjs next.config.mjs
COPY package.json package.json
COPY package-lock.json package-lock.json
COPY tsconfig.json tsconfig.json

FROM preparation AS pre-build-dev
RUN echo "Stage 'pre-build-dev' is empty. Skipping..."

FROM preparation AS pre-build-ci
RUN echo "Stage 'pre-build-ci' is empty. Skipping..."

FROM pre-build-${ENV} AS build
RUN npm run build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=build /app/public ./app/public
COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./app/.next/static

USER nextjs

ENV PORT=80

EXPOSE 80
CMD ["node", "./app/server.js"]
