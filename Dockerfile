# syntax=docker/dockerfile:1

FROM node:26-alpine AS pnpm
COPY --from=ghcr.io/pnpm/pnpm:12-alpine /opt/pnpm /opt/pnpm
RUN for bin in pnpm pn pnpx pnx; do ln -s "/opt/pnpm/$bin" "/usr/local/bin/$bin"; done
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

WORKDIR /app

FROM pnpm AS builder

RUN apk add --no-cache git

ARG PUBLIC_COMMIT_HASH=0000000
ARG PUBLIC_RELEASE_CHANNEL=stable
ARG PUBLIC_SERVER_API_URL=http://localhost:8080/api/
ARG ORIGIN=http://localhost:5173

ENV PUBLIC_COMMIT_HASH=$PUBLIC_COMMIT_HASH
ENV PUBLIC_RELEASE_CHANNEL=$PUBLIC_RELEASE_CHANNEL
ENV PUBLIC_SERVER_API_URL=$PUBLIC_SERVER_API_URL
ENV ORIGIN=$ORIGIN
ENV PUBLIC_ORIGIN=$ORIGIN

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm fetch
RUN pnpm install --offline --frozen-lockfile
COPY .env.example .env

COPY . .

RUN pnpm run prepare
RUN --mount=type=secret,id=maintenance_bypass,env=MAINTENANCE_BYPASS_TOKEN pnpm run build

FROM pnpm AS prod-deps

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm fetch --prod
RUN pnpm install --offline --frozen-lockfile --prod

FROM node:26-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production

ARG ORIGIN=http://localhost:5173
ENV ORIGIN=$ORIGIN
ENV PUBLIC_ORIGIN=$ORIGIN

COPY --from=builder --chown=node:node /app/build ./build
COPY --from=prod-deps --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/static ./static
COPY --from=builder --chown=node:node /app/drizzle ./drizzle
COPY --chown=node:node package.json ./

EXPOSE 3000

USER node

CMD ["node", "./build"]
