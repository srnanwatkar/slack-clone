import { combineReducers } from 'redux';
import * as actionTypes from './../actions/types';
import user_reducer from './user';

const rootReducer = combineReducers({
    /* All reducers here */
    user_reducer: user_reducer
});

export default rootReducer;