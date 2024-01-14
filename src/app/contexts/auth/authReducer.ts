'use client';

import { AuthActionTypes } from './enums';
import { AuthActions, AuthReducer } from './types';

export const authReducer = (state: AuthReducer, action: AuthActions): AuthReducer => {
  switch (action.type) {
    case AuthActionTypes.SIGN_IN: {
      const profile = action.payload;
      return {
        ...state,
        profile,
      };
    }
    case AuthActionTypes.UPDATE_PROFILE: {
      const fields = action.payload;
      console.log(state.profile);
      if (!state.profile) return state;
      return {
        ...state,
        profile: {
          ...state.profile,
          ...fields
        },
      };
    }
    default:
      return state;
  }
};
