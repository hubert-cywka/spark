ARG ENV=dev

FROM node:lts AS preparation
WORKDIR /app

COPY package.json package.json
COPY package-lock.json package-lock.json
COPY next.config.mjs next.config.mjs
COPY tsconfig.json tsconfig.json
COPY public public
COPY messages messages
COPY src src

FROM preparation AS pre-build-dev
RUN echo "Stage 'pre-build-dev' is empty. Skipping..."

FROM preparation AS pre-build-ci
RUN echo "Stage 'pre-build-ci' is empty. Skipping..."

FROM pre-build-${ENV} AS build
WORKDIR /app
RUN npm ci
RUN npm run build

FROM node:20.8.1-bookworm-slim
WORKDIR /app

COPY --from=build /app/.next ./.next
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/public ./public

EXPOSE 80

CMD ["npm", "run", "start", "--", "-p", "80"]
