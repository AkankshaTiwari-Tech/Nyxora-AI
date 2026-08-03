// ======================================================
// HTML ESCAPE
// ======================================================

function escapeHtml(value = "") {

  return String(value)

    .replace(
      /&/g,
      "&amp;"
    )

    .replace(
      /</g,
      "&lt;"
    )

    .replace(
      />/g,
      "&gt;"
    )

    .replace(
      /"/g,
      "&quot;"
    )

    .replace(
      /'/g,
      "&#039;"
    );

}


// ======================================================
// FORMAT MESSAGE TEXT
// ======================================================

function formatMessageText(
  text = ""
) {

  const safeText =
    escapeHtml(text);


  return safeText

    // Code blocks
    .replace(
      /```([\s\S]*?)```/g,
      "<pre>$1</pre>"
    )

    // Inline code
    .replace(
      /`([^`]+)`/g,
      "<code>$1</code>"
    )

    // Bold
    .replace(
      /\*\*(.*?)\*\*/g,
      "<strong>$1</strong>"
    )

    // Line breaks
    .replace(
      /\n/g,
      "<br>"
    );

}


// ======================================================
// BUILD ATTACHMENT HTML
// ======================================================

function buildAttachmentHtml(
  file
) {

  if (!file) {

    return "";

  }


  const fileName =
    escapeHtml(
      file.name ||
      "Attachment"
    );


  const fileType =
    escapeHtml(
      file.type ||
      "File"
    );


  return `
    <div class="attachment">
      <div class="attachment-icon">
        📎
      </div>

      <div>
        <div class="attachment-name">
          ${fileName}
        </div>

        <div class="attachment-type">
          ${fileType}
        </div>
      </div>
    </div>
  `;

}


// ======================================================
// BUILD MESSAGE HTML
// ======================================================

function buildMessageHtml(
  message
) {

  if (
    !message ||
    (
      !message.message &&
      !message.file
    )
  ) {

    return "";

  }


  const isUser =
    message.role ===
    "user";


  const roleLabel =
    isUser
      ? "You"
      : "Nyxora AI";


  const messageText =
    message.message
      ? formatMessageText(
          message.message
        )
      : "";


  const attachmentHtml =
    buildAttachmentHtml(
      message.file
    );


  return `
    <section class="message ${
      isUser
        ? "user-message"
        : "assistant-message"
    }">

      <div class="message-header">

        <div class="avatar">
          ${
            isUser
              ? "U"
              : "N"
          }
        </div>

        <strong>
          ${roleLabel}
        </strong>

      </div>


      ${
        attachmentHtml
      }


      ${
        messageText
          ? `
            <div class="message-content">
              ${messageText}
            </div>
          `
          : ""
      }

    </section>
  `;

}


// ======================================================
// BUILD COMPLETE EXPORT DOCUMENT
// ======================================================

function buildExportDocument(
  chat
) {

  const title =
    escapeHtml(
      chat?.title ||
      "Nyxora AI Chat"
    );


  const messages =
    Array.isArray(
      chat?.messages
    )
      ? chat.messages
      : [];


  const messagesHtml =
    messages
      .map(
        buildMessageHtml
      )
      .filter(Boolean)
      .join("");


  return `
<!DOCTYPE html>

<html>

