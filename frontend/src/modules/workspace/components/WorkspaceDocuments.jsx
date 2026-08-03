import {
  useMemo,
  useState,
} from "react";

import {
  FilePlus2,
  Search,
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
  border-[#303A55]
  bg-[#111827]
  px-4
  py-3
  text-white
  outline-none
  focus:border-violet-500
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


  function openCreate() {

    setEditingId(null);

    setForm(
      createEmptyDocument()
    );

    setFormOpen(true);

  }


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


  function close() {

    setFormOpen(false);

    setEditingId(null);

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
            Documents
          </h2>


          <p className="mt-1 text-sm text-gray-500">
            Manage tests, homework, notes, reports and AI-generated teaching resources.
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
          <FilePlus2 size={17} />

          New Document
        </button>

      </div>


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
                ? "Edit Document"
                : "Create Document"}
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
              label="Title"
              required
              value={form.title}
              onChange={(value) =>
                update(
                  "title",
                  value
                )
              }
            />


            <label className="space-y-2">

              <span className="text-sm text-gray-400">
                Document Type
              </span>


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
                      key={option.value}
                      value={option.value}
                    >
                      {option.emoji}{" "}
                      {option.label}
                    </option>

                  )
                )}

              </select>

            </label>


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
              options={classes.map(
                (item) => ({
                  value: item.id,
                  label: item.name,
                })
              )}
            />


            <Select
              label="Student"
              value={form.studentId}
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
            />

          </div>


          <label
            className="
              mt-4
              block
              space-y-2
            "
          >

            <span className="text-sm text-gray-400">
              Content
            </span>


            <textarea
              required
              rows={12}
              value={form.content}
              onChange={(event) =>
                update(
                  "content",
                  event.target.value
                )
              }
              placeholder="Write or paste document content..."
              className={`${fieldClass} resize-y leading-6`}
            />

          </label>


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
                  : "Save Document"}
            </button>

          </div>

        </form>

      )}


      <div
        className="
          mb-5
          flex
          flex-wrap
          gap-3
        "
      >

        <div
          className="
            relative
            min-w-[240px]
            flex-1
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
            placeholder="Search documents..."
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


        <select
          value={typeFilter}
          onChange={(event) =>
            setTypeFilter(
              event.target.value
            )
          }
          className="
            rounded-xl
            border
            border-[#303A55]
            bg-[#0D1322]
            px-4
            py-3
            text-sm
            text-gray-300
            outline-none
          "
        >

          <option value="all">
            All Types
          </option>


          {WORKSPACE_DOCUMENT_TYPE_OPTIONS.map(
            (option) => (

              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>

            )
          )}

        </select>

      </div>


      {visibleDocuments.length === 0 ? (

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

          <FilePlus2
            size={35}
            className="mx-auto text-gray-600"
          />


          <h3 className="mt-4 font-semibold text-white">
            No documents found
          </h3>


          <p className="mt-2 text-sm text-gray-500">
            Create a document or generate one with Nyxora AI.
          </p>

        </div>

      ) : (

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
                key={document.id}
                document={document}
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
                onEdit={openEdit}
                onDelete={remove}
              />

            )
          )}

        </div>

      )}

    </section>

  );

}


function Field({
  label,
  value,
  onChange,
  required = false,
}) {

  return (

    <label className="space-y-2">

      <span className="text-sm text-gray-400">
        {label}
      </span>


      <input
        required={required}
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        className={fieldClass}
      />

    </label>

  );

}


function Select({
  label,
  value,
  onChange,
  options,
}) {

  return (

    <label className="space-y-2">

      <span className="text-sm text-gray-400">
        {label}
      </span>


      <select
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        className={fieldClass}
      >

        <option value="">
          None
        </option>


        {options.map(
          (option) => (

            <option
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>

          )
        )}

      </select>

    </label>

  );

}