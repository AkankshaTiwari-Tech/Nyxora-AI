import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  setDoc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

import { db, auth } from "../firebase/firebase";

function chatsCollection() {
  const uid = auth.currentUser?.uid;

  if (!uid) {
    throw new Error("User not authenticated.");
  }

  return collection(db, "users", uid, "chats");
}

export async function createChat(title = "New Chat") {
  const ref = await addDoc(chatsCollection(), {
    title,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return ref.id;
}

export async function getChats() {
  const q = query(
    chatsCollection(),
    orderBy("updatedAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  }));
}

export async function saveMessages(chatId, messages) {
  const uid = auth.currentUser.uid;

  await setDoc(
    doc(db, "users", uid, "chats", chatId),
    {
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );

  await setDoc(
    doc(
      db,
      "users",
      uid,
      "chats",
      chatId,
      "data",
      "messages"
    ),
    {
      messages,
    }
  );
}

export async function loadMessages(chatId) {
  const uid = auth.currentUser.uid;

  const snapshot = await getDoc(
    doc(
      db,
      "users",
      uid,
      "chats",
      chatId,
      "data",
      "messages"
    )
  );

  if (!snapshot.exists()) {
    return [];
  }

  return snapshot.data().messages || [];
}

export async function renameChat(chatId, title) {
  const uid = auth.currentUser.uid;

  await updateDoc(
    doc(db, "users", uid, "chats", chatId),
    {
      title,
      updatedAt: serverTimestamp(),
    }
  );
}

export async function updateChatTitle(chatId, title) {
  const uid = auth.currentUser.uid;

  await updateDoc(
    doc(db, "users", uid, "chats", chatId),
    {
      title,
      updatedAt: serverTimestamp(),
    }
  );
}

export async function deleteChat(chatId) {
  const uid = auth.currentUser.uid;

  await deleteDoc(
    doc(db, "users", uid, "chats", chatId)
  );
}