import * as devalue from "devalue";
import { DEFAULT_THEME } from "./defaults";
import { mergeThemeWithDefaults } from "./engine";
import type { PartialThemeV3, ThemeV3 } from "./schema";
import { partialThemeV3Schema } from "./schema";

/**
 * URL-based theme sharing utilities
 * Compresses themes into shareable URL hashes using browser-native compression APIs
 */

/**
 * Deep comparison to strip default values from theme
 * Only returns fields that differ from DEFAULT_THEME
 */
function stripDefaults(theme: ThemeV3, defaults: ThemeV3): PartialThemeV3 {
  const partial: PartialThemeV3 = {};

  // Metadata
  const metadataDiffs: Partial<ThemeV3["metadata"]> = {};
  let hasMetadataDiffs = false;

  if (theme.metadata.id !== defaults.metadata.id) {
    metadataDiffs.id = theme.metadata.id;
    hasMetadataDiffs = true;
  }
  if (theme.metadata.name !== defaults.metadata.name) {
    metadataDiffs.name = theme.metadata.name;
    hasMetadataDiffs = true;
  }
  if (theme.metadata.author !== defaults.metadata.author) {
    metadataDiffs.author = theme.metadata.author;
    hasMetadataDiffs = true;
  }
  if (theme.metadata.version !== defaults.metadata.version) {
    metadataDiffs.version = theme.metadata.version;
    hasMetadataDiffs = true;
  }

  if (hasMetadataDiffs) partial.metadata = metadataDiffs;

  // Top-level primitives
  if (theme.light !== defaults.light) partial.light = theme.light;

  if (theme.colors) {
    const defaultColors = defaults.colors ?? {};
    const colorDiffs: Partial<NonNullable<ThemeV3["colors"]>> = {};
    let hasColorDiffs = false;
    for (const key in theme.colors) {
      const k = key as keyof NonNullable<ThemeV3["colors"]>;
      if (theme.colors[k] !== defaultColors[k]) {
        colorDiffs[k] = theme.colors[k];
        hasColorDiffs = true;
      }
    }
    if (hasColorDiffs) partial.colors = colorDiffs;
  }

  if (theme.backgrounds) {
    const defaultBackgrounds = defaults.backgrounds ?? {};
    const backgroundDiffs: Partial<NonNullable<ThemeV3["backgrounds"]>> = {};
    let hasBackgroundDiffs = false;

    if (theme.backgrounds.skillbar && devalue.stringify(theme.backgrounds.skillbar) !== devalue.stringify(defaultBackgrounds.skillbar)) {
      backgroundDiffs.skillbar = theme.backgrounds.skillbar;
      hasBackgroundDiffs = true;
    }

    if (theme.backgrounds.maxedbar && devalue.stringify(theme.backgrounds.maxedbar) !== devalue.stringify(defaultBackgrounds.maxedbar)) {
      backgroundDiffs.maxedbar = theme.backgrounds.maxedbar;
      hasBackgroundDiffs = true;
    }

    if (devalue.stringify(theme.backgrounds.page) !== devalue.stringify(defaultBackgrounds.page)) {
      backgroundDiffs.page = theme.backgrounds.page;
      hasBackgroundDiffs = true;
    }

    if (hasBackgroundDiffs) partial.backgrounds = backgroundDiffs;
  }

  // Minecraft (nested with optional overrides)
  const minecraftDiffs: Partial<ThemeV3["minecraft"]> = {};
  let hasMinecraftDiffs = false;

  if (theme.minecraft.palette !== defaults.minecraft.palette) {
    minecraftDiffs.palette = theme.minecraft.palette;
    hasMinecraftDiffs = true;
  }

  if (devalue.stringify(theme.minecraft.overrides) !== devalue.stringify(defaults.minecraft.overrides)) {
    minecraftDiffs.overrides = theme.minecraft.overrides;
    hasMinecraftDiffs = true;
  }

  if (hasMinecraftDiffs) partial.minecraft = minecraftDiffs;

  // Enchanted glint (optional field)
  if (theme.enchantedGlint !== defaults.enchantedGlint) {
    partial.enchantedGlint = theme.enchantedGlint;
  }

  return partial;
}

/**
 * Base64url encode (URL-safe variant)
 * Replaces + with -, / with _, removes = padding
 */
function base64urlEncode(data: Uint8Array): string {
  const base64 = btoa(String.fromCharCode(...data));
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

/**
 * Base64url decode (URL-safe variant)
 * Reverses base64urlEncode transformation
 */
function base64urlDecode(str: string): Uint8Array | null {
  try {
    // Restore standard base64 characters
    let base64 = str.replace(/-/g, "+").replace(/_/g, "/");

    // Add padding back
    while (base64.length % 4) {
      base64 += "=";
    }

    const binary = atob(base64);
    return new Uint8Array(binary.split("").map((c) => c.charCodeAt(0)));
  } catch {
    return null; // Invalid base64
  }
}

/**
 * Encode theme into compressed URL-safe string
 * Strips defaults, compresses with deflate, base64url encodes
 *
 * @param theme - Full theme to encode
 * @returns Compressed base64url string
 */
export async function encodeTheme(theme: ThemeV3): Promise<string> {
  // 1. Strip defaults (only encode overrides)
  const partial = stripDefaults(theme, DEFAULT_THEME);

  // 2. JSON stringify
  const json = devalue.stringify(partial);

  // 3. Compress using browser-native CompressionStream
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(json));
      controller.close();
    }
  });

  const compressedStream = stream.pipeThrough(new CompressionStream("deflate"));
  const compressedData = await new Response(compressedStream).arrayBuffer();

  // 4. Base64url encode
  return base64urlEncode(new Uint8Array(compressedData));
}

/**
 * Decode theme from compressed URL-safe string
 * Base64url decodes, decompresses with deflate, validates with Zod, merges with defaults
 *
 * @param hash - Compressed base64url string
 * @returns Full theme or null if invalid
 */
export async function decodeTheme(hash: string): Promise<ThemeV3 | null> {
  try {
    // 1. Base64url decode
    const compressedData = base64urlDecode(hash);
    if (!compressedData) return null;

    // 2. Decompress using browser-native DecompressionStream
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(compressedData);
        controller.close();
      }
    });

    const decompressedStream = stream.pipeThrough(new DecompressionStream("deflate"));
    const decompressedData = await new Response(decompressedStream).arrayBuffer();
    const decoder = new TextDecoder();
    const json = decoder.decode(decompressedData);

    // 3. Parse JSON
    const parsed = devalue.parse(json);

    // 4. Validate with Zod
    const result = partialThemeV3Schema.safeParse(parsed);
    if (!result.success) return null;

    // 5. Merge with defaults
    return mergeThemeWithDefaults(result.data);
  } catch {
    // Graceful failure on any error (invalid base64, decompression failure, JSON parse error, etc.)
    return null;
  }
}

/**
 * Generate shareable URL with encoded theme in hash fragment
 *
 * @param theme - Full theme to share
 * @returns URL with ?theme=<encoded> hash
 */
export async function getThemeShareURL(theme: ThemeV3): Promise<string> {
  const encoded = await encodeTheme(theme);
  return `${window.location.origin}?theme=${encoded}`;
}

/**
 * Parse theme from URL hash fragment
 * Extracts #theme=<encoded> and decodes
 *
 * @param url - Full URL or hash fragment
 * @returns Full theme or null if invalid
 */
export async function parseThemeFromURL(url: string): Promise<ThemeV3 | null> {
  const match = url.match(/\?theme=([^&]+)/);
  if (!match) return null;

  return await decodeTheme(match[1]);
}
