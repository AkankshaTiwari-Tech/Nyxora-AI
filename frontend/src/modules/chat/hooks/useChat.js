import { useState } from "react";

import { auth } from "../../../firebase/firebase";

import {
  getMemory,
} from "../../../services/memoryService";

import {
  saveMessages,
  updateChatTitle,
} from "../services/chatHistoryService";

import {
  stopGeneration,
} from "../services/geminiService";

import {
  streamResponse,
} from "./useStreaming";

import {
  extractPdfText,
} from "../utils/extractPdfText";

import {
  extractDocxText,
} from "../utils/extractDocxText";


// ======================================================
// CONFIG
// ======================================================

const MAX_CHAT_TITLE_LENGTH = 40;


// ======================================================
// ASSISTANT MODE INSTRUCTIONS
// ======================================================

const assistantModePrompts = {

  normal: `
You are Nyxora AI, a helpful general-purpose AI assistant.

Respond naturally and directly to the user's request.
Be clear, accurate, and useful.
Do not force an educational format unless the user asks for it.
`,


  teacher: `
You are Nyxora AI operating as a Teacher Assistant.

Your job is to help teachers with:
- lesson planning
- classroom explanations
- teaching strategies
- worksheets
- examples
- revision material
- student activities
- chapter planning

Give teacher-friendly, practical and well-structured responses.

If important information such as class, subject, chapter or board is missing,
ask for it only when it is genuinely necessary.
`,


  test: `
You are Nyxora AI operating as a professional Test Generator.

Your primary job is to create high-quality student tests.

When generating a test:
- clearly mention the title
- mention class and subject when known
- organize questions neatly
- use appropriate difficulty
- follow the marks requested by the user
- include different question types when appropriate
- ensure total marks are correct
- do not provide answers unless requested
- use proper mathematical notation when mathematics is involved

If essential information is missing, such as class, subject, chapter,
marks or difficulty, ask a short clarification instead of inventing
important requirements.
`,


  homework: `
You are Nyxora AI operating as a Homework Creator.

Create clear, age-appropriate and useful homework for students.

When appropriate:
- mention subject and topic
- organize questions clearly
- balance practice and understanding
- include different types of questions
- match the student's class level
- avoid unnecessary answers unless requested
- use proper mathematical notation for mathematics

If essential information such as class, subject or topic is missing,
ask for it when necessary.
`,


  report: `
You are Nyxora AI operating as a Student Report Analyzer.

Your job is to analyze student academic information such as:
- test scores
- attendance
- homework performance
- subject performance
- strengths
- weaknesses
- improvement trends

When data is provided:
1. Summarize overall performance.
2. Identify strengths.
3. Identify areas needing improvement.
4. Highlight meaningful patterns.
5. Suggest practical next steps for the teacher or student.

Never invent student data that was not provided.
Clearly state when there is not enough information for a conclusion.
`,


  doubt: `
You are Nyxora AI operating as a student Doubt Solver.

Your goal is to help the student understand the concept,
not merely give the final answer.

When solving a doubt:
- explain in simple language
- adapt to the apparent student level
- break difficult ideas into steps
- show calculations clearly when needed
- give examples when helpful
- avoid unnecessary complexity

For mathematical problems, explain the reasoning and steps clearly.

If the question is ambiguous, ask a concise clarification.
`,

};


// ======================================================
// BUILD CHAT TITLE
// ======================================================

function buildChatTitle(
  text,
  file
) {

  const cleanText =
    String(
      text || ""
    )
      .replace(
        /\s+/g,
        " "
      )
      .trim();


  let title =
    cleanText ||
    file?.name ||
    "New Chat";


  if (
    title.length >
    MAX_CHAT_TITLE_LENGTH
  ) {

    title =
      `${title
        .slice(
          0,
          MAX_CHAT_TITLE_LENGTH
        )
        .trim()}…`;

  }


  return title;

}


// ======================================================
// CHAT HOOK
// ======================================================

