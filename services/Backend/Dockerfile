ARG ENV=dev

FROM node:22.9-alpine AS preparation
WORKDIR /app

COPY src src
COPY package.json package.json
COPY package-lock.json  package-lock.json
COPY .npmrc .npmrc
COPY nest-cli.json nest-cli.json
COPY tsconfig.json tsconfig.json
COPY tsconfig.build.json tsconfig.build.json

FROM preparation AS pre-build-dev
RUN echo "Stage 'pre-build-dev' is empty. Skipping..."

FROM preparation AS pre-build-ci
RUN echo "Stage 'pre-build-ci' is empty. Skipping..."

FROM pre-build-${ENV} AS build
WORKDIR /app
RUN npm ci
RUN npm run build

WORKDIR /app

FROM node:20.8.1-bookworm-slim
COPY --chown=node:node --from=build /app/dist ./app/dist
COPY --chown=node:node --from=build /app/node_modules ./app/node_modules
EXPOSE 80

CMD ["node", "/app/dist/main"]
