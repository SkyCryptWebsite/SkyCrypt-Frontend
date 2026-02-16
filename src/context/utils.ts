function loadOldStorageKey<T>(key: string, setter: (value: T) => void) {
  const item = localStorage.getItem(key);
  if (item !== null) {
    try {
      const value = JSON.parse(item);
      setter(value);
      localStorage.removeItem(key);
    } catch (e) {
      // If JSON.parse fails, try using the raw string value
      setter(item as T);
      localStorage.removeItem(key);
    }
  }
}

export { loadOldStorageKey };