export default function useChat({
  activeChatId,
  chats,
  setChats,
  selectedMode = "normal",
}) {

  const [
    isThinking,
    setIsThinking,
  ] = useState(false);


  // ====================================================
  // FILE EXTRACTION
  // ====================================================

  const extractFileContent =
    async (file) => {

      if (!file) {

        return "";

      }


      if (
        file.type ===
        "application/pdf"
      ) {

        return await extractPdfText(
          file
        );

      }


      if (
        file.name
          .toLowerCase()
          .endsWith(".docx")
      ) {

        return await extractDocxText(
          file
        );

      }


      if (
        file.type ===
        "text/plain"
      ) {

        return await file.text();

      }


      return "";

    };


  // ====================================================
  // APPLY ASSISTANT MODE
  // ====================================================

  const buildModePrompt = (
    userPrompt
  ) => {

    const modeInstruction =
      assistantModePrompts[
        selectedMode
      ] ||
      assistantModePrompts.normal;


    return `
${modeInstruction}

USER REQUEST:

${userPrompt}
`.trim();

  };


  // ====================================================
  // SEND MESSAGE
  // ====================================================

  const send =
    async (payload) => {

      const userId =
        auth.currentUser?.uid;


      const memory =
        await getMemory();


      const text =
        typeof payload ===
          "string"

          ? payload

          : payload?.message ||
            "";


      const file =
        typeof payload ===
          "string"

          ? null

          : payload?.file ||
            null;


      if (
        (
          !String(text).trim() &&
          !file
        ) ||
        isThinking
      ) {

        return;

      }


      const currentChat =
        chats.find(
          (chat) =>
            chat.id ===
            activeChatId
        );


      if (!currentChat) {

        return;

      }


      const history =
        currentChat.messages ||
        [];


      // ==================================================
      // DETECT FIRST REAL USER MESSAGE
      //
      // New chats already contain the Nyxora welcome
      // assistant message, so history.length === 0 cannot
      // be used to detect the first user message.
      // ==================================================

      const hasUserMessage =
        history.some(
          (msg) =>
            msg.role ===
            "user"
        );


      const shouldCreateTitle =
        currentChat.title ===
          "New Chat" &&
        !hasUserMessage;


      const generatedTitle =
        shouldCreateTitle

          ? buildChatTitle(
              text,
              file
            )

          : currentChat.title;


      // ==================================================
      // CLEAN USER MESSAGE
      // ==================================================

      const cleanUserMessage =
        String(
          text || ""
        ).trim();


      let userPrompt =
        cleanUserMessage;


      // ==================================================
      // FILE CONTENT
      // ==================================================

      if (
        file &&
        !file.type.startsWith(
          "image/"
        )
      ) {

        const extractedText =
          await extractFileContent(
            file
          );


        if (extractedText) {

          userPrompt += `

FILE CONTENT:

${extractedText}`;

        }

      }


      // ==================================================
      // BUILD FULL AI PROMPT
      // ==================================================

      const prompt =
        buildModePrompt(
          userPrompt
        );


      // ==================================================
      // CLEAN MESSAGE FOR MEMORY
      // ==================================================

      const memoryMessage =
        cleanUserMessage;


      // ==================================================
      // CREATE USER + AI MESSAGE
      // ==================================================

      const userMessage = {

        id:
          Date.now(),

        role:
          "user",

        message:
          text,

      };


      const aiMessage = {

        id:
          Date.now() + 1,

        role:
          "assistant",

        message:
          "",

      };


      const newMessages = [

        ...history,

        userMessage,

        aiMessage,

      ];


      // ==================================================
      // UPDATE LOCAL STATE
      // ==================================================

      setChats((prev) =>
        prev.map((chat) => {

          if (
            chat.id !==
            activeChatId
          ) {

            return chat;

          }


          return {

            ...chat,

            title:
              shouldCreateTitle
                ? generatedTitle
                : chat.title,

            messages:
              newMessages,

          };

        })
      );


      // ==================================================
      // SAVE MESSAGES TO FIRESTORE
      // ==================================================

      await saveMessages(
        activeChatId,
        newMessages
      );


      // ==================================================
      // SAVE AUTOMATIC CHAT TITLE
      // ==================================================

      if (
        shouldCreateTitle &&
        generatedTitle !==
          "New Chat"
      ) {

        try {

          await updateChatTitle(
            activeChatId,
            generatedTitle
          );


          console.log(
            "🏷️ Chat title saved:",
            generatedTitle
          );

        } catch (error) {

          console.error(
            "⚠️ Failed to save chat title:",
            error
          );

        }

      }


      // ==================================================
      // START THINKING
      // ==================================================

      setIsThinking(true);


      // ==================================================
      // STREAM AI RESPONSE
      // ==================================================

      await streamResponse({

        prompt,

        memoryMessage,

        file,

        history,

        messages:
          newMessages,

        aiMessageId:
          aiMessage.id,

        activeChatId,

        setChats,

        setIsThinking,

        userId,

        memory,

      });

    };


  // ====================================================
  // REGENERATE
  // ====================================================

  const regenerate =
    async () => {

      if (isThinking) {

        return;

      }


      const activeChat =
        chats.find(
          (chat) =>
            chat.id ===
            activeChatId
        );


      if (!activeChat) {

        return;

      }


      const lastUser =
        [
          ...activeChat.messages,
        ]
          .reverse()
          .find(
            (msg) =>
              msg.role ===
              "user"
          );


      if (!lastUser) {

        return;

      }


      const memory =
        await getMemory();


      const cleanUserMessage =
        String(
          lastUser.message ||
          ""
        ).trim();


      const prompt =
        buildModePrompt(
          cleanUserMessage
        );


      const messages =
        activeChat.messages;


      const lastAssistant =
        [...messages]
          .reverse()
          .find(
            (msg) =>
              msg.role ===
              "assistant"
          );


      if (!lastAssistant) {

        return;

      }


      setIsThinking(true);


      await streamResponse({

        prompt,

        memoryMessage:
          cleanUserMessage,

        history:
          messages,

        messages,

        memory,

        aiMessageId:
          lastAssistant.id,

        activeChatId,

        setChats,

        setIsThinking,

        userId:
          auth.currentUser?.uid,

      });

    };


  // ====================================================
  // EDIT MESSAGE
  // ====================================================

  const editMessage =
    async (
      messageId,
      newText
    ) => {

      if (isThinking) {

        return;

      }


      const activeChat =
        chats.find(
          (chat) =>
            chat.id ===
            activeChatId
        );


      if (!activeChat) {

        return;

      }


      const memory =
        await getMemory();


      const messageIndex =
        activeChat.messages
          .findIndex(
            (msg) =>
              msg.id ===
              messageId
          );


      if (
        messageIndex === -1
      ) {

        return;

      }


      const assistantIndex =
        activeChat.messages
          .findIndex(
            (
              msg,
              index
            ) =>
              index >
                messageIndex &&
              msg.role ===
                "assistant"
          );


      if (
        assistantIndex === -1
      ) {

        return;

      }


      const cleanUserMessage =
        String(
          newText || ""
        ).trim();


      if (!cleanUserMessage) {

        return;

      }


      const updatedMessages =
        activeChat.messages
          .map(
            (
              msg,
              index
            ) => {

              if (
                index ===
                messageIndex
              ) {

                return {

                  ...msg,

                  message:
                    cleanUserMessage,

                };

              }


              if (
                index ===
                assistantIndex
              ) {

                return {

                  ...msg,

                  message:
                    "",

                };

              }


              return msg;

            }
          );


      // ==================================================
      // UPDATE LOCAL STATE
      // ==================================================

      setChats((prev) =>
        prev.map(
          (chat) =>

            chat.id ===
            activeChatId

              ? {

                  ...chat,

                  messages:
                    updatedMessages,

                }

              : chat
        )
      );


      // ==================================================
      // SAVE EDITED MESSAGES
      // ==================================================

      await saveMessages(
        activeChatId,
        updatedMessages
      );


      const prompt =
        buildModePrompt(
          cleanUserMessage
        );


      const aiMessage =
        updatedMessages[
          assistantIndex
        ];


      setIsThinking(true);


      // ==================================================
      // REGENERATE RESPONSE AFTER EDIT
      // ==================================================

      await streamResponse({

        prompt,

        memoryMessage:
          cleanUserMessage,

        history:
          updatedMessages.slice(
            0,
            messageIndex
          ),

        messages:
          updatedMessages,

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


  // ====================================================
  // STOP GENERATION
  // ====================================================

  const stop = () => {

    stopGeneration();

    setIsThinking(false);

  };


  // ====================================================
  // RETURN
  // ====================================================

  return {

    send,

    regenerate,

    editMessage,

    stop,

    isThinking,

  };

}