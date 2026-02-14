import { cn } from "$lib/shared/utils";
import type { Component } from "svelte";
import type { SettingsTab } from "$lib/components/header/types";

export const COMMAND_ITEM_CLASS = "flex h-10 cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 text-sm outline-hidden select-none";

export function commandItemClass(performanceMode: boolean): string {
  return cn(COMMAND_ITEM_CLASS, performanceMode ? "data-selected:bg-background-lore" : "data-selected:bg-background-grey");
}

type SettingsTabItem = {
  type: "tab";
  value: string;
  label: string;
  keywords: string[];
  icon: Component<{ class?: string }>;
  tab: SettingsTab;
};

type SettingsToggleItem = {
  type: "toggle";
  value: string;
  label: string;
  keywords: string[];
  icon: Component<{ class?: string }>;
  preferenceKey: "performanceMode" | "showGlint" | "mctooltip";
  iconProps?: Record<string, unknown>;
};

export type SettingsConfigItem = SettingsTabItem | SettingsToggleItem;
