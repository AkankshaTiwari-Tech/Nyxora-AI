import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db, auth } from "../firebase/firebase";


function memoryRef() {

  const uid =
    auth.currentUser?.uid;


  if (!uid) {

    throw new Error(
      "User not authenticated."
    );

  }


  return doc(
    db,
    "users",
    uid,
    "settings",
    "aiMemory"
  );

}



export async function getMemory() {

  const snapshot =
    await getDoc(
      memoryRef()
    );


  if (!snapshot.exists()) {

    return null;

  }


  return snapshot.data();

}




export async function saveMemory(memoryData) {


  await setDoc(

    memoryRef(),

    {

      ...memoryData,

      updatedAt:
        serverTimestamp(),

    },

    {
      merge:true,
    }

  );

}




export async function updateMemory(memoryData) {


  await updateDoc(

    memoryRef(),

    {

      ...memoryData,

      updatedAt:
        serverTimestamp(),

    }

  );

}




export async function clearMemory() {


  await deleteDoc(

    memoryRef()

  );

}