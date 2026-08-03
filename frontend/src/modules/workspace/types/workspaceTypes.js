// ======================================================
// WORKSPACE ENTITY TYPES
//
// JavaScript project:
// these constants act as stable entity identifiers.
// ======================================================

export const WORKSPACE_ENTITY_TYPES = Object.freeze({
  CLASS: "class",
  STUDENT: "student",
  DOCUMENT: "document",
  RESULT: "result",
});


// ======================================================
// DOCUMENT TYPES
// ======================================================

export const WORKSPACE_DOCUMENT_TYPES = Object.freeze({
  TEST: "test",
  HOMEWORK: "homework",
  NOTES: "notes",
  REPORT: "report",
  OTHER: "other",
});


// ======================================================
// DOCUMENT SOURCES
// ======================================================

export const WORKSPACE_DOCUMENT_SOURCES = Object.freeze({
  MANUAL: "manual",
  AI: "ai",
});


// ======================================================
// DOCUMENT STATUS
// ======================================================

export const WORKSPACE_DOCUMENT_STATUS = Object.freeze({
  DRAFT: "draft",
  READY: "ready",
  ARCHIVED: "archived",
});


// ======================================================
// DEFAULT CLASS
// ======================================================

export function createEmptyClass() {

  return {
    name: "",
    grade: "",
    subject: "",
    board: "",
    description: "",
  };

}


// ======================================================
// DEFAULT STUDENT
// ======================================================

export function createEmptyStudent() {

  return {
    name: "",
    classId: "",
    rollNumber: "",
    parentName: "",
    phone: "",
    email: "",
    performance: "",
    notes: "",
  };

}


// ======================================================
// DEFAULT DOCUMENT
// ======================================================

export function createEmptyDocument() {

  return {
    title: "",

    type:
      WORKSPACE_DOCUMENT_TYPES.NOTES,

    classId: "",
    studentId: "",

    subject: "",
    chapter: "",

    content: "",

    source:
      WORKSPACE_DOCUMENT_SOURCES.MANUAL,

    status:
      WORKSPACE_DOCUMENT_STATUS.DRAFT,

    aiMode: "",
  };

}


// ======================================================
// DEFAULT STUDENT RESULT
// ======================================================

export function createEmptyResult() {

  return {
    studentId: "",
    classId: "",

    title: "",
    subject: "",
    chapter: "",

    marksObtained: "",
    totalMarks: "",

    testDate: "",

    remarks: "",
  };

}