ARG ENV=dev
# Pass any client-side env variables as arguments as they are required during build-time

FROM node:22.9-alpine AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

COPY src src
COPY public public
COPY scripts scripts
COPY translations translations
COPY next.config.mjs next.config.mjs
COPY package.json package.json
COPY package-lock.json package-lock.json
COPY tsconfig.json tsconfig.json

RUN npm ci

FROM node:22.9-alpine AS preparation
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

FROM preparation AS pre-build-dev
RUN echo "Stage 'pre-build-dev' is empty. Skipping..."

FROM preparation AS pre-build-ci
RUN echo "Stage 'pre-build-ci' is empty. Skipping..."

FROM pre-build-${ENV} AS build

ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM gcr.io/distroless/nodejs22-debian12 AS runner
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=build /app/next.config.mjs ./
COPY --from=build /app/public ./public
COPY --from=build /app/package.json ./package.json

COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static

EXPOSE 80
ENV PORT=80

CMD ["server.js"]