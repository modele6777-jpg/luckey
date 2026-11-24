FROM node:22-bookworm-slim AS build
WORKDIR /app
COPY . .
RUN --mount=type=cache,target=/root/.npm \
    --mount=type=secret,id=npm_registry_ca \
    if [ -r /run/secrets/npm_registry_ca ]; then export NODE_EXTRA_CA_CERTS=/run/secrets/npm_registry_ca; fi; \
    npm ci --include=dev && npm run build:deploy && npm prune --omit=dev --offline

FROM node:22-bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/package.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
USER node
EXPOSE 3000
CMD ["npm", "start"]
