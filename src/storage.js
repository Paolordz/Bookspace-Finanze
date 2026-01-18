const createLocalStorageAdapter = () => ({
  async get(key) {
    const value = localStorage.getItem(key);
    return value === null ? null : { value };
  },
  async set(key, value) {
    localStorage.setItem(key, value);
    return true;
  },
});

if (typeof window !== 'undefined' && !window.storage) {
  window.storage = createLocalStorageAdapter();
}
