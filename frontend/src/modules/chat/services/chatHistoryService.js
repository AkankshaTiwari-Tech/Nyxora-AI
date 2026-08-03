import {
  collection,
  doc,
  addDoc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";

import {
  db,
  auth,
} from "../../../firebase/firebase";


// ======================================================
// CHATS COLLECTION
// ======================================================

function chatsCollection() {

  const uid =
    auth.currentUser?.uid;


  if (!uid) {

    throw new Error(
      "User not authenticated"
    );

  }


  return collection(

    db,

    "users",

    uid,

    "chats"

  );

}


// ======================================================
// CHAT DOCUMENT REFERENCE
// ======================================================

function chatDocRef(
  chatId
) {

  const uid =
    auth.currentUser?.uid;


  if (!uid) {

    throw new Error(
      "User not authenticated"
    );

  }


  return doc(

    db,

    "users",

    uid,

    "chats",

    chatId

  );

}


// ======================================================
// MESSAGES DOCUMENT REFERENCE
// ======================================================

function messagesRef(
  chatId
) {

  const uid =
    auth.currentUser?.uid;


  if (!uid) {

    throw new Error(
      "User not authenticated"
    );

  }


  return doc(

    db,

    "users",

    uid,

    "chats",

    chatId,

    "data",

    "messages"

  );

}


// ======================================================
// CREATE CHAT
// ======================================================

export async function createChat(
  title = "New Chat"
) {

  const ref =
    await addDoc(

      chatsCollection(),

      {

        title,

        createdAt:
          serverTimestamp(),

        updatedAt:
          serverTimestamp(),

      }

    );


  return ref.id;

}


// ======================================================
// GET CHATS
// ======================================================

export async function getChats() {

  const q =
    query(

      chatsCollection(),

      orderBy(
        "updatedAt",
        "desc"
      )

    );


  const snapshot =
    await getDocs(q);


  const chats = [];


  for (
    const chatDocument of
    snapshot.docs
  ) {

    const data =
      chatDocument.data();


    const messagesSnapshot =
      await getDoc(

        messagesRef(
          chatDocument.id
        )

      );


    chats.push({

      id:
        chatDocument.id,

      title:
        data.title ||
        "New Chat",

      messages:

        messagesSnapshot.exists()

          ? (
              messagesSnapshot
                .data()
                .messages ||
              []
            )

          : [],

    });

  }


  return chats;

}


// ======================================================
// SUBSCRIBE TO CHATS
// ======================================================

export function subscribeToChats(
  callback
) {

  const q =
    query(

      chatsCollection(),

      orderBy(
        "updatedAt",
        "desc"
      )

    );


  return onSnapshot(

    q,

    (snapshot) => {

      const chats =

        snapshot.docs.map(

          (
            chatDocument
          ) => ({

            id:
              chatDocument.id,

            title:
              chatDocument
                .data()
                .title ||
              "New Chat",

            messages: [],

          })

        );


      console.log(
        "Realtime chats received:",
        chats
      );


      callback(
        chats
      );

    },


    (error) => {

      console.error(

        "Chat realtime error:",

        error

      );

    }

  );

}


// ======================================================
// SUBSCRIBE TO MESSAGES
// ======================================================

export function subscribeToMessages(
  chatId,
  callback
) {

  console.log(

    "Listening messages:",

    chatId

  );


  return onSnapshot(

    messagesRef(
      chatId
    ),

    (snapshot) => {

      console.log(

        "Realtime message snapshot:",

        snapshot.exists()

      );


      if (
        snapshot.exists()
      ) {

        const messages =

          snapshot
            .data()
            .messages ||
          [];


        console.log(

          "Realtime messages received:",

          messages

        );


        callback(
          messages
        );

      } else {

        callback(
          []
        );

      }

    },


    (error) => {

      console.error(

        "Message realtime error:",

        error

      );

    }

  );

}


// ======================================================
// SAVE MESSAGES
// ======================================================

export async function saveMessages(
  chatId,
  messages
) {

  await setDoc(

    messagesRef(
      chatId
    ),

    {

      messages,

    }

  );


  await updateDoc(

    chatDocRef(
      chatId
    ),

    {

      updatedAt:
        serverTimestamp(),

    }

  );

}


// ======================================================
// CLEAR CHAT MESSAGES
// ======================================================

export async function clearChatMessages(
  chatId
) {

  if (!chatId) {

    throw new Error(
      "Chat ID is required."
    );

  }


  await setDoc(

    messagesRef(
      chatId
    ),

    {

      messages: [],

    }

  );


  await updateDoc(

    chatDocRef(
      chatId
    ),

    {

      updatedAt:
        serverTimestamp(),

    }

  );


  console.log(
    "🧹 Conversation cleared:",
    chatId
  );

}


// ======================================================
// UPDATE CHAT TITLE
// ======================================================

export async function updateChatTitle(
  chatId,
  title
) {

  await updateDoc(

    chatDocRef(
      chatId
    ),

    {

      title,

      updatedAt:
        serverTimestamp(),

    }

  );

}


// ======================================================
// DELETE CHAT
//
// Firestore does NOT automatically delete nested
// documents when their parent document is deleted.
//
// Nyxora stores messages here:
//
// users/{uid}/chats/{chatId}/data/messages
//
// Therefore the messages document is deleted first,
// followed by the parent chat document.
// ======================================================

export async function deleteChat(
  chatId
) {

  if (!chatId) {

    throw new Error(
      "Chat ID is required."
    );

  }


  // ====================================================
  // STEP 1 — DELETE MESSAGE DATA
  // ====================================================

  await deleteDoc(

    messagesRef(
      chatId
    )

  );


  // ====================================================
  // STEP 2 — DELETE PARENT CHAT
  // ====================================================

  await deleteDoc(

    chatDocRef(
      chatId
    )

  );


  console.log(
    "🗑️ Chat and message data deleted:",
    chatId
  );

}