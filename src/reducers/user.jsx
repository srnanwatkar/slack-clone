import { CLEAR_USER, LOADER_STATE, SET_USER, SET_CHANNEL_ID } from "../actions/types";

const initialState = {
    currentUser: null,
    currentChannel: { id: null, name: null },
    isLoading: true
}

const user_reducer = (state = initialState, action) => {
    switch (action.type) {
        case LOADER_STATE:
            return {
                ...state,
                isLoading: action.payload
            }
        case SET_USER:
            return {
                ...state,
                currentUser: {
                    displayName: action.payload.displayName,
                    email: action.payload.email,
                    avatar: action.payload.avatar,
                    id: action.payload.id,
                },
                isLoading: false
            }
        case CLEAR_USER:
            return {
                ...initialState,
                currentUser: null,
                isLoading: false
            }
        case SET_CHANNEL_ID:
            return {
                ...state,
                currentChannel: action.payload
            }
        default:
            return state;
    }
}

export default user_reducer;