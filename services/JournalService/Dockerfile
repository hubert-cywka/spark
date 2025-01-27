ARG ENV=dev

FROM node:22.4-alpine AS preparation
WORKDIR /app

COPY src src
COPY package.json package.json
COPY package-lock.json  package-lock.json
COPY .npmrc .npmrc
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

WORKDIR /app

FROM node:22.4-bookworm-slim
COPY --chown=node:node --from=build /app/package-lock.json ./app/package-lock.json
COPY --chown=node:node --from=build /app/package.json ./app/package.json
COPY --chown=node:node --from=build /app/dist ./app/dist
COPY --chown=node:node --from=build /app/node_modules ./app/node_modules
EXPOSE 80

CMD ["node", "/app/dist/main"]
