import {
  WORKSPACE_DOCUMENT_TYPES,
} from "../types/workspaceTypes";


// ======================================================
// FIRESTORE COLLECTION NAMES
// ======================================================

export const WORKSPACE_COLLECTIONS =
  Object.freeze({

    CLASSES:
      "classes",

    STUDENTS:
      "students",

    DOCUMENTS:
      "documents",

    RESULTS:
      "results",

  });


// ======================================================
// DOCUMENT TYPE OPTIONS
// ======================================================

export const WORKSPACE_DOCUMENT_TYPE_OPTIONS =
  Object.freeze([

    {
      value:
        WORKSPACE_DOCUMENT_TYPES.TEST,

      label:
        "Test",

      emoji:
        "📝",
    },

    {
      value:
        WORKSPACE_DOCUMENT_TYPES.HOMEWORK,

      label:
        "Homework",

      emoji:
        "📚",
    },

    {
      value:
        WORKSPACE_DOCUMENT_TYPES.NOTES,

      label:
        "Notes",

      emoji:
        "📄",
    },

    {
      value:
        WORKSPACE_DOCUMENT_TYPES.REPORT,

      label:
        "Student Report",

      emoji:
        "📊",
    },

    {
      value:
        WORKSPACE_DOCUMENT_TYPES.OTHER,

      label:
        "Other",

      emoji:
        "📁",
    },

  ]);


// ======================================================
// SUPPORTED BOARDS
// ======================================================

export const WORKSPACE_BOARD_OPTIONS =
  Object.freeze([

    "CBSE",
    "ICSE",
    "State Board",
    "Other",

  ]);


// ======================================================
// AI MODE -> WORKSPACE DOCUMENT
// ======================================================

export const AI_MODE_DOCUMENT_MAP =
  Object.freeze({

    test:
      WORKSPACE_DOCUMENT_TYPES.TEST,

    homework:
      WORKSPACE_DOCUMENT_TYPES.HOMEWORK,

    report:
      WORKSPACE_DOCUMENT_TYPES.REPORT,

    teacher:
      WORKSPACE_DOCUMENT_TYPES.NOTES,

  });


// ======================================================
// LIMITS
// ======================================================

export const WORKSPACE_LIMITS =
  Object.freeze({

    CLASS_NAME: 80,

    STUDENT_NAME: 100,

    DOCUMENT_TITLE: 150,

    SUBJECT: 80,

    CHAPTER: 150,

  });