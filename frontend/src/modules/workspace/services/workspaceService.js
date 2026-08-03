import {
  createWorkspaceItem,
  deleteWorkspaceItem,
  subscribeToClasses,
  subscribeToDocuments,
  subscribeToStudents,
  updateWorkspaceItem,
} from "../firebase/workspaceFirestore";

import {
  WORKSPACE_COLLECTIONS,
  WORKSPACE_LIMITS,
} from "../constants/workspaceConstants";

import {
  WORKSPACE_DOCUMENT_SOURCES,
  WORKSPACE_DOCUMENT_STATUS,
  WORKSPACE_DOCUMENT_TYPES,
} from "../types/workspaceTypes";


// ======================================================
// HELPERS
// ======================================================

function cleanString(
  value
) {

  if (
    value === null ||
    value === undefined
  ) {

    return "";

  }


  return String(
    value
  ).trim();

}


function limitString(
  value,
  maxLength
) {

  return cleanString(
    value
  ).slice(
    0,
    maxLength
  );

}


// ======================================================
// CLASS NORMALIZER
// ======================================================

function normalizeClass(
  data = {}
) {

  const name =
    limitString(
      data.name,
      WORKSPACE_LIMITS.CLASS_NAME
    );


  if (!name) {

    throw new Error(
      "Class name is required."
    );

  }


  return {
    name,

    grade:
      cleanString(
        data.grade
      ),

    subject:
      limitString(
        data.subject,
        WORKSPACE_LIMITS.SUBJECT
      ),

    board:
      cleanString(
        data.board
      ),

    description:
      cleanString(
        data.description
      ),
  };

}


// ======================================================
// STUDENT NORMALIZER
// ======================================================

function normalizeStudent(
  data = {}
) {

  const name =
    limitString(
      data.name,
      WORKSPACE_LIMITS.STUDENT_NAME
    );


  if (!name) {

    throw new Error(
      "Student name is required."
    );

  }


  return {
    name,

    classId:
      cleanString(
        data.classId
      ),

    rollNumber:
      cleanString(
        data.rollNumber
      ),

    parentName:
      cleanString(
        data.parentName
      ),

    phone:
      cleanString(
        data.phone
      ),

    email:
      cleanString(
        data.email
      ),

    performance:
      cleanString(
        data.performance
      ),

    notes:
      cleanString(
        data.notes
      ),
  };

}


// ======================================================
// DOCUMENT NORMALIZER
// ======================================================

function normalizeDocument(
  data = {}
) {

  const title =
    limitString(
      data.title,
      WORKSPACE_LIMITS.DOCUMENT_TITLE
    );


  if (!title) {

    throw new Error(
      "Document title is required."
    );

  }


  const validTypes =
    Object.values(
      WORKSPACE_DOCUMENT_TYPES
    );


  const type =
    validTypes.includes(
      data.type
    )
      ? data.type
      : WORKSPACE_DOCUMENT_TYPES.NOTES;


  return {
    title,

    type,

    classId:
      cleanString(
        data.classId
      ),

    studentId:
      cleanString(
        data.studentId
      ),

    subject:
      limitString(
        data.subject,
        WORKSPACE_LIMITS.SUBJECT
      ),

    chapter:
      limitString(
        data.chapter,
        WORKSPACE_LIMITS.CHAPTER
      ),

    content:
      cleanString(
        data.content
      ),

    source:
      data.source ===
      WORKSPACE_DOCUMENT_SOURCES.AI
        ? WORKSPACE_DOCUMENT_SOURCES.AI
        : WORKSPACE_DOCUMENT_SOURCES.MANUAL,

    status:
      Object.values(
        WORKSPACE_DOCUMENT_STATUS
      ).includes(
        data.status
      )
        ? data.status
        : WORKSPACE_DOCUMENT_STATUS.DRAFT,

    aiMode:
      cleanString(
        data.aiMode
      ),
  };

}


// ======================================================
// CLASS CRUD
// ======================================================

export async function createClass(
  data
) {

  return createWorkspaceItem(
    WORKSPACE_COLLECTIONS.CLASSES,
    normalizeClass(
      data
    )
  );

}


export async function updateClass(
  classId,
  data
) {

  return updateWorkspaceItem(
    WORKSPACE_COLLECTIONS.CLASSES,
    classId,
    normalizeClass(
      data
    )
  );

}


export async function deleteClass(
  classId
) {

  return deleteWorkspaceItem(
    WORKSPACE_COLLECTIONS.CLASSES,
    classId
  );

}


// ======================================================
// STUDENT CRUD
// ======================================================

export async function createStudent(
  data
) {

  return createWorkspaceItem(
    WORKSPACE_COLLECTIONS.STUDENTS,
    normalizeStudent(
      data
    )
  );

}


export async function updateStudent(
  studentId,
  data
) {

  return updateWorkspaceItem(
    WORKSPACE_COLLECTIONS.STUDENTS,
    studentId,
    normalizeStudent(
      data
    )
  );

}


export async function deleteStudent(
  studentId
) {

  return deleteWorkspaceItem(
    WORKSPACE_COLLECTIONS.STUDENTS,
    studentId
  );

}


// ======================================================
// DOCUMENT CRUD
// ======================================================

export async function createDocument(
  data
) {

  return createWorkspaceItem(
    WORKSPACE_COLLECTIONS.DOCUMENTS,
    normalizeDocument(
      data
    )
  );

}


export async function updateDocument(
  documentId,
  data
) {

  return updateWorkspaceItem(
    WORKSPACE_COLLECTIONS.DOCUMENTS,
    documentId,
    normalizeDocument(
      data
    )
  );

}


export async function deleteDocument(
  documentId
) {

  return deleteWorkspaceItem(
    WORKSPACE_COLLECTIONS.DOCUMENTS,
    documentId
  );

}


// ======================================================
// AI GENERATED DOCUMENT
// ======================================================

export async function saveAiDocument({
  title,
  type,
  content,

  classId = "",
  studentId = "",

  subject = "",
  chapter = "",

  aiMode = "",
}) {

  return createDocument({
    title,
    type,
    content,

    classId,
    studentId,

    subject,
    chapter,

    aiMode,

    source:
      WORKSPACE_DOCUMENT_SOURCES.AI,

    status:
      WORKSPACE_DOCUMENT_STATUS.READY,
  });

}


// ======================================================
// REALTIME SUBSCRIPTIONS
// ======================================================

export const watchClasses =
  subscribeToClasses;


export const watchStudents =
  subscribeToStudents;


export const watchDocuments =
  subscribeToDocuments;