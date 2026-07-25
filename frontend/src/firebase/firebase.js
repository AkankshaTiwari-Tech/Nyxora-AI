import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAXi3hhEZSFZ-ZlZ7tAZZGuuxYAOMdJR3c",
  authDomain: "nyxora-ai-cd4cd.firebaseapp.com",
  projectId: "nyxora-ai-cd4cd",
  storageBucket: "nyxora-ai-cd4cd.firebasestorage.app",
  messagingSenderId: "179944684725",
  appId: "1:179944684725:web:ea541799510aea699712fc",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export default app;