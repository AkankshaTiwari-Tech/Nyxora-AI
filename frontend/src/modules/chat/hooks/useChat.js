import { useState } from "react";

import { auth } from "../../../firebase/firebase";

import {
  getMemory,
} from "../../../services/memoryService";

import {
  saveMessages,
} from "../services/chatHistoryService";

import { stopGeneration } from "../services/geminiService";
import { streamResponse } from "./useStreaming";

import { extractPdfText } from "../utils/extractPdfText";
import { extractDocxText } from "../utils/extractDocxText";



export default function useChat({
  activeChatId,
  chats,
  setChats,
}) {


  const [
    isThinking,
    setIsThinking,
  ] = useState(false);





  const extractFileContent = async(file)=>{


    if(!file)

      return "";



    if(file.type==="application/pdf"){

      return await extractPdfText(file);

    }



    if(file.name.endsWith(".docx")){

      return await extractDocxText(file);

    }



    if(file.type==="text/plain"){

      return await file.text();

    }



    return "";

  };







  const send = async(payload)=>{


    const userId =
      auth.currentUser?.uid;



    const memory =
      await getMemory();





    const text =
      typeof payload==="string"

        ? payload

        : payload?.message || "";





    const file =
      typeof payload==="string"

        ? null

        : payload?.file || null;





    if(
      (!String(text).trim() && !file)
      ||
      isThinking
    )

      return;







    const currentChat =
      chats.find(

        chat=>

          chat.id===activeChatId

      );



    const history =
      currentChat?.messages || [];







    let prompt =
      String(text).trim();







    if(
      file &&
      !file.type.startsWith("image/")
    ){


      const extractedText =
        await extractFileContent(file);



      if(extractedText){


        prompt += `

FILE CONTENT:

${extractedText}`;

      }


    }







    const userMessage = {


      id:Date.now(),

      role:"user",

      message:text,


    };





    const aiMessage = {


      id:Date.now()+1,

      role:"assistant",

      message:"",


    };





    const newMessages = [

      ...history,

      userMessage,

      aiMessage,

    ];






    setChats(prev=>

      prev.map(chat=>{


        if(chat.id!==activeChatId)

          return chat;



        return {

          ...chat,


          title:

            chat.title==="New Chat"

            ? (

                text ||

                file?.name ||

                "New Chat"

              ).slice(0,30)

            : chat.title,



          messages:newMessages,


        };


      })

    );






    // Save user message immediately

    await saveMessages(

      activeChatId,

      newMessages

    );







    setIsThinking(true);






    await streamResponse({

      prompt,

      file,

      history,

      aiMessageId:

        aiMessage.id,

      activeChatId,

      setChats,

      setIsThinking,

      userId,

    });







    // Do not save here
    // React state is not updated immediately

  };









  const regenerate = async()=>{


    if(isThinking)

      return;



    const activeChat =

      chats.find(

        chat=>

          chat.id===activeChatId

      );



    if(!activeChat)

      return;





    const lastUser =

      [...activeChat.messages]

      .reverse()

      .find(

        msg=>

          msg.role==="user"

      );



    if(!lastUser)

      return;



    const memory =
      await getMemory();





    const aiMessage = {


      id:Date.now(),

      role:"assistant",

      message:"",


    };




    setIsThinking(true);





    await streamResponse({

      prompt:lastUser.message,

      history:activeChat.messages,

      memory,

      aiMessageId:

        aiMessage.id,

      activeChatId,

      setChats,

      setIsThinking,

      userId:

        auth.currentUser?.uid,


    });



  };









  const editMessage = async(
    messageId,
    newText
  )=>{


    if(isThinking)

      return;





    const activeChat =

      chats.find(

        chat=>

          chat.id===activeChatId

      );



    if(!activeChat)

      return;



    const memory =
      await getMemory();





    const aiMessage = {


      id:Date.now(),

      role:"assistant",

      message:"",


    };





    setIsThinking(true);






    await streamResponse({

      prompt:newText,

      history:activeChat.messages,

      memory,

      aiMessageId:

        aiMessage.id,

      activeChatId,

      setChats,

      setIsThinking,

      userId:

        auth.currentUser?.uid,


    });



  };








  const stop = ()=>{


    stopGeneration();


    setIsThinking(false);


  };







  return {


    send,

    regenerate,

    editMessage,

    stop,

    isThinking,


  };


}