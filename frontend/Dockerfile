# Instala dependencias y compila la aplicación para producción.
FROM node:22-alpine AS builder
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
ARG VITE_API_BASE_URL=http://localhost:8088
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
RUN pnpm run build

# Ejecuta únicamente el artefacto SSR generado por Nitro.
FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000
COPY --from=builder /app/.output ./.output
USER node
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]