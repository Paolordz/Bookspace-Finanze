const DB_NAME = 'bookspace-db';
const STORE_NAME = 'kv';

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

const openDatabase = () => new Promise((resolve, reject) => {
  const request = indexedDB.open(DB_NAME, 1);

  request.onupgradeneeded = () => {
    const db = request.result;
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      db.createObjectStore(STORE_NAME);
    }
  };

  request.onsuccess = () => resolve(request.result);
  request.onerror = () => reject(request.error);
});

const createIndexedDBAdapter = () => {
  let dbPromise;
  const getDb = () => {
    if (!dbPromise) {
      dbPromise = openDatabase();
    }
    return dbPromise;
  };

  return {
    async get(key) {
      const db = await getDb();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const request = store.get(key);

        request.onsuccess = () => {
          if (request.result === undefined) {
            resolve(null);
          } else {
            resolve({ value: request.result });
          }
        };
        request.onerror = () => reject(request.error);
      });
    },
    async set(key, value) {
      const db = await getDb();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        store.put(value, key);
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => reject(tx.error);
      });
    },
  };
};

const createStorageAdapter = () => {
  const fallback = createLocalStorageAdapter();

  if (typeof window === 'undefined' || !('indexedDB' in window)) {
    return fallback;
  }

  const primary = createIndexedDBAdapter();

  return {
    async get(key) {
      try {
        return await primary.get(key);
      } catch (error) {
        console.warn('IndexedDB get failed, using localStorage.', error);
        return fallback.get(key);
      }
    },
    async set(key, value) {
      try {
        return await primary.set(key, value);
      } catch (error) {
        console.warn('IndexedDB set failed, using localStorage.', error);
        return fallback.set(key, value);
      }
    },
  };
};

if (typeof window !== 'undefined' && !window.storage) {
  window.storage = createStorageAdapter();
}
