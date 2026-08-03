import {
  useState,
} from "react";

import WorkspaceHeader
  from "../components/WorkspaceHeader";

import WorkspaceOverview
  from "../components/WorkspaceOverview";

import WorkspaceClasses
  from "../components/WorkspaceClasses";

import WorkspaceStudents
  from "../components/WorkspaceStudents";

import WorkspaceDocuments
  from "../components/WorkspaceDocuments";

import useWorkspace
  from "../hooks/useWorkspace";


export default function Workspace() {

  const [
    activeTab,
    setActiveTab,
  ] = useState(
    "overview"
  );


  const [
    classCreateSignal,
    setClassCreateSignal,
  ] = useState(0);


  const [
    studentCreateSignal,
    setStudentCreateSignal,
  ] = useState(0);


  const [
    documentCreateSignal,
    setDocumentCreateSignal,
  ] = useState(0);


  const {
    classes,
    students,
    documents,

    loading,
    error,
    clearError,

    addClass,
    editClass,
    removeClass,

    addStudent,
    editStudent,
    removeStudent,

    addDocument,
    editDocument,
    removeDocument,
  } = useWorkspace();


  // ====================================================
  // GLOBAL CREATE BUTTON
  // ====================================================

  function handleCreate() {

    if (
      activeTab === "classes"
    ) {

      setClassCreateSignal(
        (value) =>
          value + 1
      );

      return;

    }


    if (
      activeTab === "students"
    ) {

      setStudentCreateSignal(
        (value) =>
          value + 1
      );

      return;

    }


    setActiveTab(
      "documents"
    );


    setDocumentCreateSignal(
      (value) =>
        value + 1
    );

  }


  if (loading) {

    return (

      <div
        className="
          flex
          min-h-full
          items-center
          justify-center
          bg-[#050816]
          p-8
          text-gray-400
        "
      >
        Loading Workspace...
      </div>

    );

  }


  return (

    <div
      className="
        flex
        min-h-full
        flex-col
        bg-[#050816]
        text-white
      "
    >

      <WorkspaceHeader
        activeTab={activeTab}
        onTabChange={
          setActiveTab
        }
        onCreate={
          handleCreate
        }
      />


      <main
        className="
          flex-1
          overflow-y-auto
          px-5
          py-7
          lg:px-8
        "
      >

        {error && (

          <div
            className="
              mb-6
              flex
              items-center
              justify-between
              gap-4
              rounded-xl
              border
              border-red-500/30
              bg-red-500/10
              px-4
              py-3
              text-sm
              text-red-300
            "
          >

            <span>
              {error}
            </span>


            <button
              type="button"
              onClick={
                clearError
              }
              className="
                shrink-0
                font-medium
                text-red-200
              "
            >
              Dismiss
            </button>

          </div>

        )}


        {activeTab ===
          "overview" && (

          <WorkspaceOverview
            classes={classes}
            students={students}
            documents={documents}
            onNavigate={
              setActiveTab
            }
          />

        )}


        {activeTab ===
          "classes" && (

          <WorkspaceClasses
            classes={classes}
            students={students}

            onAdd={addClass}
            onEdit={editClass}
            onDelete={removeClass}

            createSignal={
              classCreateSignal
            }
          />

        )}


        {activeTab ===
          "students" && (

          <WorkspaceStudents
            students={students}
            classes={classes}

            onAdd={addStudent}
            onEdit={editStudent}
            onDelete={removeStudent}

            createSignal={
              studentCreateSignal
            }
          />

        )}


        {activeTab ===
          "documents" && (

          <WorkspaceDocuments
            documents={documents}
            classes={classes}
            students={students}

            onAdd={addDocument}
            onEdit={editDocument}
            onDelete={removeDocument}

            createSignal={
              documentCreateSignal
            }
          />

        )}

      </main>

    </div>

  );

}