ARG ENV=dev

FROM node:22.4-alpine AS preparation
WORKDIR /app

COPY src src
COPY package.json package.json
COPY package-lock.json  package-lock.json
COPY .swcrc .swcrc
COPY nest-cli.json nest-cli.json
COPY tsconfig.json tsconfig.json
COPY tsconfig.build.json tsconfig.build.json

RUN npm ci

FROM preparation AS pre-build-dev
ENV NODE_ENV=development

FROM preparation AS pre-build-ci
ENV NODE_ENV=production

FROM pre-build-${ENV} AS build
WORKDIR /app
RUN npm run build

FROM gcr.io/distroless/nodejs22-debian12 AS final
WORKDIR /app

USER nonroot

COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules

EXPOSE 80

CMD ["--import", "./dist/common/observability/tracing.js", "dist/main"]