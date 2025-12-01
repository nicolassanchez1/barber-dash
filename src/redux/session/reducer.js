// Root //
import { LOGIN, LOGOUT, REGISTER } from './types';

const initialState = {
    recaptchaToken: '',
    user: {
        id: '',
        username: '',
        email: '',
        image: null,
        disabled: false,
        rol: '',
        phone: '',
        token: '',
    },
    error: '',
};
export const reducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN:
            return {
                ...state,
                recaptchaToken: action.payload.recaptchaToken,
                user: action.payload.user,
                error: '',
            };
        case LOGOUT:
            return initialState;
        case REGISTER:
            return {
                ...state,
                user: action.payload.user,
                error: '',
            };
        default:
            return state;
    }
};
