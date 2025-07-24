import { env } from "$env/dynamic/private";
import { hmac } from "@oslojs/crypto/hmac";
import { SHA512 } from "@oslojs/crypto/sha2";
import { constantTimeEqual } from "@oslojs/crypto/subtle";
import { decodeHex, encodeHexLowerCase } from "@oslojs/encoding";

const { API_SECRET } = env;

const encoder = new TextEncoder();

export function generateToken(ip: string, userAgent: string, route: string) {
  const timestamp = Date.now().toString();
  const message = `${ip}:${timestamp}:${userAgent}:${route}`;

  const mac = hmac(SHA512, encoder.encode(API_SECRET), encoder.encode(message));
  const token = encodeHexLowerCase(mac);

  return { token, timestamp, route };
}

export function validateToken(
  ip: string,
  token: string,
  timestamp: string,
  userAgent: string,
  route: string,
  maxAge: number = 5 * 60 * 1000 // Default to 5 minutes
): boolean {
  const now = Date.now();
  if (Math.abs(now - Number(timestamp)) > maxAge) return false;

  const message = `${ip}:${timestamp}:${userAgent}:${route}`;
  const mac = hmac(SHA512, encoder.encode(API_SECRET), encoder.encode(message));

  // Decode incoming hex string to Uint8Array
  try {
    const tokenBytes = decodeHex(token);
    return constantTimeEqual(tokenBytes, mac);
  } catch {
    // Invalid hex string
    return false;
  }
}
