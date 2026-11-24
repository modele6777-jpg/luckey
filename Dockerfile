FROM node:22-bookworm-slim AS build
WORKDIR /app
COPY package.json package-lock.json .npmrc ./
RUN --mount=type=secret,id=npm_registry_ca \
    if [ -r /run/secrets/npm_registry_ca ]; then export NODE_EXTRA_CA_CERTS=/run/secrets/npm_registry_ca; fi; \
    npm ci --include=dev
COPY . .
RUN npm run build && npm run build:knowledge-research

FROM node:22-bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package-lock.json .npmrc ./
RUN --mount=type=secret,id=npm_registry_ca \
    if [ -r /run/secrets/npm_registry_ca ]; then export NODE_EXTRA_CA_CERTS=/run/secrets/npm_registry_ca; fi; \
    npm ci --omit=dev
COPY --from=build /app/dist ./dist
USER node
EXPOSE 3000
CMD ["npm", "start"]
