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




function chatsCollection() {


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







function chatDocRef(chatId){


  return doc(

    db,

    "users",

    auth.currentUser.uid,

    "chats",

    chatId

  );

}







function messagesRef(chatId){


  return doc(

    db,

    "users",

    auth.currentUser.uid,

    "chats",

    chatId,

    "data",

    "messages"

  );

}








export async function createChat(
  title="New Chat"
){


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









export async function getChats(){


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



  for(
    const chatDoc of snapshot.docs
  ){


    const data =
      chatDoc.data();



    const messagesSnapshot =
      await getDoc(

        messagesRef(
          chatDoc.id
        )

      );



    chats.push({

      id:
        chatDoc.id,


      title:
        data.title || "New Chat",


      messages:

        messagesSnapshot.exists()

          ? messagesSnapshot.data().messages

          : [],


    });


  }



  return chats;


}









export function subscribeToChats(
  callback
){


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

    (snapshot)=>{


      const chats =

        snapshot.docs.map(

          doc=>({

            id:
              doc.id,


            title:
              doc.data().title || "New Chat",


            messages:[],

          })

        );



      console.log(
        "Realtime chats received:",
        chats
      );



      callback(chats);


    },


    (error)=>{


      console.error(

        "Chat realtime error:",

        error

      );


    }


  );


}









export function subscribeToMessages(
  chatId,
  callback
){


  console.log(

    "Listening messages:",

    chatId

  );



  return onSnapshot(

    messagesRef(chatId),

    (snapshot)=>{


      console.log(

        "Realtime message snapshot:",

        snapshot.exists()

      );



      if(snapshot.exists()){


        const messages =

          snapshot.data().messages || [];



        console.log(

          "Realtime messages received:",

          messages

        );



        callback(messages);


      }
      else{


        callback([]);


      }


    },


    (error)=>{


      console.error(

        "Message realtime error:",

        error

      );


    }


  );


}









export async function saveMessages(
  chatId,
  messages
){


  await setDoc(

    messagesRef(chatId),

    {

      messages,

    }

  );



  await updateDoc(

    chatDocRef(chatId),

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


  await updateDoc(

    chatDocRef(chatId),

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


  await deleteDoc(

    chatDocRef(chatId)

  );


}