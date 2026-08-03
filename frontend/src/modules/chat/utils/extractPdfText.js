import * as pdfjsLib from "pdfjs-dist";

import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";


// ======================================================
// PDF WORKER
// ======================================================

pdfjsLib.GlobalWorkerOptions.workerSrc =
  pdfWorker;


// ======================================================
// PDF ERROR CODES
// ======================================================

export const PDF_ERROR_CODES = {

  PASSWORD_PROTECTED:
    "PDF_PASSWORD_PROTECTED",

  INVALID_PDF:
    "PDF_INVALID",

  READ_FAILED:
    "PDF_READ_FAILED",

};


// ======================================================
// CREATE PDF ERROR
// ======================================================

function createPdfError(
  code,
  message
) {

  const error =
    new Error(message);


  error.code =
    code;


  return error;

}


// ======================================================
// DETECT PASSWORD ERROR
// ======================================================

function isPasswordError(
  error
) {

  if (!error) {

    return false;

  }


  // pdf.js normally exposes PasswordException.

  if (
    error.name ===
    "PasswordException"
  ) {

    return true;

  }


  // Additional fallback detection in case the
  // exception shape changes between pdf.js versions.

  const message =
    String(
      error.message || ""
    ).toLowerCase();


  return (
    message.includes(
      "password"
    ) ||
    message.includes(
      "encrypted"
    )
  );

}


// ======================================================
// DETECT INVALID PDF
// ======================================================

function isInvalidPdfError(
  error
) {

  if (!error) {

    return false;

  }


  if (
    error.name ===
    "InvalidPDFException"
  ) {

    return true;

  }


  const message =
    String(
      error.message || ""
    ).toLowerCase();


  return (
    message.includes(
      "invalid pdf"
    ) ||
    message.includes(
      "invalid pdf structure"
    )
  );

}


// ======================================================
// EXTRACT PDF TEXT
// ======================================================

export async function extractPdfText(
  file
) {

  if (!file) {

    throw createPdfError(

      PDF_ERROR_CODES.READ_FAILED,

      "No PDF file was provided."

    );

  }


  try {

    // ==================================================
    // READ FILE
    // ==================================================

    const arrayBuffer =
      await file.arrayBuffer();


    // ==================================================
    // LOAD PDF
    //
    // IMPORTANT:
    // If the PDF requires a password, pdf.js rejects
    // this promise with PasswordException.
    // ==================================================

    const loadingTask =
      pdfjsLib.getDocument({

        data:
          arrayBuffer,

      });


    const pdf =
      await loadingTask.promise;


    // ==================================================
    // EXTRACT TEXT FROM EVERY PAGE
    // ==================================================

    let text = "";


    for (
      let pageNumber = 1;
      pageNumber <= pdf.numPages;
      pageNumber++
    ) {

      const page =
        await pdf.getPage(
          pageNumber
        );


      const content =
        await page.getTextContent();


      const pageText =
        content.items

          .map(
            (item) =>
              item.str || ""
          )

          .join(" ")

          .trim();


      text +=
        `\n\n----- Page ${pageNumber} -----\n\n`;


      text +=
        pageText;

    }


    return text.trim();

  } catch (error) {

    // ==================================================
    // PASSWORD-PROTECTED PDF
    // ==================================================

    if (
      isPasswordError(
        error
      )
    ) {

      console.warn(
        "Password-protected PDF rejected."
      );


      throw createPdfError(

        PDF_ERROR_CODES
          .PASSWORD_PROTECTED,

        "⚠️ This PDF is password-protected. Please remove the password and upload it again."

      );

    }


    // ==================================================
    // INVALID / CORRUPTED PDF
    // ==================================================

    if (
      isInvalidPdfError(
        error
      )
    ) {

      console.error(
        "Invalid PDF:",
        error
      );


      throw createPdfError(

        PDF_ERROR_CODES
          .INVALID_PDF,

        "This PDF appears to be invalid or corrupted. Please try another file."

      );

    }


    // ==================================================
    // UNKNOWN PDF ERROR
    // ==================================================

    console.error(
      "PDF reading failed:",
      error
    );


    throw createPdfError(

      PDF_ERROR_CODES
        .READ_FAILED,

      "Nyxora couldn't read this PDF. Please try another file."

    );

  }

}