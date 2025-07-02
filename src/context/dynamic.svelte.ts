import { getContext, setContext } from "svelte";

/**
 * Generic context class that can handle any data type with Svelte 5 reactivity
 */
class DynamicContext<T> {
  #data = $state<T | undefined>(undefined);

  get data(): T | undefined {
    return this.#data;
  }

  set data(value: T) {
    this.#data = value;
  }

  constructor(data: T) {
    this.#data = data;
  }
}

/**
 * Creates a typed context manager for a specific type T
 * This provides full type safety and IntelliSense support
 *
 * @example
 * ```typescript
 * // Create a typed context for user data
 * const userContext = createTypedContext<User>();
 *
 * // In a parent component
 * userContext.set("user", { id: 1, name: "John" });
 *
 * // In a child component
 * const user = userContext.require("user"); // Fully typed as User
 * ```
 */
export function createTypedContext<T>() {
  return {
    /**
     * Set context data. Updates existing context if present.
     */
    set: (key: string, data: T): void => {
      const existing = getContext<DynamicContext<T>>(key);
      if (existing) {
        existing.data = data;
        return;
      }
      setContext(key, new DynamicContext(data));
    },

    /**
     * Get context data. Returns undefined if not found.
     */
    get: (key: string): T | undefined => {
      const context = getContext<DynamicContext<T>>(key);
      return context?.data;
    },

    /**
     * Get context data. Throws error if not found.
     */
    require: (key: string): T => {
      const context = getContext<DynamicContext<T>>(key);
      if (!context || context.data === undefined) {
        throw new Error(`Context '${key}' not found or has no data`);
      }
      return context.data;
    },

    /**
     * Get the full context object (useful for reactive bindings)
     */
    getContext: (key: string): DynamicContext<T> | undefined => {
      return getContext<DynamicContext<T>>(key);
    }
  };
}

/**
 * Set dynamic context with any type (less type-safe but more flexible)
 *
 * @example
 * ```typescript
 * setDynamicCtx("profile", profileData);
 * setDynamicCtx("settings", settingsData);
 * ```
 */
export function setDynamicCtx<T>(key: string, data: T): void {
  const existing = getContext<DynamicContext<T>>(key);
  if (existing) {
    existing.data = data;
    return;
  }
  setContext(key, new DynamicContext(data));
}

/**
 * Get dynamic context object
 */
export function getDynamicCtx<T>(key: string): DynamicContext<T> | undefined {
  return getContext<DynamicContext<T>>(key);
}

/**
 * Get typed context data
 *
 * @example
 * ```typescript
 * const profile = getTypedCtx<ProfileData>("profile");
 * ```
 */
export function getTypedCtx<T>(key: string): T | undefined {
  const context = getDynamicCtx<T>(key);
  return context?.data;
}

/**
 * Get typed context data, throws if not found
 *
 * @example
 * ```typescript
 * const profile = requireTypedCtx<ProfileData>("profile");
 * ```
 */
export function requireTypedCtx<T>(key: string): T {
  const data = getTypedCtx<T>(key);
  if (data === undefined) {
    throw new Error(`Context '${key}' not found`);
  }
  return data;
}

/**
 * Usage Examples:
 *
 * // Type-safe approach (recommended)
 * const userCtx = createTypedContext<User>();
 * userCtx.set("current-user", userData);
 * const user = userCtx.require("current-user"); // Fully typed
 *
 * // Using pre-configured contexts
 * profileContext.set("main-profile", profileData);
 * const profile = profileContext.get("main-profile"); // Typed as StatsV2
 *
 * // Dynamic approach
 * setDynamicCtx("profile", profileData);
 * const profile = getTypedCtx<StatsV2>("profile");
 *
 * // In Svelte components:
 * <script>
 *   // Set context (parent component)
 *   profileContext.set("profile", $page.data.profile);
 *
 *   // Get context (child component)
 *   const profile = profileContext.require("profile");
 *
 *   // Reactive context (child component)
 *   const profileCtx = profileContext.getContext("profile");
 *   const profile = $derived(profileCtx?.data);
 * </script>
 */
