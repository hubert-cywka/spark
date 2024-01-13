ARG ENV=dev

FROM node:lts AS preparation
WORKDIR /app

RUN mkdir server
RUN mkdir client

COPY client/index.html client/index.html
COPY client/package.json client/package.json
COPY client/package-lock.json client/package-lock.json
COPY client/vite.config.ts client/vite.config.json
COPY client/tsconfig.json client/tsconfig.json
COPY client/tsconfig.node.json client/tsconfig.node.json
COPY client/src client/src
COPY client/public client/public

COPY server/package.json server/package.json
COPY server/package-lock.json server/package-lock.json
COPY server/tsconfig.json server/tsconfig.json
COPY server/src server/src

FROM preparation AS pre-build-dev
RUN echo "Stage 'pre-build-dev' is empty. Skipping..."

FROM preparation AS pre-build-ci
RUN echo "Stage 'pre-build-ci' is empty. Skipping..."

FROM pre-build-${ENV} AS build
WORKDIR /app/client
RUN npm ci
RUN npm run build

WORKDIR /app/server
RUN npm ci
RUN npm run build

WORKDIR /app

FROM node:20.8.1-bookworm-slim
COPY --from=build /app/client/dist ./app/static
COPY --from=build /app/server/dist ./app
EXPOSE 80

CMD ["node", "/app/index.js"]
