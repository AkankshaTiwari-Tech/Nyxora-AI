import {
  useMemo,
  useState,
} from "react";

import {
  Pencil,
  Plus,
  Search,
  Trash2,
  UserRound,
  X,
} from "lucide-react";

import {
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


export default function WorkspaceStudents({
  students,
  classes,
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


  function openCreate() {

    setEditingId(null);

    setForm(
      createEmptyStudent()
    );

    setFormOpen(true);

  }


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
            Student profiles can later be used by Nyxora for personalized reports.
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
            gap-4
            lg:grid-cols-2
            2xl:grid-cols-3
          "
        >

          {visibleStudents.map(
            (student) => (

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
                        openEdit(student)
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
                        remove(student)
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
                      Performance
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

              </article>

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
  type = "text",
}) {

  return (

    <label className="space-y-2">

      <span className="text-sm text-gray-400">
        {label}
      </span>

      <input
        type={type}
        required={required}
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