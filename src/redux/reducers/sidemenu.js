

import { createReducer } from 'reduxsauce';
import Types from '../actions/actionTypes';

export const initialState = {
  index: 0,
  navigation: null
};

export const setNavigation = (state = initialState, action) => ({
  ...state,
  navigation: action.payload.navigation
});

export const setUser = (state = initialState, action) => ({
  ...state,
  user: action.payload.user
});

export const actionHandlers = {
  [Types.NAVIGATION_SAVED]: setNavigation,
  [Types.USER_LOGGED_IN]: setUser
};

export default createReducer(initialState, actionHandlers);
