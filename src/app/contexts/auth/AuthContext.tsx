'use client';

import { createContext, useReducer } from 'react';
import { AuthReducer, AuthActions } from './types';
import { authReducer } from './authReducer';

const initialState: AuthReducer = {
  profile: null,
};
const defaultCanvasContext: {
  state: AuthReducer;
  dispatch: React.Dispatch<AuthActions>;
} = {
  state: initialState,
  dispatch: () => {},
};

export const AuthContext = createContext(defaultCanvasContext);

interface Props {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: Props) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
