import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged as _onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { APIResponse } from "@/src/types/types";
import { rootAuth } from "./firebase";

export function onAuthStateChanged(cb: any) {
  return _onAuthStateChanged(rootAuth, cb);
}

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();

  try {
    const userCreds = await signInWithPopup(rootAuth, provider);
    const idToken = await userCreds.user.getIdToken();

    const response = await fetch("/api/auth/sign-in", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idToken }),
    });
    const resBody = (await response.json()) as unknown as APIResponse<string>;
    if (response.ok && resBody.success) {
      return true;
    } else return false;
  } catch (error) {
    console.error("Error signing in with Google", error);
    return false;
  }
}


type SignEmailPasswordType = {
  email: string;
  password: string;
}
export async function signInWithEmailPassword({ email, password }: SignEmailPasswordType) {
  const provider = new GoogleAuthProvider();

  try {
    const userCreds = await signInWithEmailAndPassword(rootAuth, email, password);
    const idToken = await userCreds.user.getIdToken();

    const response = await fetch("/api/auth/sign-in", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idToken }),
    });
    const resBody = (await response.json()) as unknown as APIResponse<string>;
    if (response.ok && resBody.success) {
      return { status: true, error: null };
    } else return {
      error: 'Unknown',
      status: false
    };
  } catch (error: any) {
    return {
      error: error.message,
      status: false
    };
  }
}

type RegisterProps = {
  email: string;
  password: string;
}
export async function register({ email, password }: RegisterProps) {
  const provider = new GoogleAuthProvider();

  try {
    const userCredentials = await createUserWithEmailAndPassword(rootAuth, email, password)
    const idToken = await userCredentials.user.getIdToken();

    const response = await fetch("/api/auth/sign-in", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idToken }),
    });
    const resBody = (await response.json()) as unknown as APIResponse<string>;
    if (response.ok && resBody.success) {
      return { status: true, error: null };
    } else return {
      error: 'Unknown',
      status: false
    };
  } catch (error: any) {
    return {
      error: error.message,
      status: false
    };
  }
}

export async function signOut() {
  try {
    await rootAuth.signOut();

    const response = await fetch("/api/auth/sign-out", {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const resBody = (await response.json()) as unknown as APIResponse<string>;
    if (response.ok && resBody.success) {
      return { status: true, error: null };
    } else return {
      error: 'Unknown',
      status: false
    };
  } catch (error: any) {
    return {
      error: error.message,
      status: false
    };
  }
}