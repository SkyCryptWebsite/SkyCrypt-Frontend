import { browser } from "$app/environment";
import { loadOldStorageKey } from "$ctx/utils";
import { DEFAULT_THEME, mergeThemeWithDefaults, ThemeEngine, type ThemeV3 } from "$lib/shared/themes";
import { FIRST_PARTY_THEMES } from "$lib/shared/themes/first-party";
import { PersistedState } from "runed";
import { createContext, untrack } from "svelte";

export class ThemeContext {
  #themes = new PersistedState<ThemeV3[]>("skycryptThemes", []);
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
    return [...FIRST_PARTY_THEMES, ...this.userThemes, DEFAULT_THEME];
  }

  get userThemes(): ThemeV3[] {
    return this.#themes.current;
  }

  saveTheme(theme: ThemeV3): void {
    if (this.isFirstParty(theme.id)) {
      console.warn(`Cannot save first-party theme: ${theme.id}`);
      return;
    }

    const existingIndex = this.#themes.current.findIndex((t) => t.id === theme.id);

    if (existingIndex >= 0) {
      const updated = [...this.#themes.current];
      updated[existingIndex] = {
        ...theme,
        meta: {
          ...theme.meta,
          updatedAt: Date.now()
        }
      };
      this.#themes.current = updated;
    } else {
      this.#themes.current = [
        ...this.#themes.current,
        {
          ...theme,
          meta: {
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

    this.#themes.current = this.#themes.current.filter((t) => t.id !== id);

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
      id: duplicateId,
      name: `${original.name} (Copy)`,
      meta: {
        createdAt: Date.now(),
        updatedAt: Date.now(),
        version: 1
      }
    };

    this.saveTheme(duplicate);
    return duplicate;
  }

  isFirstParty(id: string): boolean {
    return id === "default" || FIRST_PARTY_THEMES.some((t) => t.id === id);
  }

  #resolveTheme(id: string): ThemeV3 | null {
    if (id === "default") return DEFAULT_THEME;

    const firstParty = FIRST_PARTY_THEMES.find((t) => t.id === id);
    if (firstParty) return firstParty;

    const userTheme = this.#themes.current.find((t) => t.id === id);
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
