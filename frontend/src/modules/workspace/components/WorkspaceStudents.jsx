import {
  useMemo,
  useState,
} from "react";

import {
  BarChart3,
  CalendarDays,
  GraduationCap,
  Mail,
  Pencil,
  Phone,
  Plus,
  Search,
  Sparkles,
  Trash2,
  Trophy,
  UserRound,
  Users,
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
  border-white/[0.09]
  bg-[#080D19]/90
  px-4
  py-3
  text-sm
  text-white
  outline-none
  placeholder:text-slate-600
  transition-all
  duration-200
  hover:border-violet-400/20
  focus:border-violet-400/45
  focus:bg-[#0B1020]
  focus:shadow-[0_0_0_3px_rgba(139,92,246,0.08)]
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

    <section className="relative">

      {/* =================================================
          HEADING
      ================================================== */}

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

          <div
            className="
              mb-2
              flex
              items-center
              gap-2
              text-xs
              font-medium
              text-violet-300
            "
          >
            <Sparkles
              size={13}
              className="text-fuchsia-400"
            />

            Student Intelligence
          </div>


          <h2
            className="
              text-xl
              font-bold
              tracking-tight
              text-white
            "
          >
            Students
          </h2>


          <p
            className="
              mt-1.5
              max-w-2xl
              text-sm
              leading-6
              text-slate-500
            "
          >
            Manage student profiles, test results and AI-ready performance data.
          </p>

        </div>


        <PrimaryButton
          onClick={openCreate}
        >
          <Plus size={17} />

          Add Student
        </PrimaryButton>

      </div>


      {/* =================================================
          STUDENT FORM
      ================================================== */}

      {formOpen && (

        <form
          onSubmit={submit}
          className="
            relative
            mb-7
            overflow-hidden
            rounded-2xl
            border
            border-violet-400/20
            bg-[#0B1020]/90
            p-5
            shadow-[0_18px_50px_rgba(0,0,0,0.20)]
            backdrop-blur-xl
            sm:p-6
          "
        >

          <FormAmbientEffects />


          <div className="relative z-10">

            <FormHeader
              icon={UserRound}
              title={
                editingId
                  ? "Edit Student"
                  : "Add Student"
              }
              description={
                editingId
                  ? "Update this student's profile and learning information."
                  : "Create a student profile for your Nyxora Workspace."
              }
              onClose={close}
            />


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
                placeholder="Student name"
              />


              <label className="space-y-2">

                <FieldLabel>
                  Class
                </FieldLabel>


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
                placeholder="Roll number"
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
                placeholder="Parent or guardian"
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
                placeholder="Phone number"
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
                placeholder="Email address"
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
              placeholder="Private teaching notes..."
            />


            <FormActions
              saving={saving}
              editing={Boolean(editingId)}
              createLabel="Add Student"
              editLabel="Save Changes"
              onCancel={close}
            />

          </div>

        </form>

      )}


      {/* =================================================
          RESULT FORM
      ================================================== */}

      {resultFormOpen && (

        <form
          onSubmit={
            submitResult
          }
          className="
            relative
            mb-7
            overflow-hidden
            rounded-2xl
            border
            border-violet-400/20
            bg-[#0B1020]/90
            p-5
            shadow-[0_18px_50px_rgba(0,0,0,0.20)]
            backdrop-blur-xl
            sm:p-6
          "
        >

          <FormAmbientEffects />


          <div className="relative z-10">

            <FormHeader
              icon={Trophy}
              title={
                editingResultId
                  ? "Edit Test Result"
                  : "Add Test Result"
              }
              description={
                resultStudent
                  ? `Student: ${resultStudent.name}`
                  : ""
              }
              onClose={
                closeResultForm
              }
            />


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
                placeholder="Weekly Test"
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
                placeholder="Mathematics"
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
                placeholder="Chapter name"
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


            <FormActions
              saving={savingResult}
              editing={
                Boolean(
                  editingResultId
                )
              }
              createLabel="Add Result"
              editLabel="Save Result"
              onCancel={
                closeResultForm
              }
            />

          </div>

        </form>

      )}


      {/* =================================================
          SEARCH
      ================================================== */}

      <div
        className="
          relative
          mb-6
          max-w-lg
        "
      >

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            rounded-xl
            bg-gradient-to-r
            from-fuchsia-500/[0.04]
            via-violet-500/[0.05]
            to-cyan-500/[0.04]
          "
        />


        <Search
          size={17}
          className="
            absolute
            left-4
            top-1/2
            z-10
            -translate-y-1/2
            text-violet-400
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
            relative
            z-[1]
            w-full
            rounded-xl
            border
            border-white/[0.08]
            bg-[#0B1020]/80
            py-3
            pl-11
            pr-4
            text-sm
            text-white
            outline-none
            backdrop-blur-xl
            placeholder:text-slate-600
            transition-all
            duration-200
            hover:border-violet-400/20
            focus:border-violet-400/40
            focus:shadow-[0_0_0_3px_rgba(139,92,246,0.07)]
          "
        />

      </div>


      {/* =================================================
          EMPTY STATE
      ================================================== */}

      {visibleStudents.length === 0 ? (

        <div
          className="
            relative
            overflow-hidden
            rounded-3xl
            border
            border-dashed
            border-violet-400/20
            bg-[#0B1020]/60
            px-6
            py-16
            text-center
            backdrop-blur-xl
          "
        >

          <div
            className="
              pointer-events-none
              absolute
              left-1/2
              top-1/2
              h-56
              w-56
              -translate-x-1/2
              -translate-y-1/2
              rounded-full
              bg-violet-500/[0.07]
              blur-[90px]
            "
          />


          <div className="relative z-10">

            <div
              className="
                mx-auto
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-2xl
                border
                border-violet-400/15
                bg-gradient-to-br
                from-fuchsia-500/10
                via-violet-500/15
                to-cyan-500/10
                text-violet-300
              "
            >
              <UserRound size={25} />
            </div>


            <h3
              className="
                mt-5
                font-semibold
                text-white
              "
            >
              {search
                ? "No matching students"
                : "No students yet"}
            </h3>


            <p
              className="
                mx-auto
                mt-2
                max-w-md
                text-sm
                leading-6
                text-slate-500
              "
            >
              {search
                ? "Try searching with another name, class, roll number or parent."
                : "Add your first student and start building their learning profile."}
            </p>


            {!search && (

              <PrimaryButton
                onClick={openCreate}
                className="mt-6"
              >
                <Plus size={16} />

                Add Student
              </PrimaryButton>

            )}

          </div>

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


              const assignedClass =
                classMap[
                  student.classId
                ];


              return (

                <article
                  key={student.id}
                  className="
                    group
                    relative
                    overflow-hidden
                    rounded-2xl
                    border
                    border-white/[0.08]
                    bg-[#0B1020]/85
                    p-5
                    shadow-[0_12px_35px_rgba(0,0,0,0.14)]
                    backdrop-blur-xl
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:border-violet-400/25
                    hover:bg-[#0E1426]
                    hover:shadow-[0_18px_45px_rgba(0,0,0,0.22)]
                  "
                >

                  {/* CARD AMBIENCE */}

                  <div
                    className="
                      pointer-events-none
                      absolute
                      -right-20
                      -top-20
                      h-48
                      w-48
                      rounded-full
                      bg-violet-500/[0.08]
                      blur-[80px]
                      transition
                      duration-300
                      group-hover:bg-violet-500/[0.12]
                    "
                  />


                  <div
                    className="
                      pointer-events-none
                      absolute
                      -bottom-20
                      -left-20
                      h-40
                      w-40
                      rounded-full
                      bg-cyan-500/[0.04]
                      blur-[70px]
                    "
                  />


                  <div
                    className="
                      pointer-events-none
                      absolute
                      left-[12%]
                      top-0
                      h-px
                      w-[76%]
                      bg-gradient-to-r
                      from-transparent
                      via-violet-400/45
                      to-transparent
                    "
                  />


                  <div className="relative z-10">

                    {/* STUDENT HEADER */}

                    <div
                      className="
                        flex
                        items-start
                        justify-between
                        gap-3
                      "
                    >

                      <div
                        className="
                          flex
                          min-w-0
                          gap-3.5
                        "
                      >

                        <div
                          className="
                            flex
                            h-12
                            w-12
                            shrink-0
                            items-center
                            justify-center
                            rounded-2xl
                            border
                            border-violet-400/15
                            bg-gradient-to-br
                            from-fuchsia-500/10
                            via-violet-500/15
                            to-cyan-500/10
                            text-violet-300
                            shadow-[0_0_24px_rgba(139,92,246,0.08)]
                          "
                        >
                          <UserRound
                            size={21}
                          />
                        </div>


                        <div className="min-w-0">

                          <h3
                            className="
                              truncate
                              text-base
                              font-semibold
                              text-white
                            "
                          >
                            {student.name}
                          </h3>


                          <div
                            className="
                              mt-1.5
                              flex
                              flex-wrap
                              items-center
                              gap-x-3
                              gap-y-1
                              text-xs
                              text-slate-500
                            "
                          >

                            <span
                              className="
                                flex
                                items-center
                                gap-1.5
                              "
                            >
                              <GraduationCap
                                size={13}
                                className="text-violet-400"
                              />

                              {assignedClass?.name ||
                                "No class assigned"}
                            </span>


                            {student.rollNumber && (

                              <span>
                                Roll {student.rollNumber}
                              </span>

                            )}

                          </div>

                        </div>

                      </div>


                      <div
                        className="
                          flex
                          shrink-0
                          items-center
                          gap-1
                        "
                      >

                        <IconButton
                          title="Edit student"
                          onClick={() =>
                            openEdit(
                              student
                            )
                          }
                        >
                          <Pencil size={16} />
                        </IconButton>


                        <IconButton
                          title="Delete student"
                          danger
                          onClick={() =>
                            remove(
                              student
                            )
                          }
                        >
                          <Trash2 size={16} />
                        </IconButton>

                      </div>

                    </div>


                    {/* CONTACT INFO */}

                    {(student.parentName ||
                      student.phone ||
                      student.email) && (

                      <div
                        className="
                          mt-4
                          flex
                          flex-wrap
                          gap-2
                        "
                      >

                        {student.parentName && (

                          <InfoPill
                            icon={Users}
                          >
                            {student.parentName}
                          </InfoPill>

                        )}


                        {student.phone && (

                          <InfoPill
                            icon={Phone}
                          >
                            {student.phone}
                          </InfoPill>

                        )}


                        {student.email && (

                          <InfoPill
                            icon={Mail}
                          >
                            {student.email}
                          </InfoPill>

                        )}

                      </div>

                    )}


                    {/* PERFORMANCE SUMMARY */}

                    <div
                      className="
                        mt-5
                        grid
                        grid-cols-2
                        gap-3
                      "
                    >

                      <StatCard
                        icon={BarChart3}
                        label="Tests"
                        value={
                          studentResults.length
                        }
                      />


                      <StatCard
                        icon={Trophy}
                        label="Average"
                        value={
                          average === null
                            ? "—"
                            : `${average}%`
                        }
                      />

                    </div>


                    {/* MANUAL PERFORMANCE */}

                    {student.performance && (

                      <div
                        className="
                          mt-4
                          rounded-xl
                          border
                          border-white/[0.055]
                          bg-white/[0.025]
                          p-3.5
                        "
                      >

                        <div
                          className="
                            flex
                            items-center
                            gap-2
                            text-[11px]
                            font-medium
                            uppercase
                            tracking-[0.12em]
                            text-violet-400/80
                          "
                        >
                          <Sparkles size={12} />

                          Performance Notes
                        </div>


                        <p
                          className="
                            mt-2
                            line-clamp-3
                            text-sm
                            leading-6
                            text-slate-400
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

                      <div>

                        <h4
                          className="
                            text-sm
                            font-semibold
                            text-slate-200
                          "
                        >
                          Test Results
                        </h4>


                        <p
                          className="
                            mt-0.5
                            text-xs
                            text-slate-600
                          "
                        >
                          Academic performance history
                        </p>

                      </div>


                      <button
                        type="button"
                        onClick={() =>
                          openResultCreate(
                            student
                          )
                        }
                        className="
                          group/result
                          flex
                          items-center
                          gap-1.5
                          rounded-lg
                          border
                          border-violet-400/15
                          bg-violet-500/[0.08]
                          px-3
                          py-2
                          text-xs
                          font-medium
                          text-violet-300
                          transition-all
                          duration-200
                          hover:border-violet-400/25
                          hover:bg-violet-500/[0.14]
                        "
                      >
                        <Plus
                          size={14}
                          className="
                            transition-transform
                            group-hover/result:rotate-90
                          "
                        />

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
                          border-white/[0.07]
                          bg-white/[0.015]
                          px-4
                          py-5
                          text-center
                          text-sm
                          text-slate-600
                        "
                      >
                        No test results yet.
                      </div>

                    ) : (

                      <div className="mt-3 space-y-2.5">

                        {studentResults.map(
                          (result) => {

                            const percentage =
                              getPercentage(
                                result
                              );


                            return (

                              <div
                                key={
                                  result.id
                                }
                                className="
                                  relative
                                  overflow-hidden
                                  rounded-xl
                                  border
                                  border-white/[0.065]
                                  bg-[#080D19]/75
                                  p-3.5
                                  transition
                                  hover:border-violet-400/15
                                "
                              >

                                <div
                                  className="
                                    pointer-events-none
                                    absolute
                                    bottom-3
                                    left-0
                                    top-3
                                    w-[2px]
                                    rounded-full
                                    bg-gradient-to-b
                                    from-fuchsia-400/70
                                    via-violet-400/70
                                    to-cyan-400/70
                                  "
                                />


                                <div
                                  className="
                                    flex
                                    items-start
                                    justify-between
                                    gap-3
                                  "
                                >

                                  <div className="min-w-0">

                                    <p
                                      className="
                                        truncate
                                        text-sm
                                        font-medium
                                        text-white
                                      "
                                    >
                                      {result.title}
                                    </p>


                                    <div
                                      className="
                                        mt-1.5
                                        flex
                                        flex-wrap
                                        items-center
                                        gap-x-3
                                        gap-y-1
                                        text-xs
                                        text-slate-500
                                      "
                                    >

                                      {result.subject && (

                                        <span>
                                          {result.subject}
                                        </span>

                                      )}


                                      {result.chapter && (

                                        <span>
                                          {result.chapter}
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


                                  <div
                                    className="
                                      flex
                                      shrink-0
                                      items-center
                                      gap-1
                                    "
                                  >

                                    <IconButton
                                      small
                                      title="Edit result"
                                      onClick={() =>
                                        openResultEdit(
                                          student,
                                          result
                                        )
                                      }
                                    >
                                      <Pencil size={14} />
                                    </IconButton>


                                    <IconButton
                                      small
                                      danger
                                      title="Delete result"
                                      onClick={() =>
                                        removeResult(
                                          result
                                        )
                                      }
                                    >
                                      <Trash2 size={14} />
                                    </IconButton>

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

                                  <p
                                    className="
                                      text-sm
                                      text-slate-400
                                    "
                                  >

                                    <span
                                      className="
                                        font-semibold
                                        text-white
                                      "
                                    >
                                      {result.marksObtained}
                                    </span>

                                    {" / "}

                                    {result.totalMarks}

                                  </p>


                                  <span
                                    className="
                                      rounded-lg
                                      border
                                      border-violet-400/10
                                      bg-gradient-to-r
                                      from-fuchsia-500/[0.07]
                                      via-violet-500/[0.12]
                                      to-cyan-500/[0.07]
                                      px-2.5
                                      py-1
                                      text-xs
                                      font-semibold
                                      text-violet-200
                                    "
                                  >
                                    {percentage}%
                                  </span>

                                </div>


                                {result.remarks && (

                                  <p
                                    className="
                                      mt-2
                                      text-xs
                                      leading-5
                                      text-slate-500
                                    "
                                  >
                                    {result.remarks}
                                  </p>

                                )}

                              </div>

                            );

                          }
                        )}

                      </div>

                    )}

                  </div>

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
// PRIMARY BUTTON
// ======================================================

function PrimaryButton({
  children,
  onClick,
  className = "",
}) {

  return (

    <button
      type="button"
      onClick={onClick}
      className={`
        group
        relative
        inline-flex
        items-center
        justify-center
        gap-2
        overflow-hidden
        rounded-xl
        bg-gradient-to-r
        from-fuchsia-600
        via-violet-600
        to-cyan-500
        px-4
        py-2.5
        text-sm
        font-semibold
        text-white
        shadow-[0_8px_25px_rgba(124,58,237,0.20)]
        transition-all
        duration-300
        hover:scale-[1.025]
        hover:shadow-[0_10px_32px_rgba(124,58,237,0.28)]
        active:scale-[0.98]
        ${className}
      `}
    >

      <span
        className="
          pointer-events-none
          absolute
          inset-y-0
          -left-1/2
          w-1/3
          -skew-x-12
          bg-white/10
          transition-all
          duration-700
          group-hover:left-[120%]
        "
      />

      <span
        className="
          relative
          z-10
          flex
          items-center
          gap-2
        "
      >
        {children}
      </span>

    </button>

  );

}


// ======================================================
// FORM AMBIENT EFFECTS
// ======================================================

function FormAmbientEffects() {

  return (

    <>

      <div
        className="
          pointer-events-none
          absolute
          -left-20
          -top-20
          h-48
          w-48
          rounded-full
          bg-fuchsia-500/[0.08]
          blur-[80px]
        "
      />


      <div
        className="
          pointer-events-none
          absolute
          -bottom-24
          right-0
          h-52
          w-52
          rounded-full
          bg-cyan-500/[0.07]
          blur-[90px]
        "
      />


      <div
        className="
          pointer-events-none
          absolute
          left-0
          top-0
          h-px
          w-full
          bg-gradient-to-r
          from-fuchsia-400/60
          via-violet-400/60
          to-cyan-400/60
        "
      />

    </>

  );

}


// ======================================================
// FORM HEADER
// ======================================================

function FormHeader({
  icon: Icon,
  title,
  description,
  onClose,
}) {

  return (

    <div
      className="
        mb-5
        flex
        items-start
        justify-between
        gap-4
      "
    >

      <div
        className="
          flex
          items-start
          gap-3
        "
      >

        <div
          className="
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-xl
            border
            border-violet-400/15
            bg-violet-500/10
            text-violet-300
          "
        >
          <Icon size={18} />
        </div>


        <div>

          <h3
            className="
              font-semibold
              text-white
            "
          >
            {title}
          </h3>


          {description && (

            <p
              className="
                mt-1
                text-sm
                text-slate-500
              "
            >
              {description}
            </p>

          )}

        </div>

      </div>


      <button
        type="button"
        onClick={onClose}
        className="
          flex
          h-9
          w-9
          shrink-0
          items-center
          justify-center
          rounded-lg
          text-slate-500
          transition
          hover:bg-white/[0.05]
          hover:text-white
        "
      >
        <X size={18} />
      </button>

    </div>

  );

}


// ======================================================
// FIELD LABEL
// ======================================================

function FieldLabel({
  children,
  required = false,
}) {

  return (

    <span
      className="
        text-sm
        font-medium
        text-slate-400
      "
    >
      {children}

      {required && (

        <span className="ml-1 text-fuchsia-400">
          *
        </span>

      )}

    </span>

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

  placeholder = "",
}) {

  return (

    <label className="space-y-2">

      <FieldLabel
        required={required}
      >
        {label}
      </FieldLabel>


      <input
        type={type}
        required={required}
        min={min}
        value={value}
        placeholder={placeholder}
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

      <FieldLabel>
        {label}
      </FieldLabel>


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


// ======================================================
// FORM ACTIONS
// ======================================================

function FormActions({
  saving,
  editing,
  createLabel,
  editLabel,
  onCancel,
}) {

  return (

    <div
      className="
        mt-6
        flex
        justify-end
        gap-3
      "
    >

      <button
        type="button"
        onClick={onCancel}
        className="
          rounded-xl
          border
          border-white/[0.08]
          bg-white/[0.025]
          px-4
          py-2.5
          text-sm
          font-medium
          text-slate-400
          transition
          hover:border-white/[0.14]
          hover:bg-white/[0.05]
          hover:text-white
        "
      >
        Cancel
      </button>


      <button
        disabled={saving}
        className="
          group
          relative
          overflow-hidden
          rounded-xl
          bg-gradient-to-r
          from-fuchsia-600
          via-violet-600
          to-cyan-500
          px-5
          py-2.5
          text-sm
          font-semibold
          text-white
          shadow-[0_8px_24px_rgba(124,58,237,0.20)]
          transition-all
          duration-300
          hover:shadow-[0_10px_30px_rgba(124,58,237,0.28)]
          disabled:cursor-not-allowed
          disabled:opacity-50
        "
      >

        <span
          className="
            pointer-events-none
            absolute
            inset-y-0
            -left-1/2
            w-1/3
            -skew-x-12
            bg-white/10
            transition-all
            duration-700
            group-hover:left-[120%]
          "
        />


        <span className="relative z-10">

          {saving
            ? "Saving..."
            : editing
              ? editLabel
              : createLabel}

        </span>

      </button>

    </div>

  );

}


// ======================================================
// STAT CARD
// ======================================================

function StatCard({
  icon: Icon,
  label,
  value,
}) {

  return (

    <div
      className="
        relative
        overflow-hidden
        rounded-xl
        border
        border-white/[0.06]
        bg-white/[0.025]
        p-3.5
      "
    >

      <div
        className="
          flex
          items-center
          gap-2
          text-slate-500
        "
      >
        <Icon
          size={15}
          className="text-violet-400"
        />

        <span className="text-xs">
          {label}
        </span>
      </div>


      <p
        className="
          mt-2
          text-xl
          font-semibold
          text-white
        "
      >
        {value}
      </p>

    </div>

  );

}


// ======================================================
// INFO PILL
// ======================================================

function InfoPill({
  icon: Icon,
  children,
}) {

  return (

    <span
      className="
        inline-flex
        max-w-full
        items-center
        gap-1.5
        rounded-lg
        border
        border-white/[0.055]
        bg-white/[0.025]
        px-2.5
        py-1.5
        text-xs
        text-slate-500
      "
    >
      <Icon
        size={12}
        className="
          shrink-0
          text-violet-400/80
        "
      />

      <span className="truncate">
        {children}
      </span>
    </span>

  );

}


// ======================================================
// ICON BUTTON
// ======================================================

function IconButton({
  children,
  onClick,
  title,
  danger = false,
  small = false,
}) {

  return (

    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`
        flex
        items-center
        justify-center
        rounded-lg
        border
        border-transparent
        transition-all
        duration-200

        ${
          small
            ? "h-8 w-8"
            : "h-9 w-9"
        }

        ${
          danger
            ? `
              text-slate-600
              hover:border-red-400/15
              hover:bg-red-500/[0.08]
              hover:text-red-400
            `
            : `
              text-slate-600
              hover:border-violet-400/15
              hover:bg-violet-500/[0.08]
              hover:text-violet-300
            `
        }
      `}
    >
      {children}
    </button>

  );

}