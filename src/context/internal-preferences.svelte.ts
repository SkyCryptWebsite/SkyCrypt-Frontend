import { PersistedState } from "runed";
import { createContext } from "svelte";

interface InternalPreferencesData {
  skycryptSurvey: {
    dismissedAt: Date | null;
    confirmedAt: Date | null;
    surveyVersion: number;
    surveyName: string;
  };
}

export class InternalPreferencesContext {
  #data = new PersistedState<InternalPreferencesData>("skycryptInternalPreferences", {
    skycryptSurvey: {
      dismissedAt: null,
      confirmedAt: null,
      surveyVersion: 0,
      surveyName: ""
    }
  });

  get skycryptSurvey() {
    return this.#data.current.skycryptSurvey;
  }

  set skycryptSurvey(value: InternalPreferencesData["skycryptSurvey"]) {
    this.#data.current = { ...this.#data.current, skycryptSurvey: value };
  }
}

const [getInternalPreferences, setInternalPreferences] = createContext<InternalPreferencesContext>();

function initInternalPreferences() {
  const preferences = new InternalPreferencesContext();
  setInternalPreferences(preferences);
  return preferences;
}

export { getInternalPreferences, initInternalPreferences };
