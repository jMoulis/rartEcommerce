import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged as _onAuthStateChanged, createUserWithEmailAndPassword } from "firebase/auth";
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

export async function register({ email, password }: { email: string, password: string }) {
  try {
    const userCredential = await createUserWithEmailAndPassword(rootAuth, email, password);
    const idToken = userCredential.user.getIdToken();

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
    console.error("Error creating in with Google", error);
    return false;
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
      return true;
    } else return false;
  } catch (error) {
    console.error("Error signing out with Google", error);
    return false;
  }
}