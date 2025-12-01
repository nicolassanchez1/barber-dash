import FetchClient from './client';

export const apiGet = (url) => FetchClient.get(url);

export const apiPost = (url, data, contentType = {}) =>
    FetchClient.post(url, data, contentType);

export const apiPut = (url, data, contentType = {}) =>
    FetchClient.put(url, data, contentType);

export const apiDelete = (url, data) => FetchClient.delete(url, data);
