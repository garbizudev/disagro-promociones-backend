FROM node:20-slim AS builder

RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma

RUN npm ci

RUN npx prisma generate

RUN find src/generated/prisma -name "*.ts" ! -name "*.d.ts" \
    -exec sed -i 's/\.ts"/\.js"/g; s/\.ts'"'"'/\.js'"'"'/g' {} \;

COPY tsconfig.json ./
COPY src ./src

RUN npm run build

RUN mkdir -p dist/generated/prisma \
    && find src/generated/prisma -name "*.node" -exec cp {} dist/generated/prisma/ \;

FROM node:20-slim AS runtime

RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./

RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main.js"]
