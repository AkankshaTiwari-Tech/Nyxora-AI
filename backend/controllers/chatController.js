import {
  generateAIResponseStream,
} from "../services/aiService.js";

import {
  saveMemory,
  getMemory,
} from "../services/memoryService.js";

import {
  extractMemory,
} from "../services/memoryExtractor.js";


// ======================================================
// CONFIG
// ======================================================

const MAX_RECENT_MESSAGES = 8;


// ======================================================
// NORMALIZE RECENT MESSAGE
// ======================================================

function normalizeRecentMessage(
  value
) {

  return String(
    value || ""
  )
    .trim()
    .replace(
      /\s+/g,
      " "
    )
    .toLowerCase();

}


// ======================================================
// BUILD RECENT MESSAGES
// ======================================================

function buildRecentMessages(
  existingMessages = [],
  userMessage,
  aiResponse
) {

  const safeExisting =
    Array.isArray(
      existingMessages
    )
      ? existingMessages
          .filter(
            (entry) =>
              entry &&
              typeof entry ===
                "object"
          )
      : [];


  const cleanUserMessage =
    String(
      userMessage || ""
    ).trim();


  const cleanAIResponse =
    String(
      aiResponse || ""
    ).trim();


  const newEntry = {

    user:
      cleanUserMessage,

    ai:
      cleanAIResponse,

  };


  // ====================================================
  // DUPLICATE PROTECTION
  //
  // If the newest stored entry has the exact same user
  // message, this is most likely a regeneration/retry.
  //
  // Replace only that newest entry's AI response instead
  // of appending another identical recent-memory turn.
  // ====================================================

  if (
    safeExisting.length > 0
  ) {

    const lastIndex =
      safeExisting.length - 1;


    const lastEntry =
      safeExisting[
        lastIndex
      ];


    const previousUserMessage =
      normalizeRecentMessage(
        lastEntry.user
      );


    const currentUserMessage =
      normalizeRecentMessage(
        cleanUserMessage
      );


    if (
      previousUserMessage &&
      currentUserMessage &&
      previousUserMessage ===
        currentUserMessage
    ) {

      const updatedMessages = [
        ...safeExisting,
      ];


      updatedMessages[
        lastIndex
      ] = {

        ...lastEntry,

        user:
          cleanUserMessage,

        ai:
          cleanAIResponse,

      };


      console.log(
        "♻️ Recent Context duplicate replaced instead of appended."
      );


      return updatedMessages.slice(
        -MAX_RECENT_MESSAGES
      );

    }

  }


  // ====================================================
  // NORMAL NEW CONVERSATION TURN
  // ====================================================

  const updatedMessages = [

    ...safeExisting,

    newEntry,

  ];


  return updatedMessages.slice(
    -MAX_RECENT_MESSAGES
  );

}


// ======================================================
// CHAT WITH NYXORA AI
// ======================================================

export async function chatWithAI(
  req,
  res
) {

  try {

    const {
      message,
      memoryMessage,
      image,
      history,
      userId,
    } = req.body;


    // ==================================================
    // CLEAN MEMORY MESSAGE
    //
    // message:
    // Full prompt including assistant-mode instructions.
    //
    // memoryMessage:
    // Actual text written by the user.
    // ==================================================

    const cleanMemoryMessage =
      typeof memoryMessage ===
        "string" &&
      memoryMessage.trim()

        ? memoryMessage.trim()

        : typeof message ===
            "string"

          ? message.trim()

          : "";


    // ==================================================
    // VALIDATION
    // ==================================================

    if (
      (
        !message ||
        typeof message !==
          "string" ||
        message.trim() === ""
      ) &&
      !image
    ) {

      return res
        .status(400)
        .json({
          reply:
            "Message or image is required.",
        });

    }


    console.log(
      "👤 Memory User ID:",
      userId ||
        "No user ID"
    );


    console.log(
      "💬 Clean memory message:",
      cleanMemoryMessage ||
        "[No text]"
    );


    // ==================================================
    // STEP 1 — LOAD CURRENT MEMORY
    // ==================================================

    let userMemory =
      null;


    if (userId) {

      try {

        userMemory =
          await getMemory(
            userId
          );


        console.log(
          "🧠 Current memory loaded:",
          userMemory
        );

      } catch (error) {

        console.error(
          "⚠️ Failed to load current memory:",
          error
        );


        userMemory =
          null;

      }

    }


    // ==================================================
    // STEP 2 — EXTRACT LONG-TERM MEMORY
    // ==================================================

    if (
      userId &&
      cleanMemoryMessage
    ) {

      try {

        const extractedMemory =
          await extractMemory(

            cleanMemoryMessage,

            userMemory

          );


        if (
          extractedMemory &&
          Object.keys(
            extractedMemory
          ).length > 0
        ) {

          await saveMemory(

            userId,

            extractedMemory

          );


          console.log(
            "✅ Smart memory changes saved."
          );


          // ============================================
          // RELOAD FRESH MEMORY
          // ============================================

          userMemory =
            await getMemory(
              userId
            );


          console.log(
            "🔄 Updated memory reloaded:",
            userMemory
          );

        } else {

          console.log(
            "🧠 No long-term memory update required."
          );

        }

      } catch (error) {

        console.error(
          "⚠️ Memory processing failed:",
          error
        );

        // Memory failure should never
        // prevent the AI response.

      }

    }


    // ==================================================
    // STEP 3 — STREAM AI RESPONSE
    // ==================================================

    let fullResponse =
      "";


    res.setHeader(
      "Content-Type",
      "text/plain; charset=utf-8"
    );


    res.setHeader(
      "Transfer-Encoding",
      "chunked"
    );


    res.setHeader(
      "Cache-Control",
      "no-cache"
    );


    for await (
      const chunk of
        generateAIResponseStream(

          message ||
            "Analyze this image.",

          image,

          history || [],

          userMemory

        )
    ) {

      fullResponse +=
        chunk;


      res.write(
        chunk
      );

    }


    // ==================================================
    // STEP 4 — FINISH RESPONSE
    // ==================================================

    res.end();


    console.log(
      "✅ Nyxora response completed."
    );


    console.log(
      "📦 Response length:",
      fullResponse.length
    );


    // ==================================================
    // STEP 5 — SAVE RECENT CONTEXT
    // ==================================================

    if (
      userId &&
      cleanMemoryMessage &&
      fullResponse.trim()
    ) {

      try {

        const latestMemory =
          await getMemory(
            userId
          );


        const recentMessages =
          buildRecentMessages(

            latestMemory
              .recentMessages ||
              [],

            cleanMemoryMessage,

            fullResponse.trim()

          );


        await saveMemory(

          userId,

          {
            recentMessages,
          }

        );


        console.log(
          "💬 Recent conversation saved."
        );


        console.log(
          "💬 Recent message count:",
          recentMessages.length
        );

      } catch (error) {

        console.error(
          "⚠️ Failed to save recent conversation:",
          error
        );

      }

    }


  } catch (error) {

    console.error(
      "❌ Chat Controller Error:",
      error
    );


    if (
      !res.headersSent
    ) {

      return res
        .status(500)
        .json({
          reply:
            "❌ Something went wrong.",
        });

    }


    try {

      res.end();

    } catch {

      // Ignore stream closing error.

    }

  }

}