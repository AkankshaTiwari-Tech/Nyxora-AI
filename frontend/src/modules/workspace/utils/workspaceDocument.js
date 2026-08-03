// ======================================================
// DOCUMENT HELPERS
// ======================================================

export function getDocumentTypeLabel(
  type
) {

  const labels = {
    notes: "Notes",
    test: "Test",
    tests: "Test",
    worksheet: "Worksheet",
    worksheets: "Worksheet",
    assignment: "Assignment",
    assignments: "Assignment",
    pdf: "PDF",
    presentation: "Presentation",
    spreadsheet: "Spreadsheet",
    image: "Image",
  };


  return (
    labels[type] ||
    type ||
    "Document"
  );

}


// ======================================================
// DOCUMENT ICON
// ======================================================

export function getDocumentTypeIcon(
  type
) {

  const icons = {
    notes: "📒",

    test: "📝",
    tests: "📝",

    worksheet: "📚",
    worksheets: "📚",

    assignment: "📋",
    assignments: "📋",

    pdf: "📄",

    presentation: "📽️",

    spreadsheet: "📊",

    image: "🖼️",
  };


  return (
    icons[type] ||
    "📄"
  );

}


// ======================================================
// SEARCHABLE TEXT
// ======================================================

export function getDocumentSearchText(
  document = {}
) {

  return [
    document.title,
    document.type,
    document.subject,
    document.chapter,
    document.content,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

}


// ======================================================
// FILTER DOCUMENTS
// ======================================================

export function filterWorkspaceDocuments(
  documents = [],
  {
    search = "",
    type = "all",
    classId = "all",
    studentId = "all",
  } = {}
) {

  const normalizedSearch =
    String(search)
      .trim()
      .toLowerCase();


  return documents.filter(
    (document) => {

      if (
        type !== "all" &&
        document.type !== type
      ) {
        return false;
      }


      if (
        classId !== "all" &&
        document.classId !==
          classId
      ) {
        return false;
      }


      if (
        studentId !== "all" &&
        document.studentId !==
          studentId
      ) {
        return false;
      }


      if (
        normalizedSearch &&
        !getDocumentSearchText(
          document
        ).includes(
          normalizedSearch
        )
      ) {
        return false;
      }


      return true;

    }
  );

}