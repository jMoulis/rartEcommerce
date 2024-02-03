'use client';

import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged as _onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, User, type UserCredential, NextOrObserver, Unsubscribe, sendPasswordResetEmail, reauthenticateWithCredential, signOut, verifyBeforeUpdateEmail, EmailAuthProvider, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useTranslations } from 'next-intl';
import { ENUM_AUTH_ROUTES } from './routesEnum';
import { APIResponse } from '@/src/types/types';
import { db, rootAuth } from '@/src/lib/firebase/firebase';
import { ENUM_COLLECTIONS } from '@/src/lib/firebase/enums';
import { ApiPayload } from '../../shared/types';
import { useFirebaseStorage } from '../../storage/useFirebaseStorage';
import { onErrorMessage, onSuccessMessage } from '../../shared/response';
import { useAuthDispatch } from './useAuthDispatch';
import { onSigninAction } from '../actions';
import { useAuthSelector } from './useAuthSelector';
import { ENUM_ROLES } from '../enums';
import { useState } from 'react';
import { IEmailVerif } from '@/src/app/[locale]/api/auth/send-email-auth/types';

interface SignEmailPasswordType {
  email: string
  password: string
}
interface RegisterProps {
  email: string
  password: string
}

export const useAuth = () => {
  const t = useTranslations();
  const { onAddFile } = useFirebaseStorage();
  const [loading, setLoading] = useState(false);

  const onAuthStateChanged = (cb: NextOrObserver<User>): Unsubscribe => {
    return _onAuthStateChanged(rootAuth, cb);
  };
  const authDispatch = useAuthDispatch();
  const isAdmin = useAuthSelector((state) => state.profile?.roles?.includes(ENUM_ROLES.ADMIN));

  const defaultResponseHeaders = (customHeaders: Record<string, any> = {}): Record<string, any> => ({
    'Content-Type': 'application/json',
    ...customHeaders
  });

  const onUpdateUser = async (user: User) => {
    try {
      const userRef = doc(db, ENUM_COLLECTIONS.PROFILES, user.uid);

      const userProfile = {
        email: user.email,
        avatar: user.photoURL,
        createdAt: new Date(),
        lastConnexion: new Date()
      };

      await setDoc(userRef, userProfile, { merge: true });
      return onSuccessMessage('update-user-profile', t);
    } catch (error: any) {
      return onErrorMessage(error, t);
    }
  };

  const userCheckApiPayload = (): ApiPayload => {
    return onErrorMessage({
      code: 'auth/user-not-found',
    }, t);
  };

  const buildSetSessionCookieResponse = (response: Response, resBody: APIResponse<string>): ApiPayload => {
    if (response.ok && resBody.success) {
      return onSuccessMessage('setSessionCookie', t);
    }
    return onErrorMessage({ code: 'setSessionCookie' }, t);
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
      await onUpdateUser(userCredentials.user);
      const responsePayload = await onSucessSetSessionCookie(userCredentials);
      return onSuccessMessage(responsePayload.code, userCredentials);
    } catch (error: any) {
      return onErrorMessage(error, t);
    }
  };

  const signInWithEmailPassword = async ({ email, password }: SignEmailPasswordType): Promise<ApiPayload> => {
    try {
      const userCredentials = await signInWithEmailAndPassword(rootAuth, email, password);
      await onUpdateUser(userCredentials.user);
      const responsePayload = await onSucessSetSessionCookie(userCredentials);
      return onSuccessMessage(responsePayload.code, userCredentials);
    } catch (error: any) {
      return onErrorMessage(error, t);
    }
  };
  const onRegister = async ({ email, password }: RegisterProps): Promise<ApiPayload> => {
    try {
      const userCredentials = await createUserWithEmailAndPassword(rootAuth, email, password);
      await onUpdateUser(userCredentials.user);
      const mailSystem = process.env.NEXT_PUBLIC_MAIL_SYSTEM!;
      const emailVerifPayload: IEmailVerif = {
        email,
        userId: userCredentials.user.uid,
        companyName: 'RartCreation',
        contactName: 'Rachel',
        mailSystem,
        subject: t('Contact.subject', {
          company: 'RartCreation',
        }),
      };
      const payload = {
        method: 'POST',
        body: JSON.stringify(emailVerifPayload),
        headers: {
          'Content-Type': 'application/json',
        },
      };
      await fetch('/api/auth/send-email-auth', payload);
      const responsePayload = await onSucessSetSessionCookie(userCredentials);
      return onSuccessMessage(responsePayload.code, userCredentials);
    } catch (error: any) {
      return onErrorMessage(error, t);
    }
  };

  const onSignOut = async () => {
    try {
      setLoading(true);
      await signOut(rootAuth);
      const response = await fetch(ENUM_AUTH_ROUTES.SIGN_OUT, {
        headers: defaultResponseHeaders()
      });
      const resBody = (await response.json()) as unknown as APIResponse<string>;
      authDispatch(onSigninAction(null));
      setLoading(false);
      return buildSetSessionCookieResponse(response, resBody);
    } catch (error: any) {
      setLoading(false);
      return onErrorMessage(error, t);
    }
  };

  const resetPasswordEmail = async (email: string): Promise<ApiPayload> => {
    try {
      await sendPasswordResetEmail(rootAuth, email);
      return onSuccessMessage('reset-email', t);
    } catch (error) {
      return onErrorMessage(error, t);
    }
  };

  const onUpdateEmail = async (email: string): Promise<ApiPayload> => {
    if (!rootAuth?.currentUser) {
      return userCheckApiPayload();
    }
    try {
      await verifyBeforeUpdateEmail(rootAuth.currentUser, email);
      return onSuccessMessage('auth/email-sent', t);
    } catch (error) {
      return onErrorMessage(error, t);
    }
  };

  const onReauthenticateWithCredential = async (userCredential: { email: string, password: string }) => {
    try {
      const user = rootAuth.currentUser;

      if (!user) {
        const message = t('ApiErrors.auth/user-not-found');
        return {
          status: false,
          error: message,
          code: 'auth/user-not-found'
        };
      }
      const credential = EmailAuthProvider.credential(userCredential.email, userCredential.password);
      const newCredential = await reauthenticateWithCredential(user, credential);
      return onSuccessMessage('auth/reauth', t, newCredential);
    } catch (error) {
      return onErrorMessage(error, t);
    }
  };

  const onPromptForCredentials = async (userCredential: { email: string, password: string }): Promise<ApiPayload> => {
    try {
      const user = rootAuth.currentUser;

      if (!user) {
        const message = t('ApiErrors.auth/user-not-found');
        return onErrorMessage({
          error: message,
          code: 'auth/user-not-found'
        }, t);
      }
      const credential = EmailAuthProvider.credential(userCredential.email, userCredential.password);
      const newCredential = await reauthenticateWithCredential(user, credential);
      return onSuccessMessage('auth/reauthenticated', newCredential, t);
    } catch (error) {
      return onErrorMessage(error, t);
    }
  };

  const onUpdateUserAvatar = async (file: File): Promise<ApiPayload> => {
    if (!rootAuth?.currentUser) {
      return userCheckApiPayload();
    }
    // profiles/userId
    const filePath = `${ENUM_COLLECTIONS.PROFILES}/${rootAuth.currentUser.uid}/`;
    try {
      const downloadURL = await onAddFile(file, filePath, 'avatar');

      if (downloadURL) {
        await updateProfile(rootAuth.currentUser, { photoURL: downloadURL });
        const userRef = doc(db, ENUM_COLLECTIONS.PROFILES, rootAuth?.currentUser.uid);

        const userProfile = {
          avatar: downloadURL
        };
        await setDoc(userRef, userProfile, { merge: true });
        return onSuccessMessage('update-avatar', t, userProfile);
      }
      return onErrorMessage({
        code: 'update-avatar'
      }, t);
    } catch (error) {
      return onErrorMessage(error, t);
    }
  };

  return {
    onAuthStateChanged,
    onSignOut,
    onRegister,
    signInWithEmailPassword,
    signInWithGoogle,
    resetPasswordEmail,
    onUpdateEmail,
    onReauthenticateWithCredential,
    onPromptForCredentials,
    onUpdateUserAvatar,
    isAdmin,
    loading,
  };
};
