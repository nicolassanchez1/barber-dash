// Root //
import { SET_CATEGORIES, SET_PRODUCTS, SET_USERS, SET_TABLES } from './types';
import { apiGet, apiPost, apiPut, apiDelete } from '../../api/methods';
import { urls } from '../../api/urls';
import { logout } from '../session/actions';
import { hideLoader, showLoader } from '../loader/actions';

export const setProducts = (products) => {
  return {
    type: SET_PRODUCTS,
    payload: { products }
  };
};

export const setCategories = (categories) => {
  return {
    type: SET_CATEGORIES,
    payload: { categories }
  };
};

export const setUsers = (users) => {
  return {
    type: SET_USERS,
    payload: { users }
  };
};

export const setTables = (tables) => {
  return {
    type: SET_TABLES,
    payload: { tables }
  };
};

export const getProductById = (id) => {
  return async (dispatch) => {
    try {
      const response = await apiGet(`${urls.product.getAllProducts}/${id}`);

      if (response?.products) {
        return response?.products[0];
      }

      if (response === 'UNAUTHORIZED') dispatch(logout());

      return Promise.resolve(response);
    } catch (error) {
      return Promise.reject(error);
    }
  };
};

export const loaderProducts = () => {
  return async (dispatch) => {
    try {
      const response = await apiGet(urls.product.getAllProducts);

      if (response?.products) {
        dispatch(setProducts(response?.products));
        return response;
      }

      if (response === 'UNAUTHORIZED') dispatch(logout());

      return Promise.resolve(response);
    } catch (error) {
      return Promise.reject(error);
    }
  };
};

export const loaderCategories = () => {
  return async (dispatch) => {
    try {
      const response = await apiGet(urls.category.getAllCategories);

      if (response?.categories) {
        dispatch(setCategories(response?.categories));
        return response;
      }

      if (response === 'UNAUTHORIZED') dispatch(logout());

      return Promise.resolve(response);
    } catch (error) {
      return Promise.reject(error);
    }
  };
};

export const createProduct = (data) => {
  return async (dispatch) => {
    try {
      const response = await apiPost(urls.product.createProduct, data);
      if (response?.allProducts) {
        dispatch(setProducts(response?.allProducts));
        return Promise.resolve();
      }
      if (response === 'UNAUTHORIZED') dispatch(logout());

      return Promise.resolve(response);
    } catch (error) {
      return Promise.reject(error);
    }
  };
};

export const updateProduct = (id, data) => {
  return async (dispatch) => {
    try {
      const response = await apiPut(`${urls.product.createProduct}/${id}`, data);
      if (response?.allProducts) {
        return Promise.resolve(response);
      }

      if (response === 'UNAUTHORIZED') dispatch(logout());

      return Promise.resolve(response);
    } catch (error) {
      return Promise.reject(error);
    }
  };
};

