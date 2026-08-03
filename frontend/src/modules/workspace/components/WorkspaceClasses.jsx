import {
  useState,
} from "react";

import {
  BookOpen,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";

import {
  createEmptyClass,
} from "../types/workspaceTypes";

import {
  WORKSPACE_BOARD_OPTIONS,
} from "../constants/workspaceConstants";


export default function WorkspaceClasses({
  classes,
  students,
  onAdd,
  onEdit,
  onDelete,
  createSignal = 0,
}) {

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
    createEmptyClass()
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
      createEmptyClass()
    );

    setFormOpen(true);

  }


  function openCreate() {

    setEditingId(null);

    setForm(
      createEmptyClass()
    );

    setFormOpen(true);

  }


  function openEdit(
    item
  ) {

    setEditingId(
      item.id
    );


    setForm({
      name:
        item.name || "",

      grade:
        item.grade || "",

      subject:
        item.subject || "",

      board:
        item.board || "",

      description:
        item.description || "",
    });


    setFormOpen(true);

  }


  function closeForm() {

    setFormOpen(false);

    setEditingId(null);

  }


  function updateField(
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


      closeForm();

    } finally {

      setSaving(false);

    }

  }


  async function remove(
    item
  ) {

    const studentCount =
      students.filter(
        (student) =>
          student.classId ===
          item.id
      ).length;


    const warning =
      studentCount > 0

        ? `"${item.name}" has ${studentCount} student(s). Delete the class anyway?`

        : `Delete "${item.name}"?`;


    if (
      !window.confirm(
        warning
      )
    ) {
      return;
    }


    await onDelete(
      item.id
    );

  }


  return (

    <section>

      <SectionHeading
        title="Classes"
        description="Create teaching groups that can be used by students, documents and Nyxora AI."
        button="Add Class"
        onClick={openCreate}
      />


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

          <FormHeader
            title={
              editingId
                ? "Edit Class"
                : "Create Class"
            }
            onClose={closeForm}
          />


          <div
            className="
              grid
              gap-4
              md:grid-cols-2
            "
          >

            <Input
              label="Class Name"
              required
              value={form.name}
              onChange={(value) =>
                updateField(
                  "name",
                  value
                )
              }
              placeholder="Class 8 Mathematics"
            />


            <Input
              label="Grade"
              value={form.grade}
              onChange={(value) =>
                updateField(
                  "grade",
                  value
                )
              }
              placeholder="8"
            />


            <Input
              label="Subject"
              value={form.subject}
              onChange={(value) =>
                updateField(
                  "subject",
                  value
                )
              }
              placeholder="Mathematics"
            />


            <label className="space-y-2">

              <span className="text-sm text-gray-400">
                Board
              </span>


              <select
                value={form.board}
                onChange={(event) =>
                  updateField(
                    "board",
                    event.target.value
                  )
                }
                className={fieldClass}
              >

                <option value="">
                  Select board
                </option>


                {WORKSPACE_BOARD_OPTIONS.map(
                  (board) => (

                    <option
                      key={board}
                      value={board}
                    >
                      {board}
                    </option>

                  )
                )}

              </select>

            </label>

          </div>


          <label
            className="
              mt-4
              block
              space-y-2
            "
          >

            <span className="text-sm text-gray-400">
              Description
            </span>


            <textarea
              rows={3}
              value={
                form.description
              }
              onChange={(event) =>
                updateField(
                  "description",
                  event.target.value
                )
              }
              className={`${fieldClass} resize-none`}
            />

          </label>


          <FormActions
            saving={saving}
            editing={Boolean(editingId)}
            onCancel={closeForm}
          />

        </form>

      )}


      {classes.length === 0 ? (

        <EmptyState
          onCreate={openCreate}
        />

      ) : (

        <div
          className="
            grid
            gap-4
            lg:grid-cols-2
            2xl:grid-cols-3
          "
        >

          {classes.map((item) => {

            const studentCount =
              students.filter(
                (student) =>
                  student.classId ===
                  item.id
              ).length;


            return (

              <article
                key={item.id}
                className="
                  rounded-2xl
                  border
                  border-[#242D43]
                  bg-[#0D1322]
                  p-5
                "
              >

                <div
                  className="
                    flex
                    items-start
                    justify-between
                    gap-4
                  "
                >

                  <div
                    className="
                      flex
                      min-w-0
                      gap-3
                    "
                  >

                    <div
                      className="
                        flex
                        h-11
                        w-11
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        bg-violet-500/10
                        text-violet-400
                      "
                    >
                      <BookOpen size={20} />
                    </div>


                    <div className="min-w-0">

                      <h3
                        className="
                          truncate
                          font-semibold
                          text-white
                        "
                      >
                        {item.name}
                      </h3>


                      <p
                        className="
                          mt-1
                          text-sm
                          text-gray-500
                        "
                      >
                        {[
                          item.subject,
                          item.board,
                        ]
                          .filter(Boolean)
                          .join(" • ") ||
                          "No subject information"}
                      </p>

                    </div>

                  </div>


                  <div className="flex">

                    <IconButton
                      title="Edit"
                      onClick={() =>
                        openEdit(item)
                      }
                    >
                      <Pencil size={16} />
                    </IconButton>


                    <IconButton
                      title="Delete"
                      danger
                      onClick={() =>
                        remove(item)
                      }
                    >
                      <Trash2 size={16} />
                    </IconButton>

                  </div>

                </div>


                <div
                  className="
                    mt-5
                    flex
                    items-center
                    justify-between
                    border-t
                    border-[#20283A]
                    pt-4
                    text-sm
                  "
                >

                  <span className="text-gray-500">
                    Students
                  </span>

                  <span className="font-medium text-gray-200">
                    {studentCount}
                  </span>

                </div>


                {item.description && (

                  <p
                    className="
                      mt-4
                      text-sm
                      leading-6
                      text-gray-500
                    "
                  >
                    {item.description}
                  </p>

                )}

              </article>

            );

          })}

        </div>

      )}

    </section>

  );

}


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
  placeholder:text-gray-600
  focus:border-violet-500
`;


function SectionHeading({
  title,
  description,
  button,
  onClick,
}) {

  return (

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
          {title}
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          {description}
        </p>

      </div>


      <button
        type="button"
        onClick={onClick}
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

        {button}
      </button>

    </div>

  );

}


function FormHeader({
  title,
  onClose,
}) {

  return (

    <div
      className="
        mb-5
        flex
        items-center
        justify-between
      "
    >

      <h3 className="font-semibold text-white">
        {title}
      </h3>


      <button
        type="button"
        onClick={onClose}
        className="text-gray-500 hover:text-white"
      >
        <X size={19} />
      </button>

    </div>

  );

}


function Input({
  label,
  value,
  onChange,
  placeholder = "",
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
        placeholder={placeholder}
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


function FormActions({
  saving,
  editing,
  onCancel,
}) {

  return (

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
        onClick={onCancel}
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
          : editing
            ? "Save Changes"
            : "Create Class"}
      </button>

    </div>

  );

}


function IconButton({
  children,
  onClick,
  title,
  danger = false,
}) {

  return (

    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`
        rounded-lg
        p-2
        transition

        ${
          danger
            ? "text-gray-500 hover:bg-red-500/10 hover:text-red-400"
            : "text-gray-500 hover:bg-white/5 hover:text-white"
        }
      `}
    >
      {children}
    </button>

  );

}


function EmptyState({
  onCreate,
}) {

  return (

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
      <BookOpen
        size={35}
        className="mx-auto text-gray-600"
      />

      <h3 className="mt-4 font-semibold text-white">
        No classes yet
      </h3>

      <p className="mt-2 text-sm text-gray-500">
        Create your first teaching class.
      </p>

      <button
        type="button"
        onClick={onCreate}
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
        Create Class
      </button>
    </div>

  );

}