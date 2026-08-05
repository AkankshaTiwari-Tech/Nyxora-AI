import {
  useState,
} from "react";

import {
  BookOpen,
  Pencil,
  Plus,
  Sparkles,
  Trash2,
  Users,
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

    <section className="relative">

      {/* ================================================
          SECTION HEADING
      ================================================= */}

      <SectionHeading
        title="Classes"
        description="Create teaching groups that can be used by students, documents and Nyxora AI."
        button="Add Class"
        onClick={openCreate}
      />


      {/* ================================================
          CREATE / EDIT FORM
      ================================================= */}

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

          {/* FORM AMBIENT GLOWS */}

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


          {/* TOP GRADIENT ACCENT */}

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

                <span
                  className="
                    text-sm
                    font-medium
                    text-slate-400
                  "
                >
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

              <span
                className="
                  text-sm
                  font-medium
                  text-slate-400
                "
              >
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
                placeholder="Add a short description for this class..."
                className={`${fieldClass} resize-none`}
              />

            </label>


            <FormActions
              saving={saving}
              editing={
                Boolean(
                  editingId
                )
              }
              onCancel={closeForm}
            />

          </div>

        </form>

      )}


      {/* ================================================
          EMPTY STATE / CLASS CARDS
      ================================================= */}

      {classes.length === 0 ? (

        <EmptyState
          onCreate={openCreate}
        />

      ) : (

        <div
          className="
            grid
            gap-5
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

                {/* CARD GLOWS */}

                <div
                  className="
                    pointer-events-none
                    absolute
                    -right-16
                    -top-16
                    h-40
                    w-40
                    rounded-full
                    bg-violet-500/[0.08]
                    blur-[70px]
                    transition
                    duration-300
                    group-hover:bg-violet-500/[0.12]
                  "
                />


                <div
                  className="
                    pointer-events-none
                    absolute
                    -bottom-16
                    -left-16
                    h-32
                    w-32
                    rounded-full
                    bg-cyan-500/[0.04]
                    blur-[60px]
                  "
                />


                {/* TOP ACCENT */}

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

                  {/* CARD HEADER */}

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
                          rounded-xl
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
                        <BookOpen
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
                          {item.name}
                        </h3>


                        <p
                          className="
                            mt-1.5
                            truncate
                            text-sm
                            text-slate-500
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


                    {/* ACTIONS */}

                    <div
                      className="
                        flex
                        shrink-0
                        items-center
                        gap-1
                      "
                    >

                      <IconButton
                        title="Edit"
                        onClick={() =>
                          openEdit(
                            item
                          )
                        }
                      >
                        <Pencil
                          size={16}
                        />
                      </IconButton>


                      <IconButton
                        title="Delete"
                        danger
                        onClick={() =>
                          remove(
                            item
                          )
                        }
                      >
                        <Trash2
                          size={16}
                        />
                      </IconButton>

                    </div>

                  </div>


                  {/* STUDENT COUNT */}

                  <div
                    className="
                      mt-5
                      flex
                      items-center
                      justify-between
                      rounded-xl
                      border
                      border-white/[0.055]
                      bg-white/[0.025]
                      px-3.5
                      py-3
                    "
                  >

                    <div
                      className="
                        flex
                        items-center
                        gap-2
                        text-sm
                        text-slate-500
                      "
                    >

                      <Users
                        size={15}
                        className="
                          text-violet-400
                        "
                      />

                      Students

                    </div>


                    <span
                      className="
                        flex
                        min-w-7
                        items-center
                        justify-center
                        rounded-lg
                        bg-violet-500/10
                        px-2
                        py-1
                        text-sm
                        font-semibold
                        text-violet-200
                      "
                    >
                      {studentCount}
                    </span>

                  </div>


                  {/* DESCRIPTION */}

                  {item.description && (

                    <p
                      className="
                        mt-4
                        line-clamp-3
                        text-sm
                        leading-6
                        text-slate-500
                      "
                    >
                      {item.description}
                    </p>

                  )}

                </div>

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


/* ====================================================
   SECTION HEADING
==================================================== */

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

          Manage Workspace

        </div>


        <h2
          className="
            text-xl
            font-bold
            tracking-tight
            text-white
          "
        >
          {title}
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
          {description}
        </p>

      </div>


      <button
        type="button"
        onClick={onClick}
        className="
          group
          relative
          flex
          items-center
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


        <Plus
          size={17}
          className="
            relative
            z-10
          "
        />


        <span
          className="
            relative
            z-10
          "
        >
          {button}
        </span>

      </button>

    </div>

  );

}


/* ====================================================
   FORM HEADER
==================================================== */

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

      <div>

        <div
          className="
            flex
            items-center
            gap-2
          "
        >

          <div
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-lg
              bg-violet-500/10
              text-violet-300
            "
          >
            <BookOpen
              size={16}
            />
          </div>


          <h3
            className="
              font-semibold
              text-white
            "
          >
            {title}
          </h3>

        </div>

      </div>


      <button
        type="button"
        onClick={onClose}
        className="
          flex
          h-9
          w-9
          items-center
          justify-center
          rounded-lg
          text-slate-500
          transition

          hover:bg-white/[0.05]
          hover:text-white
        "
      >
        <X
          size={18}
        />
      </button>

    </div>

  );

}


/* ====================================================
   INPUT
==================================================== */

function Input({
  label,
  value,
  onChange,
  placeholder = "",
  required = false,
}) {

  return (

    <label className="space-y-2">

      <span
        className="
          text-sm
          font-medium
          text-slate-400
        "
      >
        {label}

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


/* ====================================================
   FORM ACTIONS
==================================================== */

function FormActions({
  saving,
  editing,
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


        <span
          className="
            relative
            z-10
          "
        >
          {saving
            ? "Saving..."
            : editing
              ? "Save Changes"
              : "Create Class"}
        </span>

      </button>

    </div>

  );

}


/* ====================================================
   ICON BUTTON
==================================================== */

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
        flex
        h-9
        w-9
        items-center
        justify-center
        rounded-lg
        border
        border-transparent
        transition-all
        duration-200

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


/* ====================================================
   EMPTY STATE
==================================================== */

function EmptyState({
  onCreate,
}) {

  return (

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

      {/* EMPTY STATE GLOW */}

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
          <BookOpen
            size={25}
          />
        </div>


        <h3
          className="
            mt-5
            text-base
            font-semibold
            text-white
          "
        >
          No classes yet
        </h3>


        <p
          className="
            mt-2
            text-sm
            text-slate-500
          "
        >
          Create your first teaching class.
        </p>


        <button
          type="button"
          onClick={onCreate}
          className="
            group
            relative
            mt-6
            inline-flex
            items-center
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


          <Plus
            size={16}
            className="
              relative
              z-10
            "
          />


          <span
            className="
              relative
              z-10
            "
          >
            Create Class
          </span>

        </button>

      </div>

    </div>

  );

}