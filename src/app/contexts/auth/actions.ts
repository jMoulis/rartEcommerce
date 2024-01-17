'use client';

import { UserProfile } from '@/src/types/DBTypes';
import { AuthActionTypes } from './enums';
import { SignInAction, UpdateProfileAction } from './types';

export const onSigninAction = (profile: UserProfile | null): SignInAction => ({
  type: AuthActionTypes.SIGN_IN,
  payload: profile
});

export const onUpdateProfileAction = (fields: Record<string, any>): UpdateProfileAction => {
  return ({
    type: AuthActionTypes.UPDATE_PROFILE,
    payload: fields
  });
};
