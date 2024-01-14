'use client';

import { useCallback, useContext } from 'react';
import { AuthReducer } from '../types';
import { AuthContext } from '../authContext';

export const useAuthSelector = (selector: (state: AuthReducer) => any) => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthSelector must be used within a AuthProvider');
  }
  const callback = useCallback((canvasState: AuthReducer) => {
    return selector(canvasState);
  }, [selector]);

  return callback(context.state);
};
