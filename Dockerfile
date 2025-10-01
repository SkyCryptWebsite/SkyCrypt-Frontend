FROM node:22-alpine AS builder
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app

# Accept build arguments
ARG PUBLIC_API_URL=http://localhost:8080/api/
ARG PUBLIC_SERVER_API_URL=http://localhost:8080/api/

ENV NODE_LIBC=musl

COPY package*.json .
COPY pnpm-lock.yaml .
RUN pnpm fetch --prod
RUN pnpm install --frozen-lockfile
RUN find node_modules -name "lightningcss*.node"
COPY .env.example .env

# Create development .env with proper API URLs
RUN echo "ORIGIN=\"http://localhost:3000\"" > .env && \
    echo "PUBLIC_DISCORD_INVITE=\"https://discord.gg/\"" >> .env && \
    echo "PUBLIC_PATREON=\"https://www.patreon.com/\"" >> .env && \
    echo "ADDRESS_HEADER=\"\"" >> .env && \
    echo "PUBLIC_SENTRY_DSN=\"\"" >> .env && \
    echo "PUBLIC_SENTRY_HOST=\"\"" >> .env && \
    echo "PUBLIC_SENTRY_PROJECT_ID=\"\"" >> .env && \
    echo "PUBLIC_API_URL=\"${PUBLIC_API_URL}\"" >> .env && \
    echo "PUBLIC_SERVER_API_URL=\"${PUBLIC_SERVER_API_URL}\"" >> .env

COPY . .

RUN pnpm run prepare
RUN pnpm run build
RUN pnpm prune --production

FROM node:22-alpine
# git is used for managing submodules
RUN apk add git
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable pnpm && corepack install -g pnpm@latest-10
WORKDIR /app

COPY --from=builder /app/node_modules node_modules/
COPY --from=builder /app/build build/
COPY package.json .
COPY pnpm-lock.yaml .

EXPOSE 3000
ENV NODE_ENV=production
CMD ["pnpm", "run", "runbuild"]