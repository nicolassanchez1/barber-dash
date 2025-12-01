export default {
  get: (key) => {
    return localStorage.getItem(key);
  },

  set: (key, value) => {
    localStorage.setItem(key, value);
  },

  getObject: (key) => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : undefined;
  },

  setObject: (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  },

  clearKey: (key) => {
    localStorage.removeItem(key);
  }
};
