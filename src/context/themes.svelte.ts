import { browser } from "$app/environment";
import { loadOldStorageKey } from "$ctx/utils";
import themes, { type Theme } from "$lib/shared/constants/themes";
import { PersistedState } from "runed";
import { createContext, untrack } from "svelte";

type ThemeData = string;

export class ThemeContext {
  #data = new PersistedState<ThemeData>("skycryptTheme", "default");

  constructor() {
    $effect.pre(() => {
      untrack(() => {
        this.loadOldTheme();
      });
    });
  }

  get current() {
    return this.#data.current;
  }

  set current(value: ThemeData) {
    this.#data.current = value;
  }

  loadOldTheme() {
    loadOldStorageKey("theme", (value: ThemeData) => {
      this.current = value;
    });
  }
}

const [getTheme, setTheme] = createContext<ThemeContext>();

function initTheme() {
  const themeContext = new ThemeContext();
  setTheme(themeContext);
  if (browser) changeTheme(themeContext.current, themeContext);
  return themeContext;
}

function changeTheme(themeId: Theme["id"], themeContext: ThemeContext) {
  const theme = themes.find((theme) => theme.id === themeId);
  if (!theme) {
    // Fallback to default theme
    themeContext.current = "default";
    document.documentElement.dataset.theme = "default";
    return;
  }
  if (theme.light) {
    document.documentElement.dataset.mode = "light";
    document.documentElement.classList.remove("dark");
    document.documentElement.classList.add("light");
  } else {
    document.documentElement.dataset.mode = "dark";
    document.documentElement.classList.remove("light");
    document.documentElement.classList.add("dark");
  }

  document.documentElement.dataset.theme = theme.id;
}

export { changeTheme, getTheme, initTheme };
