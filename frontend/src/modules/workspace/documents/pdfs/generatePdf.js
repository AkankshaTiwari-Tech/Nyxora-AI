import { jsPDF } from "jspdf";


// ======================================================
// CONSTANTS
// ======================================================

const PAGE = {
  width: 210,
  height: 297,

  marginLeft: 18,
  marginRight: 18,

  marginTop: 20,
  marginBottom: 20,
};


const CONTENT_WIDTH =
  PAGE.width -
  PAGE.marginLeft -
  PAGE.marginRight;


// ======================================================
// SAFE TEXT
// ======================================================

function safeText(value) {

  if (
    value === null ||
    value === undefined
  ) {
    return "";
  }

  return String(value);

}


// ======================================================
// FILE NAME
// ======================================================

function createFileName(title) {

  const cleaned =
    safeText(title)
      .trim()
      .replace(
        /[<>:"/\\|?*]+/g,
        ""
      )
      .replace(
        /\s+/g,
        "-"
      )
      .toLowerCase();


  return `${
    cleaned || "nyxora-document"
  }.pdf`;

}


// ======================================================
// PDF GENERATOR
// ======================================================

export function generateWorkspacePdf(
  documentData = {}
) {

  const {
    title = "Nyxora Document",
    type = "",
    subject = "",
    chapter = "",
    content = "",
  } = documentData;


  const pdf =
    new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });


  let y =
    PAGE.marginTop;


  // ====================================================
  // PAGE CHECK
  // ====================================================

  const ensureSpace = (
    requiredSpace = 10
  ) => {

    if (
      y + requiredSpace >
      PAGE.height -
      PAGE.marginBottom
    ) {

      pdf.addPage();

      y =
        PAGE.marginTop;

    }

  };


  // ====================================================
  // BRAND
  // ====================================================

  pdf.setFont(
    "helvetica",
    "bold"
  );

  pdf.setFontSize(11);

  pdf.text(
    "NYXORA AI",
    PAGE.marginLeft,
    y
  );


  y += 8;


  pdf.setDrawColor(
    120,
    100,
    255
  );

  pdf.setLineWidth(
    0.6
  );

  pdf.line(
    PAGE.marginLeft,
    y,
    PAGE.width -
      PAGE.marginRight,
    y
  );


  y += 12;


  // ====================================================
  // TITLE
  // ====================================================

  pdf.setTextColor(
    20,
    20,
    30
  );

  pdf.setFont(
    "helvetica",
    "bold"
  );

  pdf.setFontSize(
    20
  );


  const titleLines =
    pdf.splitTextToSize(
      safeText(title),
      CONTENT_WIDTH
    );


  pdf.text(
    titleLines,
    PAGE.marginLeft,
    y
  );


  y +=
    titleLines.length *
      8 +
    5;


  // ====================================================
  // METADATA
  // ====================================================

  const metadata = [
    type
      ? `Type: ${type}`
      : "",

    subject
      ? `Subject: ${subject}`
      : "",

    chapter
      ? `Chapter: ${chapter}`
      : "",
  ].filter(Boolean);


  if (
    metadata.length > 0
  ) {

    pdf.setFont(
      "helvetica",
      "normal"
    );

    pdf.setFontSize(
      10
    );

    pdf.setTextColor(
      90,
      90,
      100
    );


    metadata.forEach(
      (item) => {

        ensureSpace(7);

        pdf.text(
          item,
          PAGE.marginLeft,
          y
        );

        y += 6;

      }
    );


    y += 5;

  }


  // ====================================================
  // CONTENT
  // ====================================================

  pdf.setTextColor(
    25,
    25,
    30
  );

  pdf.setFont(
    "helvetica",
    "normal"
  );

  pdf.setFontSize(
    11
  );


  const paragraphs =
    safeText(content)
      .replace(
        /\r\n/g,
        "\n"
      )
      .split("\n");


  paragraphs.forEach(
    (paragraph) => {

      if (
        !paragraph.trim()
      ) {

        y += 5;

        ensureSpace();

        return;

      }


      const lines =
        pdf.splitTextToSize(
          paragraph,
          CONTENT_WIDTH
        );


      lines.forEach(
        (line) => {

          ensureSpace(7);

          pdf.text(
            line,
            PAGE.marginLeft,
            y
          );

          y += 6;

        }
      );


      y += 2;

    }
  );


  // ====================================================
  // FOOTERS
  // ====================================================

  const totalPages =
    pdf.getNumberOfPages();


  for (
    let pageNumber = 1;
    pageNumber <= totalPages;
    pageNumber += 1
  ) {

    pdf.setPage(
      pageNumber
    );


    pdf.setFont(
      "helvetica",
      "normal"
    );

    pdf.setFontSize(
      8
    );

    pdf.setTextColor(
      120,
      120,
      130
    );


    pdf.text(
      `Generated with Nyxora AI • Page ${pageNumber} of ${totalPages}`,
      PAGE.width / 2,
      PAGE.height - 10,
      {
        align: "center",
      }
    );

  }


  return pdf;

}


// ======================================================
// DOWNLOAD
// ======================================================

export function downloadWorkspacePdf(
  documentData
) {

  const pdf =
    generateWorkspacePdf(
      documentData
    );


  pdf.save(
    createFileName(
      documentData?.title
    )
  );

}


// ======================================================
// PREVIEW URL
// ======================================================

export function createWorkspacePdfUrl(
  documentData
) {

  const pdf =
    generateWorkspacePdf(
      documentData
    );


  const blob =
    pdf.output(
      "blob"
    );


  return URL.createObjectURL(
    blob
  );

}