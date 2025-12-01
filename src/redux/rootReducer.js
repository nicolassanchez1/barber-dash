// Libraries //
import { combineReducers } from 'redux';
// Reducers //
import { reducer as sessionReducer } from './session/reducer';
import { reducer as loaderReducer } from './loader/reducer';
import { reducer as utilsReducer } from './utils/reducer';

export const rootReducer = combineReducers({
    session: sessionReducer,
    loader: loaderReducer,
    utils: utilsReducer,
});
