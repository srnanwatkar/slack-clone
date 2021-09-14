import { SET_CHANNEL_ID, SET_PRIVATE_CHANNEL } from "../actions/types";

const initialState = {
    currentChannel: { id: null, name: null },
    isPrivateChannel: false
}

const channel_reducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_CHANNEL_ID:
            return {
                ...state,
                currentChannel: action.payload
            }
        case SET_PRIVATE_CHANNEL:
            return {
                ...state,
                isPrivateChannel: action.payload
            }
        default:
            return state;
    }
}

export default channel_reducer;