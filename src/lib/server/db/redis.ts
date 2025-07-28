import { building } from "$app/environment";
import { env } from "$env/dynamic/private";
import { createClient } from "redis";

const { REDIS_HOST, REDIS_PASSWORD, REDIS_PORT } = env;

export const REDIS = createClient({
  url: `redis://default:${REDIS_PASSWORD}@${REDIS_HOST}:${REDIS_PORT}`
});

export async function startRedis() {
  if (REDIS.isReady || REDIS.isOpen || building) return;

  return REDIS.connect();
}
