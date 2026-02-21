import { browser } from "$app/environment";
import { loadOldStorageKey } from "$ctx/utils";
import { DEFAULT_THEME, mergeThemeWithDefaults, ThemeEngine, type ThemeV3 } from "$lib/shared/themes";
import { FIRST_PARTY_THEMES } from "$lib/shared/themes/first-party";
import * as devalue from "devalue";
import { PersistedState } from "runed";
import { createContext, untrack } from "svelte";

const devalueSerializer = {
  serialize: devalue.stringify,
  deserialize: <T>(value: string): T | undefined => {
    try {
      return devalue.parse(value) as T;
    } catch {
      return undefined;
    }
  }
};

export class ThemeContext {
  #themes = new PersistedState<ThemeV3[]>("skycryptThemes", [], { serializer: devalueSerializer });
  #activeId = new PersistedState<string>("skycryptActiveTheme", "default");

  constructor() {
    $effect.pre(() => {
      untrack(() => {
        this.#migrateOldTheme();
        if (browser) {
          const theme = this.activeTheme;
          if (theme) {
            ThemeEngine.applyTheme(theme);
          }
        }
      });
    });
  }

  get activeThemeId(): string {
    return this.#activeId.current;
  }

  set activeThemeId(id: string) {
    this.#activeId.current = id;
    if (browser) {
      const theme = this.#resolveTheme(id);
      if (theme) {
        if (document.startViewTransition) {
          document.startViewTransition(() => ThemeEngine.applyTheme(theme));
        } else {
          ThemeEngine.applyTheme(theme);
        }
      }
    }
  }

  get activeTheme(): ThemeV3 | null {
    return this.#resolveTheme(this.activeThemeId);
  }

  get allThemes(): ThemeV3[] {
    return [...FIRST_PARTY_THEMES, ...this.userThemes];
  }

  get userThemes(): ThemeV3[] {
    return this.#themes.current;
  }

  saveTheme(theme: ThemeV3): void {
    if (this.isFirstParty(theme.metadata.id)) {
      console.warn(`Cannot save first-party theme: ${theme.metadata.id}`);
      return;
    }

    const existingIndex = this.#themes.current.findIndex((t) => t.metadata.id === theme.metadata.id);

    if (existingIndex >= 0) {
      const updated = [...this.#themes.current];
      updated[existingIndex] = {
        ...theme,
        metadata: {
          ...theme.metadata,
          updatedAt: Date.now()
        }
      };
      this.#themes.current = updated;
    } else {
      this.#themes.current = [
        ...this.#themes.current,
        {
          ...theme,
          metadata: {
            ...theme.metadata,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            version: 1
          }
        }
      ];
    }
  }

  deleteTheme(id: string): void {
    if (this.isFirstParty(id)) {
      console.warn(`Cannot delete first-party theme: ${id}`);
      return;
    }

    this.#themes.current = this.#themes.current.filter((t) => t.metadata.id !== id);

    if (this.activeThemeId === id) {
      this.activeThemeId = "default";
    }
  }

  duplicateTheme(id: string): ThemeV3 | null {
    const original = this.#resolveTheme(id);
    if (!original) return null;

    const duplicateId = `${id}-copy-${Date.now()}`;
    const duplicate: ThemeV3 = {
      ...original,
      metadata: {
        ...original.metadata,
        id: duplicateId,
        name: `${original.metadata.name} (Copy)`,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        version: 1
      }
    };

    this.saveTheme(duplicate);
    return duplicate;
  }

  isFirstParty(id: string): boolean {
    return id === "default" || FIRST_PARTY_THEMES.some((t) => t.metadata.id === id);
  }

  #resolveTheme(id: string): ThemeV3 | null {
    if (id === "default") return DEFAULT_THEME;

    const firstParty = FIRST_PARTY_THEMES.find((t) => t.metadata.id === id);
    if (firstParty) return firstParty;

    const userTheme = this.#themes.current.find((t) => t.metadata.id === id);
    if (userTheme) return mergeThemeWithDefaults(userTheme);

    return null;
  }

  #migrateOldTheme(): void {
    loadOldStorageKey("skycryptTheme", (oldThemeId: string) => {
      this.#activeId.current = oldThemeId;
    });
  }

  get current(): string {
    return this.activeThemeId;
  }

  set current(value: string) {
    this.activeThemeId = value;
  }
}

const [getTheme, setTheme] = createContext<ThemeContext>();

function initTheme() {
  const themeContext = new ThemeContext();
  setTheme(themeContext);
  return themeContext;
}

function changeTheme(themeId: string, themeContext: ThemeContext) {
  themeContext.activeThemeId = themeId;
}

export { changeTheme, getTheme, initTheme };
