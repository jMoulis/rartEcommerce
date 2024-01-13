import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged as _onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, User, type UserCredential, NextOrObserver, Unsubscribe, sendPasswordResetEmail } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

import { useTranslations } from 'next-intl';
import { ENUM_AUTH_ROUTES } from './routesEnum';
import { APIResponse } from '@/src/types/types';
import { db, rootAuth } from '@/src/lib/firebase/firebase';
import { ENUM_COLLECTIONS } from '@/src/lib/firebase/enums';

interface SignEmailPasswordType {
  email: string
  password: string
}
interface RegisterProps {
  email: string
  password: string
};
interface ApiPayload {
  status: boolean;
  code: string;
  error: string | null;
};
export const useAuth = () => {
  const t = useTranslations();

  const onAuthStateChanged = (cb: NextOrObserver<User>): Unsubscribe => {
    return _onAuthStateChanged(rootAuth, cb);
  };

  const defaultResponseHeaders = (customHeaders: Record<string, any> = {}): Record<string, any> => ({
    'Content-Type': 'application/json',
    ...customHeaders

  });

  const updateUserProfile = async (userCredentials: UserCredential) => {
    try {
      const { user } = userCredentials;
      const userRef = doc(db, ENUM_COLLECTIONS.PROFILES, user.uid);

      const userProfile = {
        email: user.email,
        avatar: user.photoURL,
        createdAt: serverTimestamp(),
        lastConnexion: serverTimestamp()
      };

      await setDoc(userRef, userProfile, { merge: true });

      return {
        error: null,
        status: true
      };
    } catch (error: any) {
      return {
        error: error.message,
        status: false
      };
    }
  };

  const buildSetSessionCookieResponse = (response: Response, resBody: APIResponse<string>): ApiPayload => {
    if (response.ok && resBody.success) {
      return { status: true, error: null, code: 'setSessionCookie' };
    }
    return {
      error: t('ApiErrors.setSessionCookie'),
      status: false,
      code: 'setSessionCookie'
    };
  };

  const setErrorMessage = (error: any): ApiPayload => {
    const errorObject = JSON.parse(JSON.stringify(error));
    const code: string = errorObject?.code || 'unknown';
    const message = t(`ApiErrors.${code}` as any);
    return {
      error: error.message,
      status: false,
      code: message
    };
  };

  const onSucessSetSessionCookie = async (userCredentials: UserCredential) => {
    const idToken = await userCredentials.user.getIdToken();
    const payload = {
      method: 'POST',
      headers: defaultResponseHeaders(),
      body: JSON.stringify({ idToken })
    };
    const response = await fetch(ENUM_AUTH_ROUTES.SIGN_IN, payload);
    const resBody = (await response.json()) as unknown as APIResponse<string>;
    return buildSetSessionCookieResponse(response, resBody);
  };

  const signInWithGoogle = async (): Promise<ApiPayload> => {
    const provider = new GoogleAuthProvider();
    try {
      const userCredentials = await signInWithPopup(rootAuth, provider);
      await updateUserProfile(userCredentials);
      const responsePayload = await onSucessSetSessionCookie(userCredentials);
      return responsePayload;
    } catch (error: any) {
      return setErrorMessage(error);
    }
  };

  const signInWithEmailPassword = async ({ email, password }: SignEmailPasswordType): Promise<ApiPayload> => {
    try {
      const userCredentials = await signInWithEmailAndPassword(rootAuth, email, password);
      await updateUserProfile(userCredentials);
      const responsePayload = await onSucessSetSessionCookie(userCredentials);
      return responsePayload;
    } catch (error: any) {
      return setErrorMessage(error);
    }
  };

  const register = async ({ email, password }: RegisterProps): Promise<ApiPayload> => {
    try {
      const userCredentials = await createUserWithEmailAndPassword(rootAuth, email, password);
      await updateUserProfile(userCredentials);
      const responsePayload = await onSucessSetSessionCookie(userCredentials);
      return responsePayload;
    } catch (error: any) {
      return setErrorMessage(error);
    }
  };

  const signOut = async () => {
    try {
      await rootAuth.signOut();
      const response = await fetch(ENUM_AUTH_ROUTES.SIGN_OUT, {
        headers: defaultResponseHeaders()
      });
      const resBody = (await response.json()) as unknown as APIResponse<string>;
      return buildSetSessionCookieResponse(response, resBody);
    } catch (error: any) {
      return setErrorMessage(error);
    }
  };

  const resetPasswordEmail = async (email: string): Promise<ApiPayload> => {
    try {
      await sendPasswordResetEmail(rootAuth, email);
      return {
        status: true,
        error: null,
        code: 'reset-email'
      };
    } catch (error) {
      return setErrorMessage(error);
    }
  };

  return {
    onAuthStateChanged,
    signOut,
    register,
    signInWithEmailPassword,
    signInWithGoogle,
    resetPasswordEmail
  };
};
