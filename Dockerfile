# ETAPA 1: Instalación de dependencias
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm install

# ETAPA 2: Construcción (Build)
FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Generamos el cliente de Prisma y construimos la app
RUN npx prisma generate
RUN npm run build

# ETAPA 3: Ejecución (Runner) - La imagen que irá a producción
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Solo copiamos lo estrictamente necesario para correr
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
CMD ["npm", "start"]
