FROM node:22-alpine AS builder

RUN apk add git
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

ARG PUBLIC_COMMIT_HASH
ENV PUBLIC_COMMIT_HASH=$PUBLIC_COMMIT_HASH

COPY package*.json .
COPY pnpm-lock.yaml .

RUN pnpm fetch
RUN pnpm install --frozen-lockfile
COPY .env.example .env

COPY . .

RUN pnpm run prepare
RUN pnpm run build
RUN pnpm prune --production

FROM node:22-alpine

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable pnpm && corepack install -g pnpm@latest-10

WORKDIR /app

COPY --from=builder /app/build build/
COPY --from=builder /app/node_modules node_modules/
COPY --from=builder /app/static static/
COPY package.json .
COPY pnpm-lock.yaml .

EXPOSE 3000
ENV NODE_ENV=production
CMD ["pnpm", "run", "runbuild"]