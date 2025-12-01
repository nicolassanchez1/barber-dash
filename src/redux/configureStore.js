// Libraries //
import storage from 'redux-persist/lib/storage';
import { thunk } from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import { composeWithDevTools } from '@redux-devtools/extension';
// Root //
import { rootReducer } from './rootReducer';

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['session', 'utils', 'products'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(persistedReducer, composeWithDevTools(applyMiddleware(thunk)));

const persistor = persistStore(store);

export { store, persistor };

export const dispatch = store.dispatch;
export const getState = store.getState;