export const uploadImageCloudinary = (image) => {
  return async (dispatch) => {
    try {
      dispatch(showLoader());
      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/ddsoovawl/upload`;
      const data = new FormData();

      const res = await fetch(image);
      const blob = await res.blob();
      const file = new File([blob], 'image.jpg', { type: blob.type });

      data.append('file', file);
      data.append('upload_preset', 'statesman');

      const response = await fetch(cloudinaryUrl, {
        method: 'POST',
        body: data
      });

      const result = await response.json();

      if (response?.ok) {
        dispatch(hideLoader());
        return Promise.resolve(result.secure_url);
      } else {
        dispatch(hideLoader());
        console.error('Error subiendo la imagen:', result);
        return Promise.resolve('Hubo un error, intente mas tarde.');
      }
    } catch (error) {
      dispatch(hideLoader());
      return Promise.resolve(error);
    }
  };
};

export const deleteProduct = (id) => {
  return async (dispatch) => {
    try {
      dispatch(showLoader());
      const response = await apiDelete(`${urls.product.createProduct}/${id}`);

      if (response?.allProducts) {
        dispatch(setProducts(response?.allProducts));
        dispatch(hideLoader());
        return Promise.resolve(response);
      }

      if (response === 'UNAUTHORIZED') dispatch(logout());

      dispatch(hideLoader());
      return Promise.resolve(response);
    } catch (error) {
      dispatch(hideLoader());
      return Promise.reject(error);
    }
  };
};

export const deleteMultipleProducts = (ids) => {
  return async (dispatch) => {
    try {
      dispatch(showLoader());

      // Execute all delete operations in parallel
      const promises = ids.map(id =>
        apiDelete(`${urls.product.createProduct}/${id}`)
      );

      const results = await Promise.all(promises);

      // Get the last response which should contain the updated product list
      const lastResponse = results[results.length - 1];

      if (lastResponse?.allProducts) {
        dispatch(setProducts(lastResponse.allProducts));
        dispatch(hideLoader());
        return Promise.resolve(lastResponse);
      }

      if (results.some(response => response === 'UNAUTHORIZED')) {
        dispatch(logout());
      }

      dispatch(hideLoader());
      return Promise.resolve(lastResponse);
    } catch (error) {
      dispatch(hideLoader());
      return Promise.reject(error);
    }
  };
};

// Category actions
export const createCategory = (data) => {
  return async (dispatch) => {
    try {
      const response = await apiPost(urls.category.createCategory, data);
      if (response?.allCategories) {
        dispatch(setCategories(response?.allCategories));
        return Promise.resolve();
      }
      if (response === 'UNAUTHORIZED') dispatch(logout());

      return Promise.resolve(response);
    } catch (error) {
      return Promise.reject(error);
    }
  };
};

export const updateCategory = (id, data) => {
  return async (dispatch) => {
    try {
      const response = await apiPut(`${urls.category.createCategory}/${id}`, data);
      if (response?.allCategories) {
        dispatch(setCategories(response?.allCategories));
        return Promise.resolve(response);
      }

      if (response === 'UNAUTHORIZED') dispatch(logout());

      return Promise.resolve(response);
    } catch (error) {
      return Promise.reject(error);
    }
  };
};

export const deleteCategory = (id) => {
  return async (dispatch) => {
    try {
      dispatch(showLoader());
      const response = await apiDelete(`${urls.category.createCategory}/${id}`);

      if (response?.allCategories) {
        dispatch(setCategories(response?.allCategories));
        dispatch(hideLoader());
        return Promise.resolve(response);
      }

      if (response === 'UNAUTHORIZED') dispatch(logout());

      dispatch(hideLoader());
      return Promise.resolve(response);
    } catch (error) {
      dispatch(hideLoader());
      return Promise.reject(error);
    }
  };
};

export const deleteMultipleCategories = (ids) => {
  return async (dispatch) => {
    try {
      dispatch(showLoader());

      // Execute all delete operations in parallel
      const promises = ids.map(id =>
        apiDelete(`${urls.category.createCategory}/${id}`)
      );

      const results = await Promise.all(promises);

      // Get the last response which should contain the updated category list
      const lastResponse = results[results.length - 1];

      if (lastResponse?.allCategories) {
        dispatch(setCategories(lastResponse.allCategories));
        dispatch(hideLoader());
        return Promise.resolve(lastResponse);
      }

      if (results.some(response => response === 'UNAUTHORIZED')) {
        dispatch(logout());
      }

      dispatch(hideLoader());
      return Promise.resolve(lastResponse);
    } catch (error) {
      dispatch(hideLoader());
      return Promise.reject(error);
    }
  };
};

// User actions
export const getUserById = (id) => {
  return async (dispatch) => {
    try {
      const response = await apiGet(`${urls.user.getUserById}/${id}`);

      if (response?.users) {
        return response?.users[0];
      }

      if (response === 'UNAUTHORIZED') dispatch(logout());

      return Promise.resolve(response);
    } catch (error) {
      return Promise.reject(error);
    }
  };
};

export const loaderUsers = () => {
  return async (dispatch) => {
    try {
      const response = await apiGet(urls.user.getAllUsers);

      if (response === 'UNAUTHORIZED') return dispatch(logout());

      if (response) {
        dispatch(setUsers(response));
        return response;
      }

      return Promise.resolve(response);
    } catch (error) {
      return Promise.reject(error);
    }
  };
};

export const createUser = (data) => {
  return async (dispatch) => {
    try {
      const response = await apiPost(urls.user.createUser, data);
      if (response?.allUsers) {
        dispatch(setUsers(response?.allUsers));
        return Promise.resolve();
      }

      return Promise.resolve(response);
    } catch (error) {
      console.log('createUser error', error);

      // Check if it's a SyntaxError from trying to parse a non-JSON response
      if (error instanceof SyntaxError && error.message.includes('Unexpected token')) {
        // Extract the original error message from the SyntaxError message
        const match = error.message.match(/"([^"]+)"/);
        if (match && match[1]) {
          // Return the extracted message
          return Promise.resolve(match[1]);
        }
      }

      return Promise.resolve(error);
    }
  };
};

export const updateUser = (id, data) => {
  return async (dispatch) => {
    try {
      const response = await apiPut(`${urls.user.createUser}/${id}`, data);
      if (response === 'UNAUTHORIZED') return dispatch(logout());

      if (response?.allUsers) {
        return Promise.resolve(response);
      }

      return Promise.resolve(response);
    } catch (error) {
      return Promise.reject(error);
    }
  };
};

export const deleteUser = (id) => {
  return async (dispatch) => {
    try {
      dispatch(showLoader());
      const response = await apiDelete(`${urls.user.createUser}/${id}`);

      if (response === 'UNAUTHORIZED') return dispatch(logout());

      if (response?.allUsers) {
        dispatch(setUsers(response?.allUsers));
        dispatch(hideLoader());
        return Promise.resolve(response);
      }


      dispatch(hideLoader());
      return Promise.resolve(response);
    } catch (error) {
      dispatch(hideLoader());
      return Promise.reject(error);
    }
  };
};

export const deleteMultipleUsers = (ids) => {
  return async (dispatch) => {
    try {
      dispatch(showLoader());

      // Execute all delete operations in parallel
      const promises = ids.map(id =>
        apiDelete(`${urls.user.createUser}/${id}`)
      );

      const results = await Promise.all(promises);

      // Get the last response which should contain the updated user list
      const lastResponse = results[results.length - 1];

      if (lastResponse?.allUsers) {
        dispatch(setUsers(lastResponse.allUsers));
        dispatch(hideLoader());
        return Promise.resolve(lastResponse);
      }

      if (results.some(response => response === 'UNAUTHORIZED')) {
        dispatch(logout());
      }

      dispatch(hideLoader());
      return Promise.resolve(lastResponse);
    } catch (error) {
      dispatch(hideLoader());
      return Promise.reject(error);
    }
  };
};

// Table actions
export const getTableById = (id) => {
  return async (dispatch) => {
    try {
      const response = await apiGet(`${urls.table.getAllTables}/${id}`);

      if (response?.tables) {
        return response?.tables[0];
      }

      if (response === 'UNAUTHORIZED') dispatch(logout());

      return Promise.resolve(response);
    } catch (error) {
      return Promise.reject(error);
    }
  };
};

export const loaderTables = () => {
  return async (dispatch) => {
    try {
      const response = await apiGet(urls.table.getAllTables);

      if (response?.data) {
        dispatch(setTables(response?.data));
        return response?.data;
      }

      if (response === 'UNAUTHORIZED') dispatch(logout());

      return Promise.resolve(response?.data);
    } catch (error) {
      return Promise.reject(error);
    }
  };
};

export const createTable = (data) => {
  return async (dispatch) => {
    try {
      const response = await apiPost(urls.table.createTable, data);

      if (response?.error) return Promise.resolve(response);

      if (response?.data) {
        dispatch(setTables(response?.data));
        return Promise.resolve(response?.data);
      }
      if (response === 'UNAUTHORIZED') return dispatch(logout());

      return Promise.resolve(response?.data);
    } catch (error) {
      return Promise.reject(error);
    }
  };
};

export const updateTable = (id, data) => {
  return async (dispatch) => {
    try {
      const response = await apiPut(`${urls.table.createTable}/${id}`, data);
      console.log('response updateTable', response);
      if (response?.data) {
        dispatch(setTables(response?.data));
        return Promise.resolve(response?.data);
      }

      if (response === 'UNAUTHORIZED') dispatch(logout());

      return Promise.resolve(response?.data);
    } catch (error) {
      return Promise.reject(error);
    }
  };
};

export const deleteTable = (id) => {
  return async (dispatch) => {
    try {
      dispatch(showLoader());
      const response = await apiDelete(`${urls.table.createTable}/${id}`);

      if (response?.data) {
        dispatch(setTables(response?.data));
        dispatch(hideLoader());
        return Promise.resolve(response?.data);
      }

      if (response === 'UNAUTHORIZED') dispatch(logout());

      dispatch(hideLoader());
      return Promise.resolve(response?.data);
    } catch (error) {
      dispatch(hideLoader());
      return Promise.reject(error);
    }
  };
};

