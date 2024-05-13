FROM oven/bun:1-alpine as builder

WORKDIR /app
COPY package.json .
COPY bun.lockb .
RUN bun install --production --frozen-lockfile
COPY . .
ENTRYPOINT [ "bun", "src/index.ts" ]