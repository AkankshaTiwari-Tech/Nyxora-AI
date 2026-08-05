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
    results,

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

    addResult,
    editResult,
    removeResult,
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


  // ====================================================
  // LOADING STATE
  // ====================================================

  if (loading) {

    return (

      <div
        className="
          relative
          flex
          min-h-full
          items-center
          justify-center
          overflow-hidden
          bg-[#050816]
          p-8
        "
      >

        {/* FUCHSIA AMBIENT GLOW */}

        <div
          className="
            pointer-events-none
            absolute
            left-[15%]
            top-[20%]
            h-72
            w-72
            rounded-full
            bg-fuchsia-600/10
            blur-[120px]
          "
        />


        {/* CYAN AMBIENT GLOW */}

        <div
          className="
            pointer-events-none
            absolute
            bottom-[15%]
            right-[15%]
            h-72
            w-72
            rounded-full
            bg-cyan-500/10
            blur-[120px]
          "
        />


        {/* LOADING CARD */}

        <div
          className="
            relative
            z-10
            flex
            items-center
            gap-3
            rounded-2xl
            border
            border-violet-400/20
            bg-white/[0.03]
            px-5
            py-4
            text-sm
            text-gray-300
            shadow-xl
            shadow-violet-950/20
            backdrop-blur-xl
          "
        >

          <div
            className="
              flex
              items-center
              gap-1.5
            "
          >

            <span
              className="
                h-2
                w-2
                animate-bounce
                rounded-full
                bg-fuchsia-400
                shadow-[0_0_8px_rgba(232,121,249,.55)]
              "
            />


            <span
              className="
                h-2
                w-2
                animate-bounce
                rounded-full
                bg-violet-400
                shadow-[0_0_8px_rgba(167,139,250,.55)]
                [animation-delay:150ms]
              "
            />


            <span
              className="
                h-2
                w-2
                animate-bounce
                rounded-full
                bg-cyan-400
                shadow-[0_0_8px_rgba(34,211,238,.55)]
                [animation-delay:300ms]
              "
            />

          </div>


          <span>
            Loading Workspace...
          </span>

        </div>

      </div>

    );

  }


  // ====================================================
  // WORKSPACE
  // ====================================================

  return (

    <div
      className="
        relative
        flex
        min-h-full
        flex-col
        overflow-hidden
        bg-[#050816]
        text-white
      "
    >

      {/* =================================================
          NYXORA WORKSPACE AMBIENT BACKGROUND
      ================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -left-32
          top-24
          h-96
          w-96
          rounded-full
          bg-fuchsia-600/[0.07]
          blur-[140px]
        "
      />


      <div
        className="
          pointer-events-none
          absolute
          right-[-120px]
          top-[35%]
          h-96
          w-96
          rounded-full
          bg-cyan-500/[0.07]
          blur-[140px]
        "
      />


      <div
        className="
          pointer-events-none
          absolute
          bottom-[-180px]
          left-[35%]
          h-96
          w-96
          rounded-full
          bg-violet-600/[0.06]
          blur-[150px]
        "
      />


      {/* =================================================
          WORKSPACE HEADER
      ================================================== */}

      <div
        className="
          relative
          z-10
        "
      >

        <WorkspaceHeader
          activeTab={
            activeTab
          }

          onTabChange={
            setActiveTab
          }

          onCreate={
            handleCreate
          }
        />

      </div>


      {/* =================================================
          WORKSPACE CONTENT
      ================================================== */}

      <main
        className="
          relative
          z-10
          flex-1
          overflow-y-auto
          px-5
          py-7
          lg:px-8
        "
      >

        {/* ===============================================
            ERROR
        ================================================ */}

        {error && (

          <div
            className="
              mb-6
              flex
              items-center
              justify-between
              gap-4
              rounded-2xl
              border
              border-red-400/25
              bg-red-500/[0.08]
              px-4
              py-3
              text-sm
              text-red-300
              shadow-lg
              shadow-red-950/10
              backdrop-blur-xl
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
                rounded-lg
                px-3
                py-1.5
                font-medium
                text-red-200
                transition
                hover:bg-red-400/10
                hover:text-white
              "
            >
              Dismiss
            </button>

          </div>

        )}


        {/* ===============================================
            OVERVIEW
        ================================================ */}

        {activeTab ===
          "overview" && (

          <WorkspaceOverview
            classes={
              classes
            }

            students={
              students
            }

            documents={
              documents
            }

            onNavigate={
              setActiveTab
            }
          />

        )}


        {/* ===============================================
            CLASSES
        ================================================ */}

        {activeTab ===
          "classes" && (

          <WorkspaceClasses
            classes={
              classes
            }

            students={
              students
            }

            onAdd={
              addClass
            }

            onEdit={
              editClass
            }

            onDelete={
              removeClass
            }

            createSignal={
              classCreateSignal
            }
          />

        )}


        {/* ===============================================
            STUDENTS
        ================================================ */}

        {activeTab ===
          "students" && (

          <WorkspaceStudents
            students={
              students
            }

            classes={
              classes
            }

            results={
              results
            }

            onAdd={
              addStudent
            }

            onEdit={
              editStudent
            }

            onDelete={
              removeStudent
            }

            onAddResult={
              addResult
            }

            onEditResult={
              editResult
            }

            onDeleteResult={
              removeResult
            }

            createSignal={
              studentCreateSignal
            }
          />

        )}


        {/* ===============================================
            DOCUMENTS
        ================================================ */}

        {activeTab ===
          "documents" && (

          <WorkspaceDocuments
            documents={
              documents
            }

            classes={
              classes
            }

            students={
              students
            }

            onAdd={
              addDocument
            }

            onEdit={
              editDocument
            }

            onDelete={
              removeDocument
            }

            createSignal={
              documentCreateSignal
            }
          />

        )}

      </main>

    </div>

  );

}