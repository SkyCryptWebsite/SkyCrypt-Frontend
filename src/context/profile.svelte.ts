import type { StatsV2 } from "$types/statsv2";
import { getContext, setContext } from "svelte";

class ProfileContext {
  #data = $state<StatsV2>()!;

  get profile() {
    return this.#data;
  }

  set profile(value: StatsV2) {
    this.#data = value;
  }

  constructor(profile: StatsV2) {
    this.#data = profile;
  }
}

export function setProfileCtx(profile: StatsV2) {
  const existing = getProfileCtx();
  if (existing) {
    existing.profile = profile;
    return;
  }
  setContext("profile", new ProfileContext(profile));
}

export function getProfileCtx() {
  return getContext("profile") as ProfileContext;
}
