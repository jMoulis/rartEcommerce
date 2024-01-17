'use client';

import { useCallback, useContext } from 'react';
import { AuthActions } from '../types';
import { AuthContext } from '../AuthContext';

export const useAuthDispatch = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthDispatch must be used within a AuthProvider');
  }
  const dispatch = useCallback((params: AuthActions) => {
    return context.dispatch(params);
  }, [context]);

  return dispatch;
};
