import { useState } from "react";

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



  const extractFileContent = async (file) => {

    if (!file) return "";


    if (
      file.type === "application/pdf"
    ) {

      return await extractPdfText(file);

    }


    if (
      file.name.endsWith(".docx")
    ) {

      return await extractDocxText(file);

    }


    if (
      file.type === "text/plain"
    ) {

      return await file.text();

    }


    return "";

  };



  const send = async (payload) => {

    const text =
      typeof payload === "string"
        ? payload
        : payload?.message || "";


    const file =
      typeof payload === "string"
        ? null
        : payload?.file || null;



    if (
      (!String(text).trim() && !file) ||
      isThinking
    ) {

      return;

    }



    const currentChat =
      chats.find(
        (chat) =>
          chat.id === activeChatId
      );



    const history =
      currentChat?.messages || [];



    let userPrompt =
      String(text).trim();



    if (
      !userPrompt &&
      file
    ) {

      userPrompt =
        file.type.startsWith("image/")
          ? "Please analyze this image."
          : "Please analyze this document and provide a summary.";

    }



    let prompt =
      userPrompt;



    if (
      file &&
      !file.type.startsWith("image/")
    ) {

      try {

        const extractedText =
          await extractFileContent(file);


        if (extractedText) {

          prompt = `${userPrompt}

FILE CONTENT:

${extractedText}`;

        }


      } catch(error) {

        console.error(
          "File extraction error:",
          error
        );

      }

    }



    const userMessage = {

      id: Date.now(),

      role: "user",

      message: text,

      file: file
        ? {
            name:file.name,
            type:file.type,
            size:file.size,
          }
        : null,

    };



    const aiMessage = {

      id: Date.now()+1,

      role: "assistant",

      message: "",

    };



    setChats((prev)=>

      prev.map((chat)=>{

        if(
          chat.id !== activeChatId
        )

          return chat;



        return {

          ...chat,

          title:
            chat.title === "New Chat"
              ? (
                  text ||
                  file?.name ||
                  "New Chat"
                ).slice(0,30)
              : chat.title,


          messages:[

            ...chat.messages,

            userMessage,

            aiMessage,

          ],

        };

      })

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

    });

  };





  const regenerate = async () => {


    if(isThinking)

      return;



    const activeChat =
      chats.find(
        (chat)=>
          chat.id===activeChatId
      );



    if(!activeChat)

      return;



    const lastUser =
      [...activeChat.messages]
      .reverse()
      .find(
        (msg)=>
          msg.role==="user"
      );



    if(!lastUser)

      return;



    const aiMessage = {

      id:Date.now(),

      role:"assistant",

      message:"",

    };



    setChats((prev)=>

      prev.map((chat)=>{

        if(
          chat.id!==activeChatId
        )

          return chat;



        const messages=[
          ...chat.messages,
        ];



        if(
          messages[messages.length-1]
          ?.role==="assistant"
        ){

          messages.pop();

        }



        messages.push(aiMessage);



        return {

          ...chat,

          messages,

        };

      })

    );



    setIsThinking(true);



    await streamResponse({

      prompt:lastUser.message,

      history:activeChat.messages,

      aiMessageId:
        aiMessage.id,

      activeChatId,

      setChats,

      setIsThinking,

    });


  };





  const editMessage = async(
    messageId,
    newText
  ) => {


    if(isThinking)

      return;



    const activeChat =
      chats.find(
        (chat)=>
          chat.id===activeChatId
      );



    if(!activeChat)

      return;



    const updatedMessages =
      activeChat.messages.map(
        (msg)=>


          msg.id === messageId

            ? {

                ...msg,

                message:newText,

              }

            : msg

      );



    const aiMessage = {

      id:Date.now(),

      role:"assistant",

      message:"",

    };



    setChats((prev)=>

      prev.map((chat)=>{


        if(
          chat.id !== activeChatId
        )

          return chat;



        return {

          ...chat,

          messages:[

            ...updatedMessages,

            aiMessage,

          ],

        };


      })

    );



    setIsThinking(true);



    await streamResponse({

      prompt:newText,

      history:updatedMessages,

      aiMessageId:
        aiMessage.id,

      activeChatId,

      setChats,

      setIsThinking,

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