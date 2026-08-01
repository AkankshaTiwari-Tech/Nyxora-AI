import { db } from "../config/firebase.js";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";


export async function saveMemory(
  userId,
  memoryData
) {

  if(!userId || !memoryData)
    return;


  const memoryRef =
    doc(
      db,
      "users",
      userId,
      "settings",
      "aiMemory"
    );


  const existing =
    await getDoc(memoryRef);



  if(existing.exists()) {


    await updateDoc(
      memoryRef,
      {
        ...memoryData,
        updatedAt:
          serverTimestamp(),
      }
    );


  } else {


    await setDoc(
      memoryRef,
      {
        ...memoryData,
        createdAt:
          serverTimestamp(),

        updatedAt:
          serverTimestamp(),
      }
    );


  }

}



export async function getMemory(
  userId
) {

  if(!userId)
    return null;


  const memoryRef =
    doc(
      db,
      "users",
      userId,
      "settings",
      "aiMemory"
    );


  const snapshot =
    await getDoc(memoryRef);



  if(!snapshot.exists())
    return null;



  return snapshot.data();

}