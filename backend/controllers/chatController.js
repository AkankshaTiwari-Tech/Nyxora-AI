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
      ? existingMessages.filter(
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
// VALIDATE ATTACHMENT
// ======================================================

function normalizeAttachment(
  attachment
) {

  if (
    !attachment ||
    typeof attachment !==
      "object"
  ) {

    return null;

  }


  const data =
    typeof attachment.data ===
      "string"

      ? attachment.data.trim()

      : "";


  const mimeType =
    typeof attachment.mimeType ===
      "string"

      ? attachment.mimeType.trim()

      : "";


  const name =
    typeof attachment.name ===
      "string"

      ? attachment.name.trim()

      : "Attachment";


  if (
    !data ||
    !mimeType
  ) {

    return null;

  }


  // ====================================================
  // CURRENT DIRECT AI ATTACHMENT SUPPORT
  //
  // DOCX/TXT/MD are already converted into text by the
  // frontend and therefore do not need inlineData here.
  // ====================================================

  const supported =
    mimeType.startsWith(
      "image/"
    ) ||
    mimeType ===
      "application/pdf";


  if (!supported) {

    console.warn(
      "⚠️ Unsupported direct AI attachment:",
      mimeType
    );


    return null;

  }


  return {

    data,

    mimeType,

    name,

  };

}


// ======================================================
// NORMALIZE LEGACY IMAGE
// ======================================================

function normalizeLegacyImage(
  image
) {

  if (
    !image ||
    typeof image !==
      "object"
  ) {

    return null;

  }


  const data =
    typeof image.data ===
      "string"

      ? image.data.trim()

      : "";


  const mimeType =
    typeof image.mimeType ===
      "string"

      ? image.mimeType.trim()

      : "";


  if (
    !data ||
    !mimeType ||
    !mimeType.startsWith(
      "image/"
    )
  ) {

    return null;

  }


  return {

    data,

    mimeType,

    name:
      "Image",

  };

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

  attachment,

  // New multiple attachment support.
  attachments,

  // Keep legacy image support while the frontend
  // migration is completed.
  image,

  history,

  userId,

  mode,

} = req.body;


    // ==================================================
    // CLEAN MEMORY MESSAGE
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
    // PREPARE ATTACHMENT
    //
    // Prefer the new generic attachment.
    // Fall back to the old image field if necessary.
    // ==================================================

const safeAttachments =
  Array.isArray(
    attachments
  )

    ? attachments
        .map(
          (
            item
          ) =>
            normalizeAttachment(
              item
            )
        )
        .filter(
          Boolean
        )

    : [];


const safeAttachment =
  safeAttachments[0] ||
  normalizeAttachment(
    attachment
  ) ||
  normalizeLegacyImage(
    image
  );


    // ==================================================
    // VALIDATION
    // ==================================================

    const hasMessage =
      typeof message ===
        "string" &&
      message.trim() !== "";


if (
  !hasMessage &&
  safeAttachments.length === 0 &&
  !safeAttachment
) {

      return res
        .status(400)
        .json({

          reply:
            "Message or attachment is required.",

        });

    }


    // ==================================================
    // LOG REQUEST
    // ==================================================

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


    if (safeAttachment) {

      console.log(
        "📎 AI attachment:",
        safeAttachment.name,
        safeAttachment.mimeType
      );

    }

    if (
  safeAttachments.length > 0
) {

  console.log(
    "📎 AI attachments:",
    safeAttachments.length
  );

}


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
    //
    // IMPORTANT:
    // Only cleanMemoryMessage is analyzed.
    //
    // Extracted PDF text and visual PDF content must NOT
    // automatically become long-term user memory.
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


        // Memory failure must never prevent
        // the AI response.

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
        "Analyze the attached file.",

      safeAttachment,

      safeAttachments,

      Array.isArray(history)
        ? history
        : [],

      userMemory,

      mode

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
    //
    // IMPORTANT:
    // Only cleanMemoryMessage is stored as the user side
    // of Recent Context.
    //
    // PDF Base64 and extracted PDF text are NOT stored
    // here.
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
              ?.recentMessages ||
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