<head>

  <meta charset="UTF-8" />

  <title>${title}</title>

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  />


  <style>

    * {
      box-sizing: border-box;
    }


    body {
      margin: 0;
      padding: 0;
      background: white;
      color: #111827;
      font-family:
        Arial,
        Helvetica,
        sans-serif;
      line-height: 1.6;
    }


    .document {
      width: 100%;
      max-width: 850px;
      margin: 0 auto;
      padding: 48px;
    }


    .document-header {
      border-bottom: 2px solid #e5e7eb;
      padding-bottom: 24px;
      margin-bottom: 32px;
    }


    .brand {
      font-size: 14px;
      font-weight: 700;
      color: #6d28d9;
      margin-bottom: 8px;
      letter-spacing: 0.5px;
    }


    h1 {
      margin: 0;
      font-size: 28px;
      line-height: 1.3;
      color: #111827;
    }


    .subtitle {
      margin-top: 8px;
      color: #6b7280;
      font-size: 13px;
    }


    .message {
      margin-bottom: 30px;
      page-break-inside: avoid;
    }


    .message-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 10px;
    }


    .avatar {
      width: 30px;
      height: 30px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      font-weight: 700;
    }


    .user-message .avatar {
      background: #7c3aed;
      color: white;
    }


    .assistant-message .avatar {
      background: #111827;
      color: white;
    }


    .message-content {
      padding-left: 40px;
      font-size: 14px;
      overflow-wrap: anywhere;
    }


    .attachment {
      margin:
        0
        0
        12px
        40px;

      padding: 12px;

      display: flex;
      align-items: center;
      gap: 10px;

      border: 1px solid #e5e7eb;
      border-radius: 10px;

      background: #f9fafb;
    }


    .attachment-icon {
      font-size: 20px;
    }


    .attachment-name {
      font-size: 13px;
      font-weight: 600;
    }


    .attachment-type {
      margin-top: 2px;
      color: #6b7280;
      font-size: 11px;
    }


    pre {
      white-space: pre-wrap;
      word-break: break-word;
      overflow-wrap: anywhere;

      padding: 14px;

      background: #f3f4f6;
      border: 1px solid #e5e7eb;
      border-radius: 8px;

      font-family:
        Consolas,
        Monaco,
        monospace;

      font-size: 12px;
      line-height: 1.5;
    }


    code {
      padding: 2px 5px;
      background: #f3f4f6;
      border-radius: 4px;
      font-family:
        Consolas,
        Monaco,
        monospace;
      font-size: 12px;
    }


    .footer {
      margin-top: 50px;
      padding-top: 18px;
      border-top: 1px solid #e5e7eb;

      color: #9ca3af;
      font-size: 11px;
      text-align: center;
    }


    @page {
      margin: 15mm;
    }


    @media print {

      body {
        background: white;
      }


      .document {
        max-width: none;
        padding: 0;
      }


      .message {
        break-inside: avoid;
      }

    }

  </style>

</head>


<body>

  <main class="document">

    <header class="document-header">

      <div class="brand">
        NYXORA AI
      </div>


      <h1>
        ${title}
      </h1>


      <div class="subtitle">
        Exported conversation
      </div>

    </header>


    ${messagesHtml}


    <footer class="footer">
      Generated from Nyxora AI
    </footer>

  </main>

</body>

</html>
  `;

}


// ======================================================
// EXPORT CHAT AS PDF
// ======================================================

export function exportChatAsPdf(
  chat
) {

  if (!chat) {

    throw new Error(
      "No active chat available to export."
    );

  }


  const messages =
    Array.isArray(
      chat.messages
    )
      ? chat.messages
      : [];


  const exportableMessages =
    messages.filter(
      (message) =>
        message &&
        (
          String(
            message.message ||
            ""
          ).trim() ||
          message.file
        )
    );


  if (
    exportableMessages.length ===
    0
  ) {

    throw new Error(
      "This conversation has no messages to export."
    );

  }


  // ====================================================
  // CREATE PRINT WINDOW
  // ====================================================

  const printWindow =
    window.open(
      "",
      "_blank",
      "width=900,height=700"
    );


  if (!printWindow) {

    throw new Error(
      "Nyxora could not open the export window. Please allow pop-ups and try again."
    );

  }


  const html =
    buildExportDocument({
      ...chat,
      messages:
        exportableMessages,
    });


  printWindow.document.open();

  printWindow.document.write(
    html
  );

  printWindow.document.close();


  // ====================================================
  // WAIT FOR DOCUMENT
  // ====================================================

  printWindow.onload = () => {

    printWindow.focus();


    setTimeout(
      () => {

        printWindow.print();

      },
      250
    );

  };

}