import { combineReducers } from 'redux';
import channel_reducer from './channel';
import user_reducer from './user';

const rootReducer = combineReducers({
    /* All reducers here */
    user_reducer: user_reducer,
    channel_reducer: channel_reducer
});

export default rootReducer;