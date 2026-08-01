import { useEffect, useState } from "react";

import {
  createChat,
  getChats,
  saveMessages,
  updateChatTitle,
  deleteChat as deleteFirebaseChat,
} from "../services/chatHistoryService";



const createWelcomeMessages = () => [

  {

    id: Date.now(),

    role: "assistant",

    message:
      "Hello 👋\n\nWelcome to Nyxora AI.\n\nHow can I help you today?",

  },

];







export default function useChatHistory() {


  const [chats, setChats] = useState([]);

  const [activeChatId, setActiveChatId] = useState(null);

  const [loading, setLoading] = useState(true);







  useEffect(()=>{


    async function initialize(){


      try{


        const savedChats =
          await getChats();



        if(savedChats.length > 0){


          setChats(savedChats);


          setActiveChatId(
            savedChats[0].id
          );


        }
        else{


          const id =
            await createChat(
              "New Chat"
            );



          const newChat = {


            id,


            title:
              "New Chat",


            messages:
              createWelcomeMessages(),


          };



          setChats([

            newChat

          ]);



          setActiveChatId(id);



          await saveMessages(

            id,

            newChat.messages

          );


        }



      }
      catch(error){


        console.error(

          "Chat loading error:",

          error

        );


      }
      finally{


        setLoading(false);


      }


    }



    initialize();


  }, []);









  const activeChat =

    chats.find(

      chat =>

        chat.id === activeChatId

    );









  const newChat = async()=>{


    const id =

      await createChat(

        "New Chat"

      );



    const chat = {


      id,


      title:

        "New Chat",


      messages:

        createWelcomeMessages(),


    };



    setChats(

      prev =>

        [

          chat,

          ...prev

        ]

    );



    setActiveChatId(id);



    await saveMessages(

      id,

      chat.messages

    );


  };









  const selectChat = (chatId)=>{


    setActiveChatId(chatId);


  };









  const deleteChat = async(chatId)=>{


    if(chats.length === 1)

      return;



    await deleteFirebaseChat(

      chatId

    );



    setChats(

      prev =>

        prev.filter(

          chat =>

            chat.id !== chatId

        )

    );



  };









  const renameChat = async(

    chatId,

    title

  )=>{


    setChats(

      prev =>

        prev.map(

          chat =>


            chat.id === chatId

            ? {

                ...chat,

                title,

              }

            : chat

        )

    );



    await updateChatTitle(

      chatId,

      title

    );


  };









  return {


    chats,

    setChats,

    activeChat,

    activeChatId,

    setActiveChatId,

    newChat,

    selectChat,

    deleteChat,

    renameChat,

    loading,


  };


}