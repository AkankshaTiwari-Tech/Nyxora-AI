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
} from "firebase/firestore";

import { db, auth } from "../../../firebase/firebase";



function chatsRef() {

  const uid =
    auth.currentUser?.uid;


  if(!uid){

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




export async function createChat(
  title = "New Chat"
){

  const ref =
    await addDoc(

      chatsRef(),

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





export async function getChats(){


  const q =
    query(

      chatsRef(),

      orderBy(
        "updatedAt",
        "desc"
      )

    );



  const snapshot =
    await getDocs(q);



  const chats = [];



  for(
    const chatDoc of snapshot.docs
  ){


    const data =
      chatDoc.data();



    const messagesDoc =
      await getDoc(

        doc(

          db,

          "users",

          auth.currentUser.uid,

          "chats",

          chatDoc.id,

          "data",

          "messages"

        )

      );



    chats.push({

      id:
        chatDoc.id,


      title:
        data.title,


      messages:
        messagesDoc.exists()
          ? messagesDoc.data().messages
          : [],


    });


  }



  return chats;

}





export async function saveMessages(
  chatId,
  messages
){


  const uid =
    auth.currentUser.uid;



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



  await updateDoc(

    doc(

      db,

      "users",

      uid,

      "chats",

      chatId

    ),

    {

      updatedAt:
        serverTimestamp(),

    }

  );


}





export async function updateChatTitle(
  chatId,
  title
){


  const uid =
    auth.currentUser.uid;



  await updateDoc(

    doc(

      db,

      "users",

      uid,

      "chats",

      chatId

    ),

    {

      title,

      updatedAt:
        serverTimestamp(),

    }

  );

}





export async function deleteChat(
  chatId
){


  const uid =
    auth.currentUser.uid;



  await deleteDoc(

    doc(

      db,

      "users",

      uid,

      "chats",

      chatId

    )

  );

}