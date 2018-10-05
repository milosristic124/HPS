import { createReducer } from 'reduxsauce';
import Types from '../actions/actionTypes';

export const initialState = {
  SET_SCROLL_TOP_FLAG : false
};

export const setScrollFlag = (state = initialState, action) => ({
  ...state,
  SET_SCROLL_TOP_FLAG : !state.SET_SCROLL_TOP_FLAG
});


export const actionHandlers = {
  [Types.SET_SCROLL_TOP_ACTION_FLAG]: setScrollFlag,
};

export default createReducer(initialState, actionHandlers);
