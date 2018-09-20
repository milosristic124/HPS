import Types from './actionTypes';

export const setNavigation = navigation => 
  (
    {
      type: Types.NAVIGATION_SAVED,
      payload: {
        navigation: navigation
      }
    }
  );

export const setUser = user => 
(
  {
    type: Types.USER_LOGGED_IN,
    payload: {
      user: user
    }
  }
);
