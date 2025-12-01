import fetch from '../utils/fetch';
import { GET, POST, PUT, DELETE } from '../constants/text';

const headerDefault = { 'Content-Type': 'application/json' };

class FetchClient {
  baseUrl = import.meta.env.VITE_APP_BASE_URL;

  formatUrl(uri) {
    return `${this.baseUrl}/${uri}`;
  }

  async sendForm(method, uri, data, contentType = {}, isFile = false, isDataForm = false) {
    const url = this.formatUrl(uri);

    let options = {};

    options = {
      method,
      headers: { ...headerDefault, ...contentType }
    };

    if (method !== GET) {
      options = {
        ...options,
        body: isDataForm ? data : JSON.stringify(data)
      };
    }

    const response = await fetch.request(url, options);
    return isFile ? response.arrayBuffer() : response.json();
  }

  get(uri, data = {}) {
    return this.sendForm(GET, uri, data);
  }

  post(uri, data = {}, contentType = headerDefault, isFile = false, isDataForm = false) {
    return this.sendForm(POST, uri, data, contentType, isFile, isDataForm);
  }

  put(uri, data, contentType = headerDefault, isFile = false, isDataForm = false) {
    return this.sendForm(PUT, uri, data, contentType, isFile, isDataForm);
  }

  delete(uri, data = {}) {
    return this.sendForm(DELETE, uri, data);
  }
}

export default new FetchClient();
