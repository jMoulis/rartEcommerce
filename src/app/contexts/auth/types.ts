import { UserProfile } from '@/src/types/DBTypes';
import { AuthActionTypes } from './enums';

export interface AuthReducer {
  profile: UserProfile | null;
}

export interface SignInAction {
  type: typeof AuthActionTypes.SIGN_IN;
  payload: UserProfile | null;
}
export interface UpdateProfileAction {
  type: typeof AuthActionTypes.UPDATE_PROFILE;
  payload: Record<string, any>;
}

export type AuthActions = SignInAction | UpdateProfileAction;
