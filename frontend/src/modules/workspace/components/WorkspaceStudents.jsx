import {
  useMemo,
  useState,
} from "react";

import {
  BarChart3,
  CalendarDays,
  Pencil,
  Plus,
  Search,
  Trash2,
  Trophy,
  UserRound,
  X,
} from "lucide-react";

import {
  createEmptyResult,
  createEmptyStudent,
} from "../types/workspaceTypes";


const inputClass = `
  w-full
  rounded-xl
  border
  border-[#303A55]
  bg-[#111827]
  px-4
  py-3
  text-white
  outline-none
  placeholder:text-gray-600
  focus:border-violet-500
`;


// ======================================================
// WORKSPACE STUDENTS
// ======================================================

export default function WorkspaceStudents({
  students,
  classes,
  results = [],

  onAdd,
  onEdit,
  onDelete,

  onAddResult,
  onEditResult,
  onDeleteResult,

  createSignal = 0,
}) {

  const [
    search,
    setSearch,
  ] = useState("");


  const [
    formOpen,
    setFormOpen,
  ] = useState(false);


  const [
    lastSignal,
    setLastSignal,
  ] = useState(createSignal);


  const [
    editingId,
    setEditingId,
  ] = useState(null);


  const [
    form,
    setForm,
  ] = useState(
    createEmptyStudent()
  );


  const [
    saving,
    setSaving,
  ] = useState(false);


  // ====================================================
  // RESULT FORM
  // ====================================================

  const [
    resultFormOpen,
    setResultFormOpen,
  ] = useState(false);


  const [
    resultStudent,
    setResultStudent,
  ] = useState(null);


  const [
    editingResultId,
    setEditingResultId,
  ] = useState(null);


  const [
    resultForm,
    setResultForm,
  ] = useState(
    createEmptyResult()
  );


  const [
    savingResult,
    setSavingResult,
  ] = useState(false);


  // ====================================================
  // GLOBAL CREATE SIGNAL
  // ====================================================

  if (
    createSignal !==
    lastSignal
  ) {

    setLastSignal(
      createSignal
    );

    setEditingId(null);

    setForm(
      createEmptyStudent()
    );

    setFormOpen(true);

  }


  // ====================================================
  // CLASS MAP
  // ====================================================

  const classMap =
    useMemo(
      () =>
        Object.fromEntries(
          classes.map(
            (item) => [
              item.id,
              item,
            ]
          )
        ),
      [classes]
    );


  // ====================================================
  // SEARCH
  // ====================================================

  const visibleStudents =
    useMemo(
      () => {

        const query =
          search
            .trim()
            .toLowerCase();


        if (!query) {

          return students;

        }


        return students.filter(
          (student) => {

            const className =
              classMap[
                student.classId
              ]?.name || "";


            return [
              student.name,
              student.rollNumber,
              student.parentName,
              student.phone,
              className,
            ]
              .filter(Boolean)
              .join(" ")
              .toLowerCase()
              .includes(query);

          }
        );

      },
      [
        students,
        search,
        classMap,
      ]
    );


  // ====================================================
  // STUDENT RESULTS
  // ====================================================

  function getStudentResults(
    studentId
  ) {

    return results.filter(
      (result) =>
        result.studentId ===
        studentId
    );

  }


  function getPercentage(
    result
  ) {

    const obtained =
      Number(
        result.marksObtained
      );


    const total =
      Number(
        result.totalMarks
      );


    if (
      !Number.isFinite(obtained) ||
      !Number.isFinite(total) ||
      total <= 0
    ) {

      return 0;

    }


    return Math.round(
      (obtained / total) *
      100
    );

  }


  function getAverage(
    studentId
  ) {

    const studentResults =
      getStudentResults(
        studentId
      );


    if (
      studentResults.length === 0
    ) {

      return null;

    }


    const percentages =
      studentResults.map(
        getPercentage
      );


    return Math.round(
      percentages.reduce(
        (total, value) =>
          total + value,
        0
      ) /
      percentages.length
    );

  }


  // ====================================================
  // STUDENT CREATE
  // ====================================================

  function openCreate() {

    setEditingId(null);

    setForm(
      createEmptyStudent()
    );

    setFormOpen(true);

  }


  // ====================================================
  // STUDENT EDIT
  // ====================================================

  function openEdit(
    student
  ) {

    setEditingId(
      student.id
    );


    setForm({
      name:
        student.name || "",

      classId:
        student.classId || "",

      rollNumber:
        student.rollNumber || "",

      parentName:
        student.parentName || "",

      phone:
        student.phone || "",

      email:
        student.email || "",

      performance:
        student.performance || "",

      notes:
        student.notes || "",
    });


    setFormOpen(true);

  }


  function update(
    key,
    value
  ) {

    setForm(
      (current) => ({
        ...current,
        [key]: value,
      })
    );

  }


  function close() {

    setFormOpen(false);

    setEditingId(null);

  }


  // ====================================================
  // STUDENT SUBMIT
  // ====================================================

  async function submit(
    event
  ) {

    event.preventDefault();


    if (
      !form.name.trim()
    ) {

      return;

    }


    try {

      setSaving(true);


      if (editingId) {

        await onEdit(
          editingId,
          form
        );

      } else {

        await onAdd(
          form
        );

      }


      close();

    } finally {

      setSaving(false);

    }

  }


  // ====================================================
  // STUDENT DELETE
  // ====================================================

  async function remove(
    student
  ) {

    if (
      !window.confirm(
        `Delete "${student.name}"?`
      )
    ) {

      return;

    }


    await onDelete(
      student.id
    );

  }


  // ====================================================
  // OPEN RESULT CREATE
  // ====================================================

  function openResultCreate(
    student
  ) {

    const studentClass =
      classMap[
        student.classId
      ];


    setResultStudent(
      student
    );


    setEditingResultId(
      null
    );


    setResultForm({
      ...createEmptyResult(),

      studentId:
        student.id,

      classId:
        student.classId || "",

      subject:
        studentClass
          ?.subject ||
        "",
    });


    setResultFormOpen(
      true
    );

  }


  // ====================================================
  // OPEN RESULT EDIT
  // ====================================================

  function openResultEdit(
    student,
    result
  ) {

    setResultStudent(
      student
    );


    setEditingResultId(
      result.id
    );


    setResultForm({
      studentId:
        result.studentId || "",

      classId:
        result.classId || "",

      title:
        result.title || "",

      subject:
        result.subject || "",

      chapter:
        result.chapter || "",

      marksObtained:
        result.marksObtained ?? "",

      totalMarks:
        result.totalMarks ?? "",

      testDate:
        result.testDate || "",

      remarks:
        result.remarks || "",
    });


    setResultFormOpen(
      true
    );

  }


  function updateResultForm(
    key,
    value
  ) {

    setResultForm(
      (current) => ({
        ...current,
        [key]: value,
      })
    );

  }


  function closeResultForm() {

    setResultFormOpen(
      false
    );

    setResultStudent(
      null
    );

    setEditingResultId(
      null
    );

    setResultForm(
      createEmptyResult()
    );

  }


  // ====================================================
  // RESULT SUBMIT
  // ====================================================

  async function submitResult(
    event
  ) {

    event.preventDefault();


    if (
      !resultForm.title.trim()
    ) {

      return;

    }


    try {

      setSavingResult(
        true
      );


      if (
        editingResultId
      ) {

        await onEditResult(
          editingResultId,
          resultForm
        );

      } else {

        await onAddResult(
          resultForm
        );

      }


      closeResultForm();

    } catch (error) {

      console.error(
        "Result save error:",
        error
      );

    } finally {

      setSavingResult(
        false
      );

    }

  }


  // ====================================================
  // RESULT DELETE
  // ====================================================

  async function removeResult(
    result
  ) {

    if (
      !window.confirm(
        `Delete result "${result.title}"?`
      )
    ) {

      return;

    }


    await onDeleteResult(
      result.id
    );

  }


  // ====================================================
  // UI
  // ====================================================

  return (

    <section>

      <div
        className="
          mb-6
          flex
          flex-wrap
          items-end
          justify-between
          gap-4
        "
      >

        <div>

          <h2 className="text-xl font-semibold text-white">
            Students
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Manage student profiles, test results and AI-ready performance data.
          </p>

        </div>


        <button
          type="button"
          onClick={openCreate}
          className="
            flex
            items-center
            gap-2
            rounded-xl
            bg-violet-600
            px-4
            py-2.5
            text-sm
            font-medium
            text-white
          "
        >
          <Plus size={17} />

          Add Student
        </button>

      </div>


      {/* ============================================= */}
      {/* STUDENT FORM */}
      {/* ============================================= */}

      {formOpen && (

        <form
          onSubmit={submit}
          className="
            mb-6
            rounded-2xl
            border
            border-[#293149]
            bg-[#0D1322]
            p-5
          "
        >

          <div
            className="
              mb-5
              flex
              items-center
              justify-between
            "
          >

            <h3 className="font-semibold text-white">
              {editingId
                ? "Edit Student"
                : "Add Student"}
            </h3>


            <button
              type="button"
              onClick={close}
              className="text-gray-500 hover:text-white"
            >
              <X size={19} />
            </button>

          </div>


          <div
            className="
              grid
              gap-4
              md:grid-cols-2
            "
          >

            <Field
              label="Student Name"
              required
              value={form.name}
              onChange={(value) =>
                update(
                  "name",
                  value
                )
              }
            />


            <label className="space-y-2">

              <span className="text-sm text-gray-400">
                Class
              </span>


              <select
                value={form.classId}
                onChange={(event) =>
                  update(
                    "classId",
                    event.target.value
                  )
                }
                className={inputClass}
              >

                <option value="">
                  No class assigned
                </option>


                {classes.map(
                  (item) => (

                    <option
                      key={item.id}
                      value={item.id}
                    >
                      {item.name}
                    </option>

                  )
                )}

              </select>

            </label>


            <Field
              label="Roll Number"
              value={form.rollNumber}
              onChange={(value) =>
                update(
                  "rollNumber",
                  value
                )
              }
            />


            <Field
              label="Parent Name"
              value={form.parentName}
              onChange={(value) =>
                update(
                  "parentName",
                  value
                )
              }
            />


            <Field
              label="Phone"
              value={form.phone}
              onChange={(value) =>
                update(
                  "phone",
                  value
                )
              }
            />


            <Field
              label="Email"
              type="email"
              value={form.email}
              onChange={(value) =>
                update(
                  "email",
                  value
                )
              }
            />

          </div>


          <TextArea
            label="Performance"
            value={form.performance}
            onChange={(value) =>
              update(
                "performance",
                value
              )
            }
            placeholder="Recent performance, strengths and areas to improve..."
          />


          <TextArea
            label="Teacher Notes"
            value={form.notes}
            onChange={(value) =>
              update(
                "notes",
                value
              )
            }
          />


          <div
            className="
              mt-5
              flex
              justify-end
              gap-3
            "
          >

            <button
              type="button"
              onClick={close}
              className="
                rounded-xl
                border
                border-[#303A55]
                px-4
                py-2.5
                text-sm
                text-gray-300
              "
            >
              Cancel
            </button>


            <button
              disabled={saving}
              className="
                rounded-xl
                bg-violet-600
                px-5
                py-2.5
                text-sm
                font-medium
                text-white
                disabled:opacity-50
              "
            >
              {saving
                ? "Saving..."
                : editingId
                  ? "Save Changes"
                  : "Add Student"}
            </button>

          </div>

        </form>

      )}


      {/* ============================================= */}
      {/* RESULT FORM */}
      {/* ============================================= */}

      {resultFormOpen && (

        <form
          onSubmit={
            submitResult
          }
          className="
            mb-6
            rounded-2xl
            border
            border-violet-500/30
            bg-[#0D1322]
            p-5
          "
        >

          <div
            className="
              mb-5
              flex
              items-start
              justify-between
              gap-4
            "
          >

            <div>

              <h3 className="font-semibold text-white">

                {editingResultId
                  ? "Edit Test Result"
                  : "Add Test Result"}

              </h3>


              {resultStudent && (

                <p className="mt-1 text-sm text-gray-500">
                  Student:{" "}
                  <span className="text-gray-300">
                    {resultStudent.name}
                  </span>
                </p>

              )}

            </div>


            <button
              type="button"
              onClick={
                closeResultForm
              }
              className="text-gray-500 hover:text-white"
            >
              <X size={19} />
            </button>

          </div>


          <div
            className="
              grid
              gap-4
              md:grid-cols-2
            "
          >

            <Field
              label="Test Title"
              required
              value={
                resultForm.title
              }
              onChange={(value) =>
                updateResultForm(
                  "title",
                  value
                )
              }
            />


            <Field
              label="Subject"
              value={
                resultForm.subject
              }
              onChange={(value) =>
                updateResultForm(
                  "subject",
                  value
                )
              }
            />


            <Field
              label="Chapter"
              value={
                resultForm.chapter
              }
              onChange={(value) =>
                updateResultForm(
                  "chapter",
                  value
                )
              }
            />


            <Field
              label="Test Date"
              type="date"
              value={
                resultForm.testDate
              }
              onChange={(value) =>
                updateResultForm(
                  "testDate",
                  value
                )
              }
            />


            <Field
              label="Marks Obtained"
              type="number"
              required
              min="0"
              value={
                resultForm.marksObtained
              }
              onChange={(value) =>
                updateResultForm(
                  "marksObtained",
                  value
                )
              }
            />


            <Field
              label="Total Marks"
              type="number"
              required
              min="1"
              value={
                resultForm.totalMarks
              }
              onChange={(value) =>
                updateResultForm(
                  "totalMarks",
                  value
                )
              }
            />

          </div>


          <TextArea
            label="Remarks"
            value={
              resultForm.remarks
            }
            onChange={(value) =>
              updateResultForm(
                "remarks",
                value
              )
            }
            placeholder="Optional teacher remarks..."
          />


          <div
            className="
              mt-5
              flex
              justify-end
              gap-3
            "
          >

            <button
              type="button"
              onClick={
                closeResultForm
              }
              className="
                rounded-xl
                border
                border-[#303A55]
                px-4
                py-2.5
                text-sm
                text-gray-300
              "
            >
              Cancel
            </button>


            <button
              disabled={
                savingResult
              }
              className="
                rounded-xl
                bg-violet-600
                px-5
                py-2.5
                text-sm
                font-medium
                text-white
                disabled:opacity-50
              "
            >

              {savingResult
                ? "Saving..."
                : editingResultId
                  ? "Save Result"
                  : "Add Result"}

            </button>

          </div>

        </form>

      )}


      {/* ============================================= */}
      {/* SEARCH */}
      {/* ============================================= */}

      <div
        className="
          relative
          mb-5
          max-w-md
        "
      >

        <Search
          size={17}
          className="
            absolute
            left-4
            top-1/2
            -translate-y-1/2
            text-gray-500
          "
        />


        <input
          value={search}
          onChange={(event) =>
            setSearch(
              event.target.value
            )
          }
          placeholder="Search students..."
          className="
            w-full
            rounded-xl
            border
            border-[#303A55]
            bg-[#0D1322]
            py-3
            pl-11
            pr-4
            text-white
            outline-none
            placeholder:text-gray-600
            focus:border-violet-500
          "
        />

      </div>


      {/* ============================================= */}
      {/* EMPTY STATE */}
      {/* ============================================= */}

      {visibleStudents.length === 0 ? (

        <div
          className="
            rounded-2xl
            border
            border-dashed
            border-[#303A55]
            py-14
            text-center
          "
        >

          <UserRound
            size={35}
            className="mx-auto text-gray-600"
          />


          <h3 className="mt-4 font-semibold text-white">
            {search
              ? "No matching students"
              : "No students yet"}
          </h3>


          {!search && (

            <button
              type="button"
              onClick={openCreate}
              className="
                mt-5
                rounded-xl
                bg-violet-600
                px-4
                py-2.5
                text-sm
                text-white
              "
            >
              Add Student
            </button>

          )}

        </div>

      ) : (

        <div
          className="
            grid
            gap-5
            xl:grid-cols-2
          "
        >

          {visibleStudents.map(
            (student) => {

              const studentResults =
                getStudentResults(
                  student.id
                );


              const average =
                getAverage(
                  student.id
                );


              return (

                <article
                  key={student.id}
                  className="
                    rounded-2xl
                    border
                    border-[#242D43]
                    bg-[#0D1322]
                    p-5
                  "
                >

                  {/* STUDENT HEADER */}

                  <div
                    className="
                      flex
                      items-start
                      justify-between
                      gap-3
                    "
                  >

                    <div className="flex min-w-0 gap-3">

                      <div
                        className="
                          flex
                          h-11
                          w-11
                          shrink-0
                          items-center
                          justify-center
                          rounded-full
                          bg-violet-500/10
                          text-violet-400
                        "
                      >
                        <UserRound size={20} />
                      </div>


                      <div className="min-w-0">

                        <h3 className="truncate font-semibold text-white">
                          {student.name}
                        </h3>


                        <p className="mt-1 text-sm text-gray-500">

                          {classMap[
                            student.classId
                          ]?.name ||
                            "No class assigned"}

                        </p>

                      </div>

                    </div>


                    <div className="flex">

                      <button
                        type="button"
                        onClick={() =>
                          openEdit(
                            student
                          )
                        }
                        className="
                          rounded-lg
                          p-2
                          text-gray-500
                          hover:bg-white/5
                          hover:text-white
                        "
                      >
                        <Pencil size={16} />
                      </button>


                      <button
                        type="button"
                        onClick={() =>
                          remove(
                            student
                          )
                        }
                        className="
                          rounded-lg
                          p-2
                          text-gray-500
                          hover:bg-red-500/10
                          hover:text-red-400
                        "
                      >
                        <Trash2 size={16} />
                      </button>

                    </div>

                  </div>


                  {/* PERFORMANCE SUMMARY */}

                  <div
                    className="
                      mt-5
                      grid
                      grid-cols-2
                      gap-3
                    "
                  >

                    <div
                      className="
                        rounded-xl
                        border
                        border-[#242D43]
                        bg-white/[0.02]
                        p-3
                      "
                    >

                      <div
                        className="
                          flex
                          items-center
                          gap-2
                          text-gray-500
                        "
                      >
                        <BarChart3 size={15} />

                        <span className="text-xs">
                          Tests
                        </span>
                      </div>


                      <p className="mt-2 text-xl font-semibold text-white">
                        {studentResults.length}
                      </p>

                    </div>


                    <div
                      className="
                        rounded-xl
                        border
                        border-[#242D43]
                        bg-white/[0.02]
                        p-3
                      "
                    >

                      <div
                        className="
                          flex
                          items-center
                          gap-2
                          text-gray-500
                        "
                      >
                        <Trophy size={15} />

                        <span className="text-xs">
                          Average
                        </span>
                      </div>


                      <p className="mt-2 text-xl font-semibold text-white">

                        {average === null
                          ? "—"
                          : `${average}%`}

                      </p>

                    </div>

                  </div>


                  {/* MANUAL PERFORMANCE */}

                  {student.performance && (

                    <div
                      className="
                        mt-4
                        rounded-xl
                        bg-white/[0.025]
                        p-3
                      "
                    >

                      <p
                        className="
                          text-[11px]
                          uppercase
                          tracking-wider
                          text-gray-600
                        "
                      >
                        Performance Notes
                      </p>


                      <p
                        className="
                          mt-1
                          line-clamp-3
                          text-sm
                          leading-6
                          text-gray-400
                        "
                      >
                        {student.performance}
                      </p>

                    </div>

                  )}


                  {/* RESULT HEADER */}

                  <div
                    className="
                      mt-5
                      flex
                      items-center
                      justify-between
                      gap-3
                    "
                  >

                    <h4 className="text-sm font-medium text-gray-300">
                      Test Results
                    </h4>


                    <button
                      type="button"
                      onClick={() =>
                        openResultCreate(
                          student
                        )
                      }
                      className="
                        flex
                        items-center
                        gap-1.5
                        rounded-lg
                        bg-violet-500/10
                        px-3
                        py-2
                        text-xs
                        font-medium
                        text-violet-300
                        hover:bg-violet-500/20
                      "
                    >
                      <Plus size={14} />

                      Add Result
                    </button>

                  </div>


                  {/* RESULTS */}

                  {studentResults.length === 0 ? (

                    <div
                      className="
                        mt-3
                        rounded-xl
                        border
                        border-dashed
                        border-[#293149]
                        px-4
                        py-5
                        text-center
                        text-sm
                        text-gray-600
                      "
                    >
                      No test results yet.
                    </div>

                  ) : (

                    <div className="mt-3 space-y-2">

                      {studentResults.map(
                        (result) => (

                          <div
                            key={
                              result.id
                            }
                            className="
                              rounded-xl
                              border
                              border-[#242D43]
                              bg-[#111827]
                              p-3
                            "
                          >

                            <div
                              className="
                                flex
                                items-start
                                justify-between
                                gap-3
                              "
                            >

                              <div className="min-w-0">

                                <p className="truncate text-sm font-medium text-white">
                                  {result.title}
                                </p>


                                <div
                                  className="
                                    mt-1
                                    flex
                                    flex-wrap
                                    items-center
                                    gap-2
                                    text-xs
                                    text-gray-500
                                  "
                                >

                                  {result.subject && (
                                    <span>
                                      {result.subject}
                                    </span>
                                  )}


                                  {result.testDate && (

                                    <span
                                      className="
                                        flex
                                        items-center
                                        gap-1
                                      "
                                    >
                                      <CalendarDays size={12} />

                                      {result.testDate}
                                    </span>

                                  )}

                                </div>

                              </div>


                              <div className="flex items-center gap-1">

                                <button
                                  type="button"
                                  onClick={() =>
                                    openResultEdit(
                                      student,
                                      result
                                    )
                                  }
                                  className="
                                    rounded-lg
                                    p-1.5
                                    text-gray-500
                                    hover:bg-white/5
                                    hover:text-white
                                  "
                                >
                                  <Pencil size={14} />
                                </button>


                                <button
                                  type="button"
                                  onClick={() =>
                                    removeResult(
                                      result
                                    )
                                  }
                                  className="
                                    rounded-lg
                                    p-1.5
                                    text-gray-500
                                    hover:bg-red-500/10
                                    hover:text-red-400
                                  "
                                >
                                  <Trash2 size={14} />
                                </button>

                              </div>

                            </div>


                            <div
                              className="
                                mt-3
                                flex
                                items-end
                                justify-between
                                gap-3
                              "
                            >

                              <p className="text-sm text-gray-300">

                                <span className="font-semibold text-white">
                                  {result.marksObtained}
                                </span>

                                {" / "}

                                {result.totalMarks}

                              </p>


                              <span
                                className="
                                  rounded-lg
                                  bg-violet-500/10
                                  px-2.5
                                  py-1
                                  text-xs
                                  font-semibold
                                  text-violet-300
                                "
                              >
                                {getPercentage(
                                  result
                                )}%
                              </span>

                            </div>


                            {result.remarks && (

                              <p
                                className="
                                  mt-2
                                  text-xs
                                  leading-5
                                  text-gray-500
                                "
                              >
                                {result.remarks}
                              </p>

                            )}

                          </div>

                        )
                      )}

                    </div>

                  )}

                </article>

              );

            }
          )}

        </div>

      )}

    </section>

  );

}


// ======================================================
// FIELD
// ======================================================

function Field({
  label,
  value,
  onChange,

  required = false,

  type = "text",

  min,
}) {

  return (

    <label className="space-y-2">

      <span className="text-sm text-gray-400">
        {label}
      </span>


      <input
        type={type}
        required={required}
        min={min}
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        className={inputClass}
      />

    </label>

  );

}


// ======================================================
// TEXT AREA
// ======================================================

function TextArea({
  label,
  value,
  onChange,
  placeholder = "",
}) {

  return (

    <label
      className="
        mt-4
        block
        space-y-2
      "
    >

      <span className="text-sm text-gray-400">
        {label}
      </span>


      <textarea
        rows={3}
        value={value}
        placeholder={placeholder}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        className={`${inputClass} resize-none`}
      />

    </label>

  );

}