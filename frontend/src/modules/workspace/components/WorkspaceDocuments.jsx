import {
  useMemo,
  useState,
} from "react";

import {
  FilePlus2,
  Filter,
  Search,
  Sparkles,
  X,
} from "lucide-react";

import WorkspaceDocumentCard
  from "./WorkspaceDocumentCard";

import {
  createEmptyDocument,
} from "../types/workspaceTypes";

import {
  WORKSPACE_DOCUMENT_TYPE_OPTIONS,
} from "../constants/workspaceConstants";

import {
  filterWorkspaceDocuments,
} from "../utils/workspaceDocument";


const fieldClass = `
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


export default function WorkspaceDocuments({
  documents,
  classes,
  students,
  onAdd,
  onEdit,
  onDelete,
  createSignal = 0,
}) {

  const [
    search,
    setSearch,
  ] = useState("");


  const [
    typeFilter,
    setTypeFilter,
  ] = useState("all");


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
    createEmptyDocument()
  );


  const [
    saving,
    setSaving,
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
      createEmptyDocument()
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
  // STUDENT MAP
  // ====================================================

  const studentMap =
    useMemo(
      () =>
        Object.fromEntries(
          students.map(
            (item) => [
              item.id,
              item,
            ]
          )
        ),
      [students]
    );


  // ====================================================
  // FILTERED DOCUMENTS
  // ====================================================

  const visibleDocuments =
    useMemo(
      () =>
        filterWorkspaceDocuments(
          documents,
          {
            search,
            type:
              typeFilter,
          }
        ),
      [
        documents,
        search,
        typeFilter,
      ]
    );


  // ====================================================
  // CREATE
  // ====================================================

  function openCreate() {

    setEditingId(null);

    setForm(
      createEmptyDocument()
    );

    setFormOpen(true);

  }


  // ====================================================
  // EDIT
  // ====================================================

  function openEdit(
    document
  ) {

    setEditingId(
      document.id
    );


    setForm({
      title:
        document.title || "",

      type:
        document.type || "notes",

      classId:
        document.classId || "",

      studentId:
        document.studentId || "",

      subject:
        document.subject || "",

      chapter:
        document.chapter || "",

      content:
        document.content || "",

      source:
        document.source || "manual",

      status:
        document.status || "draft",

      aiMode:
        document.aiMode || "",
    });


    setFormOpen(true);

  }


  // ====================================================
  // CLOSE FORM
  // ====================================================

  function close() {

    setFormOpen(false);

    setEditingId(null);

  }


  // ====================================================
  // UPDATE FIELD
  // ====================================================

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


  // ====================================================
  // SUBMIT
  // ====================================================

  async function submit(
    event
  ) {

    event.preventDefault();


    if (
      !form.title.trim() ||
      !form.content.trim()
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
  // DELETE
  // ====================================================

  async function remove(
    document
  ) {

    if (
      !window.confirm(
        `Delete "${document.title}"?`
      )
    ) {
      return;
    }


    await onDelete(
      document.id
    );

  }


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
              className="
                text-fuchsia-400
              "
            />

            Learning Resources

          </div>


          <h2
            className="
              text-xl
              font-bold
              tracking-tight
              text-white
            "
          >
            Documents
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
            Manage tests, homework, notes, reports and
            AI-generated teaching resources.
          </p>

        </div>


        <PrimaryButton
          onClick={openCreate}
        >

          <FilePlus2
            size={17}
          />

          New Document

        </PrimaryButton>

      </div>


      {/* =================================================
          CREATE / EDIT FORM
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

          {/* AMBIENT GLOW */}

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


          {/* TOP ACCENT */}

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


          <div className="relative z-10">

            {/* FORM HEADER */}

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
                    bg-gradient-to-br
                    from-fuchsia-500/10
                    via-violet-500/15
                    to-cyan-500/10
                    text-violet-300
                  "
                >
                  <FilePlus2
                    size={18}
                  />
                </div>


                <div>

                  <h3
                    className="
                      font-semibold
                      text-white
                    "
                  >
                    {editingId
                      ? "Edit Document"
                      : "Create Document"}
                  </h3>


                  <p
                    className="
                      mt-1
                      text-sm
                      text-slate-500
                    "
                  >
                    {editingId
                      ? "Update this learning resource."
                      : "Create a new resource for your Nyxora Workspace."}
                  </p>

                </div>

              </div>


              <button
                type="button"
                onClick={close}
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


            {/* FORM GRID */}

            <div
              className="
                grid
                gap-4
                md:grid-cols-2
              "
            >

              <Field
                label="Title"
                required
                value={form.title}
                onChange={(value) =>
                  update(
                    "title",
                    value
                  )
                }
                placeholder="Document title"
              />


              {/* DOCUMENT TYPE */}

              <label className="space-y-2">

                <FieldLabel>
                  Document Type
                </FieldLabel>


                <select
                  value={form.type}
                  onChange={(event) =>
                    update(
                      "type",
                      event.target.value
                    )
                  }
                  className={fieldClass}
                >

                  {WORKSPACE_DOCUMENT_TYPE_OPTIONS.map(
                    (option) => (

                      <option
                        key={
                          option.value
                        }
                        value={
                          option.value
                        }
                      >
                        {option.emoji}{" "}
                        {option.label}
                      </option>

                    )
                  )}

                </select>

              </label>


              {/* CLASS */}

              <Select
                label="Class"
                value={form.classId}
                onChange={(value) => {

                  update(
                    "classId",
                    value
                  );


                  if (
                    form.studentId &&
                    students.find(
                      (student) =>
                        student.id ===
                        form.studentId
                    )?.classId !==
                      value
                  ) {

                    update(
                      "studentId",
                      ""
                    );

                  }

                }}
                options={
                  classes.map(
                    (item) => ({
                      value:
                        item.id,

                      label:
                        item.name,
                    })
                  )
                }
              />


              {/* STUDENT */}

              <Select
                label="Student"
                value={
                  form.studentId
                }
                onChange={(value) =>
                  update(
                    "studentId",
                    value
                  )
                }
                options={
                  students
                    .filter(
                      (student) =>
                        !form.classId ||
                        student.classId ===
                          form.classId
                    )
                    .map(
                      (student) => ({
                        value:
                          student.id,

                        label:
                          student.name,
                      })
                    )
                }
              />


              <Field
                label="Subject"
                value={form.subject}
                onChange={(value) =>
                  update(
                    "subject",
                    value
                  )
                }
                placeholder="Mathematics"
              />


              <Field
                label="Chapter / Topic"
                value={form.chapter}
                onChange={(value) =>
                  update(
                    "chapter",
                    value
                  )
                }
                placeholder="Chapter or topic"
              />

            </div>


            {/* CONTENT */}

            <label
              className="
                mt-4
                block
                space-y-2
              "
            >

              <FieldLabel
                required
              >
                Content
              </FieldLabel>


              <textarea
                required
                rows={12}
                value={
                  form.content
                }
                onChange={(event) =>
                  update(
                    "content",
                    event.target.value
                  )
                }
                placeholder="Write or paste document content..."
                className={`
                  ${fieldClass}
                  resize-y
                  leading-6
                `}
              />

            </label>


            {/* FORM ACTIONS */}

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
                onClick={close}
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

                {/* DIAGONAL SHINE */}

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
                  "
                >
                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Save Changes"
                      : "Save Document"}
                </span>

              </button>

            </div>

          </div>

        </form>

      )}


      {/* =================================================
          SEARCH + FILTER
      ================================================== */}

      <div
        className="
          mb-6
          flex
          flex-wrap
          gap-3
        "
      >

        {/* SEARCH */}

        <div
          className="
            relative
            min-w-[240px]
            max-w-md
            flex-1
          "
        >

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
            placeholder="Search documents..."
            className="
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


        {/* TYPE FILTER */}

        <div className="relative">

          <Filter
            size={15}
            className="
              pointer-events-none
              absolute
              left-4
              top-1/2
              z-10
              -translate-y-1/2
              text-violet-400
            "
          />


          <select
            value={typeFilter}
            onChange={(event) =>
              setTypeFilter(
                event.target.value
              )
            }
            className="
              min-w-[170px]
              appearance-none
              rounded-xl
              border
              border-white/[0.08]
              bg-[#0B1020]/80
              py-3
              pl-10
              pr-10
              text-sm
              text-slate-300
              outline-none
              backdrop-blur-xl
              transition-all
              duration-200
              hover:border-violet-400/20
              focus:border-violet-400/40
            "
          >

            <option value="all">
              All Types
            </option>


            {WORKSPACE_DOCUMENT_TYPE_OPTIONS.map(
              (option) => (

                <option
                  key={
                    option.value
                  }
                  value={
                    option.value
                  }
                >
                  {option.label}
                </option>

              )
            )}

          </select>

        </div>

      </div>


      {/* =================================================
          EMPTY STATE
      ================================================== */}

      {visibleDocuments.length === 0 ? (

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

          {/* GLOW */}

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
              <FilePlus2
                size={25}
              />
            </div>


            <h3
              className="
                mt-5
                font-semibold
                text-white
              "
            >
              No documents found
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
              {search ||
              typeFilter !== "all"
                ? "Try changing your search or document type filter."
                : "Create a document or generate one with Nyxora AI."}
            </p>


            {!search &&
              typeFilter ===
                "all" && (

                <PrimaryButton
                  onClick={
                    openCreate
                  }
                  className="mt-6"
                >

                  <FilePlus2
                    size={16}
                  />

                  Create Document

                </PrimaryButton>

              )}

          </div>

        </div>

      ) : (

        /* =================================================
           DOCUMENT GRID
        ================================================== */

        <div
          className="
            grid
            gap-4
            xl:grid-cols-2
          "
        >

          {visibleDocuments.map(
            (document) => (

              <WorkspaceDocumentCard
                key={
                  document.id
                }
                document={
                  document
                }
                classItem={
                  classMap[
                    document.classId
                  ]
                }
                student={
                  studentMap[
                    document.studentId
                  ]
                }
                onEdit={
                  openEdit
                }
                onDelete={
                  remove
                }
              />

            )
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

      {/* DIAGONAL SHINE */}

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

        <span
          className="
            ml-1
            text-fuchsia-400
          "
        >
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
  placeholder = "",
}) {

  return (

    <label className="space-y-2">

      <FieldLabel
        required={
          required
        }
      >
        {label}
      </FieldLabel>


      <input
        required={
          required
        }
        value={
          value
        }
        placeholder={
          placeholder
        }
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        className={
          fieldClass
        }
      />

    </label>

  );

}


// ======================================================
// SELECT
// ======================================================

function Select({
  label,
  value,
  onChange,
  options,
}) {

  return (

    <label className="space-y-2">

      <FieldLabel>
        {label}
      </FieldLabel>


      <select
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        className={
          fieldClass
        }
      >

        <option value="">
          None
        </option>


        {options.map(
          (option) => (

            <option
              key={
                option.value
              }
              value={
                option.value
              }
            >
              {option.label}
            </option>

          )
        )}

      </select>

    </label>

  );

}