// Root //
import { SET_CATEGORIES, SET_PRODUCTS, SET_TABLES } from './types';

const initialState = {
    products: [{}],
    categories: [{}],
    tables: [{}],
};

export const reducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_PRODUCTS:
           return  {
            ...state,
              products: action.payload?.products
            };
        case SET_CATEGORIES:
            return {
                ...state,
                categories: action.payload?.categories,
            };
        case SET_TABLES:
            return {
                ...state,
                tables: action.payload?.tables,
            };
        default:
            return state;
    }
};
