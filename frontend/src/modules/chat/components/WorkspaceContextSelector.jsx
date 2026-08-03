import {
  BookOpen,
  ChevronDown,
  GraduationCap,
  UserRound,
  X,
} from "lucide-react";

import {
  useEffect,
  useRef,
  useState,
} from "react";


export default function WorkspaceContextSelector({
  classes = [],
  students = [],

  selectedClassId = "",
  selectedStudentId = "",

  onClassChange,
  onStudentChange,
}) {

  const [
    open,
    setOpen,
  ] = useState(false);


  const containerRef =
    useRef(null);


  const selectedClass =
    classes.find(
      (item) =>
        item.id ===
        selectedClassId
    );


  const selectedStudent =
    students.find(
      (item) =>
        item.id ===
        selectedStudentId
    );


  // ====================================================
  // STUDENTS FROM SELECTED CLASS ONLY
  // ====================================================

  const availableStudents =
    selectedClassId

      ? students.filter(
          (student) =>
            student.classId ===
            selectedClassId
        )

      : [];


  // ====================================================
  // OUTSIDE CLICK
  // ====================================================

  useEffect(() => {

    const handleOutsideClick =
      (
        event
      ) => {

        if (
          containerRef.current &&
          !containerRef.current.contains(
            event.target
          )
        ) {

          setOpen(
            false
          );

        }

      };


    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );


    return () => {

      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );

    };

  }, []);


  // ====================================================
  // CHANGE CLASS
  // ====================================================

  function changeClass(
    classId
  ) {

    onClassChange?.(
      classId
    );


    if (
      !classId
    ) {

      onStudentChange?.(
        ""
      );

      return;

    }


    if (
      selectedStudentId
    ) {

      const student =
        students.find(
          (item) =>
            item.id ===
            selectedStudentId
        );


      if (
        student?.classId !==
        classId
      ) {

        onStudentChange?.(
          ""
        );

      }

    }

  }


  // ====================================================
  // CLEAR
  // ====================================================

  function clearContext() {

    onClassChange?.(
      ""
    );

    onStudentChange?.(
      ""
    );

  }


  const hasContext =
    Boolean(
      selectedClass ||
      selectedStudent
    );


  return (

    <div
      ref={
        containerRef
      }

      className="relative"
    >

      <button
        type="button"

        onClick={() =>
          setOpen(
            (current) =>
              !current
          )
        }

        className={`
          flex
          h-12
          max-w-[260px]
          items-center
          gap-2
          rounded-xl
          border
          px-3
          text-sm
          transition

          ${
            hasContext
              ? `
                border-violet-500/50
                bg-violet-500/10
                text-violet-200
              `
              : `
                border-[#303A55]
                bg-[#111827]
                text-gray-400
                hover:border-violet-500/50
                hover:text-white
              `
          }
        `}
      >

        <GraduationCap
          size={17}
          className="shrink-0"
        />


        <span className="truncate">

          {selectedStudent
            ? selectedStudent.name

            : selectedClass
              ? selectedClass.name

              : "Workspace Context"}

        </span>


        <ChevronDown
          size={15}

          className={`
            ml-auto
            shrink-0
            transition-transform

            ${
              open
                ? "rotate-180"
                : ""
            }
          `}
        />

      </button>


      {open && (

        <div
          className="
            absolute
            right-0
            top-[58px]
            z-[70]
            w-[340px]
            rounded-2xl
            border
            border-[#293149]
            bg-[#0D1322]
            p-4
            shadow-2xl
          "
        >

          <div
            className="
              mb-4
              flex
              items-start
              justify-between
              gap-4
            "
          >

            <div>

              <h3 className="font-semibold text-white">
                Workspace Context
              </h3>


              <p
                className="
                  mt-1
                  text-xs
                  leading-5
                  text-gray-500
                "
              >
                Connect this conversation with a class
                or student from your Workspace.
              </p>

            </div>


            <button
              type="button"

              onClick={() =>
                setOpen(
                  false
                )
              }

              className="
                rounded-lg
                p-1.5
                text-gray-500
                hover:bg-white/5
                hover:text-white
              "

              aria-label="Close Workspace context"
            >

              <X size={16} />

            </button>

          </div>


          {/* CLASS */}

          <label className="block space-y-2">

            <span
              className="
                flex
                items-center
                gap-2
                text-xs
                font-medium
                uppercase
                tracking-wider
                text-gray-500
              "
            >

              <BookOpen size={13} />

              Class

            </span>


            <select
              value={
                selectedClassId
              }

              onChange={(event) =>
                changeClass(
                  event.target.value
                )
              }

              className="
                w-full
                rounded-xl
                border
                border-[#303A55]
                bg-[#111827]
                px-3
                py-2.5
                text-sm
                text-white
                outline-none
                focus:border-violet-500
              "
            >

              <option value="">
                No class selected
              </option>


              {classes.map(
                (item) => (

                  <option
                    key={
                      item.id
                    }

                    value={
                      item.id
                    }
                  >
                    {item.name}
                  </option>

                )
              )}

            </select>

          </label>


          {/* STUDENT */}

          <label className="mt-4 block space-y-2">

            <span
              className="
                flex
                items-center
                gap-2
                text-xs
                font-medium
                uppercase
                tracking-wider
                text-gray-500
              "
            >

              <UserRound size={13} />

              Student

            </span>


            <select
              value={
                selectedStudentId
              }

              disabled={
                !selectedClassId
              }

              onChange={(event) =>
                onStudentChange?.(
                  event.target.value
                )
              }

              className="
                w-full
                rounded-xl
                border
                border-[#303A55]
                bg-[#111827]
                px-3
                py-2.5
                text-sm
                text-white
                outline-none
                disabled:cursor-not-allowed
                disabled:opacity-50
                focus:border-violet-500
              "
            >

              <option value="">

                {selectedClassId
                  ? "No student selected"
                  : "Select a class first"}

              </option>


              {availableStudents.map(
                (student) => (

                  <option
                    key={
                      student.id
                    }

                    value={
                      student.id
                    }
                  >
                    {student.name}
                  </option>

                )
              )}

            </select>

          </label>


          {hasContext && (

            <div
              className="
                mt-4
                rounded-xl
                border
                border-violet-500/20
                bg-violet-500/[0.07]
                p-3
              "
            >

              <p
                className="
                  text-xs
                  font-medium
                  text-violet-300
                "
              >
                Context enabled
              </p>


              {selectedClass && (

                <p
                  className="
                    mt-2
                    text-xs
                    text-gray-400
                  "
                >
                  Class:{" "}

                  <span className="text-gray-200">
                    {selectedClass.name}
                  </span>
                </p>

              )}


              {selectedStudent && (

                <p
                  className="
                    mt-1
                    text-xs
                    text-gray-400
                  "
                >
                  Student:{" "}

                  <span className="text-gray-200">
                    {selectedStudent.name}
                  </span>
                </p>

              )}


              <button
                type="button"

                onClick={
                  clearContext
                }

                className="
                  mt-3
                  text-xs
                  font-medium
                  text-red-400
                  hover:text-red-300
                "
              >
                Clear context
              </button>

            </div>

          )}

        </div>

      )}

    </div>

  );

}