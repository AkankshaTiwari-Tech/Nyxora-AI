import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  createClass,
  createDocument,
  createStudent,

  deleteClass,
  deleteDocument,
  deleteStudent,

  saveAiDocument,

  updateClass,
  updateDocument,
  updateStudent,

  watchClasses,
  watchDocuments,
  watchStudents,
} from "../services/workspaceService";


// ======================================================
// WORKSPACE HOOK
// ======================================================

export default function useWorkspace() {

  // ====================================================
  // DATA
  // ====================================================

  const [
    classes,
    setClasses,
  ] = useState([]);


  const [
    students,
    setStudents,
  ] = useState([]);


  const [
    documents,
    setDocuments,
  ] = useState([]);


  // ====================================================
  // STATUS
  // ====================================================

  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    error,
    setError,
  ] = useState("");


  // ====================================================
  // LOAD TRACKING
  // ====================================================

  useEffect(() => {

    let classesLoaded =
      false;

    let studentsLoaded =
      false;

    let documentsLoaded =
      false;


    const updateLoading =
      () => {

        if (
          classesLoaded &&
          studentsLoaded &&
          documentsLoaded
        ) {

          setLoading(
            false
          );

        }

      };


    const handleError =
      (err) => {

        console.error(
          "Workspace realtime error:",
          err
        );


        setError(
          err?.message ||
          "Could not load Workspace."
        );


        setLoading(
          false
        );

      };


    let unsubscribeClasses;

    let unsubscribeStudents;

    let unsubscribeDocuments;


    try {

      unsubscribeClasses =
        watchClasses(
          (items) => {

            setClasses(
              items
            );


            classesLoaded =
              true;


            updateLoading();

          },

          handleError
        );


      unsubscribeStudents =
        watchStudents(
          (items) => {

            setStudents(
              items
            );


            studentsLoaded =
              true;


            updateLoading();

          },

          handleError
        );


      unsubscribeDocuments =
        watchDocuments(
          (items) => {

            setDocuments(
              items
            );


            documentsLoaded =
              true;


            updateLoading();

          },

          handleError
        );

    } catch (err) {

      handleError(
        err
      );

    }


    return () => {

      unsubscribeClasses?.();

      unsubscribeStudents?.();

      unsubscribeDocuments?.();

    };

  }, []);


  // ====================================================
  // ERROR CONTROL
  // ====================================================

  const clearError =
    useCallback(
      () => {

        setError("");

      },
      []
    );


  // ====================================================
  // SAFE ACTION
  // ====================================================

  const runAction =
    useCallback(
      async (
        action
      ) => {

        try {

          setError("");


          return await action();

        } catch (err) {

          console.error(
            "Workspace action error:",
            err
          );


          setError(
            err?.message ||
            "Workspace action failed."
          );


          throw err;

        }

      },
      []
    );


  // ====================================================
  // CLASS ACTIONS
  // ====================================================

  const addClass =
    useCallback(
      (data) =>
        runAction(
          () =>
            createClass(
              data
            )
        ),
      [
        runAction,
      ]
    );


  const editClass =
    useCallback(
      (
        classId,
        data
      ) =>
        runAction(
          () =>
            updateClass(
              classId,
              data
            )
        ),
      [
        runAction,
      ]
    );


  const removeClass =
    useCallback(
      (classId) =>
        runAction(
          () =>
            deleteClass(
              classId
            )
        ),
      [
        runAction,
      ]
    );


  // ====================================================
  // STUDENT ACTIONS
  // ====================================================

  const addStudent =
    useCallback(
      (data) =>
        runAction(
          () =>
            createStudent(
              data
            )
        ),
      [
        runAction,
      ]
    );


  const editStudent =
    useCallback(
      (
        studentId,
        data
      ) =>
        runAction(
          () =>
            updateStudent(
              studentId,
              data
            )
        ),
      [
        runAction,
      ]
    );


  const removeStudent =
    useCallback(
      (studentId) =>
        runAction(
          () =>
            deleteStudent(
              studentId
            )
        ),
      [
        runAction,
      ]
    );


  // ====================================================
  // DOCUMENT ACTIONS
  // ====================================================

  const addDocument =
    useCallback(
      (data) =>
        runAction(
          () =>
            createDocument(
              data
            )
        ),
      [
        runAction,
      ]
    );


  const editDocument =
    useCallback(
      (
        documentId,
        data
      ) =>
        runAction(
          () =>
            updateDocument(
              documentId,
              data
            )
        ),
      [
        runAction,
      ]
    );


  const removeDocument =
    useCallback(
      (documentId) =>
        runAction(
          () =>
            deleteDocument(
              documentId
            )
        ),
      [
        runAction,
      ]
    );


  const addAiDocument =
    useCallback(
      (data) =>
        runAction(
          () =>
            saveAiDocument(
              data
            )
        ),
      [
        runAction,
      ]
    );


  // ====================================================
  // RELATION HELPERS
  // ====================================================

  const getClassById =
    useCallback(
      (classId) =>
        classes.find(
          (item) =>
            item.id ===
            classId
        ) ||
        null,
      [
        classes,
      ]
    );


  const getStudentById =
    useCallback(
      (studentId) =>
        students.find(
          (item) =>
            item.id ===
            studentId
        ) ||
        null,
      [
        students,
      ]
    );


  const getStudentsByClass =
    useCallback(
      (classId) =>
        students.filter(
          (student) =>
            student.classId ===
            classId
        ),
      [
        students,
      ]
    );


  const getDocumentsByClass =
    useCallback(
      (classId) =>
        documents.filter(
          (document) =>
            document.classId ===
            classId
        ),
      [
        documents,
      ]
    );


  const getDocumentsByStudent =
    useCallback(
      (studentId) =>
        documents.filter(
          (document) =>
            document.studentId ===
            studentId
        ),
      [
        documents,
      ]
    );


  // ====================================================
  // AI CONTEXT
  //
  // Later useChat.js can send this structured context
  // to Nyxora instead of duplicating Workspace logic.
  // ====================================================

  const aiContext =
    useMemo(
      () => ({

        classes:
          classes.map(
            (item) => ({
              id:
                item.id,

              name:
                item.name,

              grade:
                item.grade,

              subject:
                item.subject,

              board:
                item.board,
            })
          ),


        students:
          students.map(
            (item) => ({
              id:
                item.id,

              name:
                item.name,

              classId:
                item.classId,

              performance:
                item.performance,

              notes:
                item.notes,
            })
          ),


        documents:
          documents.map(
            (item) => ({
              id:
                item.id,

              title:
                item.title,

              type:
                item.type,

              classId:
                item.classId,

              studentId:
                item.studentId,

              subject:
                item.subject,

              chapter:
                item.chapter,

              source:
                item.source,

              status:
                item.status,
            })
          ),

      }),
      [
        classes,
        students,
        documents,
      ]
    );


  // ====================================================
  // RETURN
  // ====================================================

  return {

    // Data

    classes,
    students,
    documents,


    // Status

    loading,
    error,
    clearError,


    // Classes

    addClass,
    editClass,
    removeClass,


    // Students

    addStudent,
    editStudent,
    removeStudent,


    // Documents

    addDocument,
    editDocument,
    removeDocument,

    addAiDocument,


    // Relations

    getClassById,
    getStudentById,

    getStudentsByClass,

    getDocumentsByClass,
    getDocumentsByStudent,


    // AI

    aiContext,

  };

}