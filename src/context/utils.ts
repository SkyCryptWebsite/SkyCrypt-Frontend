function loadOldStorageKey<T>(key: string, setter: (value: T) => void) {
  const item = localStorage.getItem(key);
  if (item !== null) {
    try {
      const value = item.startsWith("{") || item.startsWith("[") ? JSON.parse(item) : item;
      setter(value);
      localStorage.removeItem(key);
    } catch (e) {
      console.error(`Failed to load old setting for ${key}:`, e);
    }
  }
}

export { loadOldStorageKey };
