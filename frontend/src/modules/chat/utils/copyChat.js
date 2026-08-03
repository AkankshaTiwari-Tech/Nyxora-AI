// ======================================================
// CLEAN TEXT
// ======================================================

function cleanText(
  value = ""
) {

  return String(value)
    .replace(/\r\n/g, "\n")
    .trim();

}


// ======================================================
// FORMAT ATTACHMENT
// ======================================================

function formatAttachment(
  file
) {

  if (!file) {

    return "";

  }


  const fileName =
    cleanText(
      file.name ||
      "Attachment"
    );


  const fileType =
    cleanText(
      file.type ||
      ""
    );


  if (fileType) {

    return `Attachment: ${fileName} (${fileType})`;

  }


  return `Attachment: ${fileName}`;

}


// ======================================================
// FORMAT MESSAGE
// ======================================================

function formatMessage(
  message
) {

  if (!message) {

    return "";

  }


  const text =
    cleanText(
      message.message ||
      ""
    );


  const attachment =
    formatAttachment(
      message.file
    );


  // Ignore completely empty messages.

  if (
    !text &&
    !attachment
  ) {

    return "";

  }


  const role =
    message.role === "user"
      ? "You"
      : "Nyxora AI";


  const parts = [
    `${role}:`,
  ];


  if (attachment) {

    parts.push(
      attachment
    );

  }


  if (text) {

    parts.push(
      text
    );

  }


  return parts.join(
    "\n"
  );

}


// ======================================================
// BUILD CONVERSATION TEXT
// ======================================================

export function buildConversationText(
  chat
) {

  if (!chat) {

    throw new Error(
      "No active conversation available."
    );

  }


  const messages =
    Array.isArray(
      chat.messages
    )
      ? chat.messages
      : [];


  const formattedMessages =
    messages
      .map(
        formatMessage
      )
      .filter(Boolean);


  if (
    formattedMessages.length ===
    0
  ) {

    throw new Error(
      "This conversation has no messages to copy."
    );

  }


  const title =
    cleanText(
      chat.title ||
      "Nyxora AI Chat"
    );


  return [
    `Nyxora AI — ${title}`,
    "",
    ...formattedMessages.flatMap(
      (message, index) => {

        if (
          index ===
          formattedMessages.length - 1
        ) {

          return [
            message,
          ];

        }


        return [
          message,
          "",
        ];

      }
    ),

  ].join(
    "\n"
  );

}


// ======================================================
// COPY CONVERSATION
// ======================================================

export async function copyConversation(
  chat
) {

  const conversationText =
    buildConversationText(
      chat
    );


  // ====================================================
  // MODERN CLIPBOARD API
  // ====================================================

  if (
    navigator.clipboard &&
    window.isSecureContext
  ) {

    await navigator.clipboard.writeText(
      conversationText
    );


    return true;

  }


  // ====================================================
  // FALLBACK
  //
  // Useful during development or environments where the
  // Clipboard API is unavailable.
  // ====================================================

  const textarea =
    document.createElement(
      "textarea"
    );


  textarea.value =
    conversationText;


  textarea.setAttribute(
    "readonly",
    ""
  );


  textarea.style.position =
    "fixed";

  textarea.style.opacity =
    "0";

  textarea.style.pointerEvents =
    "none";


  document.body.appendChild(
    textarea
  );


  textarea.select();


  const copied =
    document.execCommand(
      "copy"
    );


  document.body.removeChild(
    textarea
  );


  if (!copied) {

    throw new Error(
      "Nyxora could not copy this conversation."
    );

  }


  return true;

}