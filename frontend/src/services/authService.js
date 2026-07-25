import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

import { auth } from "../firebase/firebase";

const googleProvider = new GoogleAuthProvider();

export async function registerUser(email, password) {
  console.log("========== REGISTER DEBUG ==========");
  console.log("PROJECT ID:", auth.app.options.projectId);
  console.log("EMAIL:", email);

  return createUserWithEmailAndPassword(auth, email, password);
}

export async function loginUser(email, password) {
  console.log("========== LOGIN AUTH DEBUG ==========");
  console.log("PROJECT ID:", auth.app.options.projectId);
  console.log("AUTH DOMAIN:", auth.app.options.authDomain);
  console.log("EMAIL:", email);
  console.log("PASSWORD LENGTH:", password.length);
  console.log("AUTH OBJECT:", auth);

  return signInWithEmailAndPassword(auth, email, password);
}

export async function loginWithGoogle() {
  console.log("========== GOOGLE LOGIN DEBUG ==========");
  console.log("PROJECT ID:", auth.app.options.projectId);

  return signInWithPopup(auth, googleProvider);
}

export async function logoutUser() {
  return signOut(auth);
}