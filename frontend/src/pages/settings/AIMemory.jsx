import {
  useEffect,
  useState,
} from "react";

import {
  Brain,
  User,
  Heart,
  Target,
  Settings,
  MessageSquare,
  Trash2,
  Sparkles,
  X,
  Pencil,
  Check,
  Plus,
} from "lucide-react";

import {
  getMemory,
  clearMemory,
  addMemoryItem,
  deleteMemoryItem,
  saveMemoryPreference,
  deleteMemoryPreference,
  deleteUserInfo,
  updateUserInfo,
} from "../../services/memoryService";


// ======================================================
// AI MEMORY PAGE
// ======================================================

export default function AIMemory() {

  const [memory, setMemory] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [clearing, setClearing] =
    useState(false);

  const [
    deletingItem,
    setDeletingItem,
  ] = useState(null);


  // ====================================================
  // ABOUT YOU STATE
  // ====================================================

  const [
    editingInfoKey,
    setEditingInfoKey,
  ] = useState(null);

  const [
    editingInfoValue,
    setEditingInfoValue,
  ] = useState("");

  const [
    savingInfo,
    setSavingInfo,
  ] = useState(false);

  const [
    addingInfo,
    setAddingInfo,
  ] = useState(false);

  const [
    infoKeyInput,
    setInfoKeyInput,
  ] = useState("");

  const [
    infoValueInput,
    setInfoValueInput,
  ] = useState("");


  // ====================================================
  // INTEREST STATE
  // ====================================================

  const [
    addingInterest,
    setAddingInterest,
  ] = useState(false);

  const [
    interestInput,
    setInterestInput,
  ] = useState("");

  const [
    savingInterest,
    setSavingInterest,
  ] = useState(false);


  // ====================================================
  // SKILL STATE
  // ====================================================

  const [
    addingSkill,
    setAddingSkill,
  ] = useState(false);

  const [
    skillInput,
    setSkillInput,
  ] = useState("");

  const [
    savingSkill,
    setSavingSkill,
  ] = useState(false);


  // ====================================================
  // PREFERENCE STATE
  // ====================================================

  const [
    addingPreference,
    setAddingPreference,
  ] = useState(false);

  const [
    preferenceKeyInput,
    setPreferenceKeyInput,
  ] = useState("");

  const [
    preferenceValueInput,
    setPreferenceValueInput,
  ] = useState("");

  const [
    savingPreference,
    setSavingPreference,
  ] = useState(false);


  // ====================================================
  // LOAD MEMORY
  // ====================================================

  useEffect(() => {

    async function loadMemory() {

      try {

        const data =
          await getMemory();

        setMemory(data);

      } catch (error) {

        console.error(
          "Failed to load AI memory:",
          error
        );

      } finally {

        setLoading(false);

      }

    }

    loadMemory();

  }, []);


  // ====================================================
  // ADD ARRAY ITEM
  // ====================================================

  const handleAddArrayItem =
    async (
      category,
      value,
      setValue,
      setAdding,
      setSaving
    ) => {

      const cleanValue =
        value.trim();


      if (!cleanValue) {
        return;
      }


      try {

        setSaving(true);


        const result =
          await addMemoryItem(
            category,
            cleanValue
          );


        if (
          result?.reason ===
          "duplicate"
        ) {

          setValue("");

          setAdding(false);

          return;

        }


        if (
          result?.added === false
        ) {

          return;

        }


        setMemory(
          (current) => {

            const currentMemory =
              current || {};


            const currentItems =
              Array.isArray(
                currentMemory[
                  category
                ]
              )
                ? currentMemory[
                    category
                  ]
                : [];


            return {

              ...currentMemory,

              [category]: [
                ...currentItems,
                cleanValue,
              ],

            };

          }
        );


        setValue("");

        setAdding(false);

      } catch (error) {

        console.error(
          `Failed to add ${category}:`,
          error
        );

      } finally {

        setSaving(false);

      }

    };


  // ====================================================
  // DELETE ARRAY ITEM
  // ====================================================

  const handleDeleteItem =
    async (
      category,
      item
    ) => {

      const deleteId =
        `${category}-${item}`;


      try {

        setDeletingItem(
          deleteId
        );


        await deleteMemoryItem(
          category,
          item
        );


        setMemory(
          (current) => {

            if (!current) {
              return current;
            }


            return {

              ...current,

              [category]:
                Array.isArray(
                  current[
                    category
                  ]
                )
                  ? current[
                      category
                    ].filter(
                      (value) =>
                        value !==
                        item
                    )
                  : [],

            };

          }
        );

      } catch (error) {

        console.error(
          "Failed to delete memory item:",
          error
        );

      } finally {

        setDeletingItem(null);

      }

    };


  // ====================================================
  // ADD ABOUT YOU INFO
  // ====================================================

  const handleAddInfo =
    async () => {

      const cleanKey =
        normalizeKey(
          infoKeyInput
        );

      const cleanValue =
        infoValueInput.trim();


      if (
        !cleanKey ||
        !cleanValue
      ) {
        return;
      }


      try {

        setSavingInfo(true);


        await updateUserInfo(
          cleanKey,
          cleanValue
        );


        setMemory(
          (current) => {

            const currentMemory =
              current || {};


            return {

              ...currentMemory,

              userInfo: {

                ...(
                  currentMemory
                    .userInfo ||
                  {}
                ),

                [cleanKey]:
                  cleanValue,

              },

            };

          }
        );


        setInfoKeyInput("");

        setInfoValueInput("");

        setAddingInfo(false);

      } catch (error) {

        console.error(
          "Failed to add user info:",
          error
        );

      } finally {

        setSavingInfo(false);

      }

    };


  // ====================================================
  // START EDIT INFO
  // ====================================================

  const handleStartInfoEdit =
    (
      key,
      value
    ) => {

      setEditingInfoKey(
        key
      );

      setEditingInfoValue(
        String(value)
      );

    };


  // ====================================================
  // CANCEL EDIT INFO
  // ====================================================

  const handleCancelInfoEdit =
    () => {

      setEditingInfoKey(null);

      setEditingInfoValue("");

    };


  // ====================================================
  // SAVE EDITED INFO
  // ====================================================

  const handleSaveInfo =
    async () => {

      const cleanValue =
        editingInfoValue.trim();


      if (
        !editingInfoKey ||
        !cleanValue
      ) {
        return;
      }


      try {

        setSavingInfo(true);


        await updateUserInfo(
          editingInfoKey,
          cleanValue
        );


        setMemory(
          (current) => {

            if (!current) {
              return current;
            }


            return {

              ...current,

              userInfo: {

                ...(
                  current.userInfo ||
                  {}
                ),

                [editingInfoKey]:
                  cleanValue,

              },

            };

          }
        );


        setEditingInfoKey(null);

        setEditingInfoValue("");

      } catch (error) {

        console.error(
          "Failed to update user info:",
          error
        );

      } finally {

        setSavingInfo(false);

      }

    };


  // ====================================================
  // DELETE ABOUT YOU INFO
  // ====================================================

  const handleDeleteInfo =
    async (key) => {

      const deleteId =
        `userInfo-${key}`;


      try {

        setDeletingItem(
          deleteId
        );


        await deleteUserInfo(
          key
        );


        setMemory(
          (current) => {

            if (!current) {
              return current;
            }


            const userInfo = {

              ...(
                current.userInfo ||
                {}
              ),

            };


            delete userInfo[key];


            const updated = {

              ...current,

              userInfo,

            };


            // Support old top-level
            // name field too.
            if (
              key === "name" &&
              Object.prototype
                .hasOwnProperty
                .call(
                  updated,
                  "name"
                )
            ) {

              delete updated.name;

            }


            return updated;

          }
        );


        if (
          editingInfoKey === key
        ) {

          handleCancelInfoEdit();

        }

      } catch (error) {

        console.error(
          "Failed to delete user info:",
          error
        );

      } finally {

        setDeletingItem(null);

      }

    };


  // ====================================================
  // ADD PREFERENCE
  // ====================================================

  const handleAddPreference =
    async () => {

      const cleanKey =
        normalizeKey(
          preferenceKeyInput
        );

      const cleanValue =
        preferenceValueInput
          .trim();


      if (
        !cleanKey ||
        !cleanValue
      ) {
        return;
      }


      try {

        setSavingPreference(
          true
        );


        await saveMemoryPreference(
          cleanKey,
          cleanValue
        );


        setMemory(
          (current) => {

            const currentMemory =
              current || {};


            return {

              ...currentMemory,

              preferences: {

                ...(
                  currentMemory
                    .preferences ||
                  {}
                ),

                [cleanKey]:
                  cleanValue,

              },

            };

          }
        );


        setPreferenceKeyInput("");

        setPreferenceValueInput("");

        setAddingPreference(false);

      } catch (error) {

        console.error(
          "Failed to save preference:",
          error
        );

      } finally {

        setSavingPreference(
          false
        );

      }

    };


  // ====================================================
  // DELETE PREFERENCE
  // ====================================================

  const handleDeletePreference =
    async (key) => {

      const deleteId =
        `preference-${key}`;


      try {

        setDeletingItem(
          deleteId
        );


        await deleteMemoryPreference(
          key
        );


        setMemory(
          (current) => {

            if (!current) {
              return current;
            }


            const preferences = {

              ...(
                current.preferences ||
                {}
              ),

            };


            delete preferences[key];


            return {

              ...current,

              preferences,

            };

          }
        );

      } catch (error) {

        console.error(
          "Failed to delete preference:",
          error
        );

      } finally {

        setDeletingItem(null);

      }

    };


  // ====================================================
  // CLEAR ALL MEMORY
  // ====================================================

  const handleClear =
    async () => {

      const confirmed =
        window.confirm(
          "Clear all Nyxora AI memory? This cannot be undone."
        );


      if (!confirmed) {
        return;
      }


      try {

        setClearing(true);


        await clearMemory();


        setMemory(null);

      } catch (error) {

        console.error(
          "Failed to clear AI memory:",
          error
        );

      } finally {

        setClearing(false);

      }

    };


  // ====================================================
  // LOADING
  // ====================================================

  if (loading) {

    return (

      <div
        className="
          min-h-full
          flex
          items-center
          justify-center
          text-gray-400
        "
      >

        <div
          className="
            flex
            items-center
            gap-3
          "
        >

          <Brain
            size={22}
            className="
              animate-pulse
              text-violet-400
            "
          />

          Loading Nyxora memory...

        </div>

      </div>

    );

  }


  // ====================================================
  // MEMORY VALUES
  // ====================================================

  const userInfo = {

    ...(
      memory?.userInfo ||
      {}
    ),

  };


  // Compatibility with old
  // top-level name structure.
  if (
    memory?.name &&
    !userInfo.name
  ) {

    userInfo.name =
      memory.name;

  }


  const userInfoEntries =
    Object.entries(
      userInfo
    );


  const interests =
    Array.isArray(
      memory?.interests
    )
      ? memory.interests
      : [];


  const skills =
    Array.isArray(
      memory?.skills
    )
      ? memory.skills
      : [];


  const preferences =
    memory?.preferences &&
    typeof memory.preferences ===
      "object" &&
    !Array.isArray(
      memory.preferences
    )
      ? Object.entries(
          memory.preferences
        )
      : [];


  const recentMessages =
    Array.isArray(
      memory?.recentMessages
    )
      ? memory.recentMessages
      : [];


  // ====================================================
  // UI
  // ====================================================

  return (

    <div
      className="
        min-h-full
        bg-[#050816]
        px-8
        py-8
        text-white
      "
    >

      <div
        className="
          max-w-6xl
          mx-auto
        "
      >


        {/* HEADER */}

        <div className="mb-8">

          <div
            className="
              flex
              items-center
              gap-4
              mb-3
            "
          >

            <div
              className="
                w-14
                h-14
                rounded-2xl
                bg-gradient-to-br
                from-violet-600
                to-indigo-600
                flex
                items-center
                justify-center
                shadow-lg
                shadow-violet-900/20
              "
            >

              <Brain size={28} />

            </div>


            <div>

              <h1
                className="
                  text-3xl
                  font-bold
                  text-white
                "
              >
                Nyxora Memory
              </h1>


              <div
                className="
                  flex
                  items-center
                  gap-2
                  text-sm
                  text-violet-300
                  mt-1
                "
              >

                <Sparkles size={14} />

                Personal AI Memory

              </div>

            </div>

          </div>


          <p
            className="
              max-w-2xl
              text-gray-400
              leading-7
            "
          >
            Nyxora remembers useful details
            from your conversations to provide
            more personalized and relevant
            responses.
          </p>

        </div>


        {/* MEMORY GRID */}

        <div
          className="
            grid
            grid-cols-1
            xl:grid-cols-2
            gap-5
          "
        >


          {/* ABOUT YOU */}

          <MemoryCard
            icon={User}
            title="About You"
            description="Basic information Nyxora remembers about you."
          >

            <div className="space-y-3">

              {userInfoEntries.length >
              0 ? (

                userInfoEntries.map(
                  ([key, value]) => (

                    editingInfoKey ===
                    key ? (

                      <EditValueForm
                        key={key}
                        label={
                          formatLabel(
                            key
                          )
                        }
                        value={
                          editingInfoValue
                        }
                        setValue={
                          setEditingInfoValue
                        }
                        saving={
                          savingInfo
                        }
                        onSave={
                          handleSaveInfo
                        }
                        onCancel={
                          handleCancelInfoEdit
                        }
                      />

                    ) : (

                      <EditableMemoryValue
                        key={key}
                        label={
                          formatLabel(
                            key
                          )
                        }
                        value={
                          formatValue(
                            value
                          )
                        }
                        onEdit={() =>
                          handleStartInfoEdit(
                            key,
                            value
                          )
                        }
                        onDelete={() =>
                          handleDeleteInfo(
                            key
                          )
                        }
                        deleting={
                          deletingItem ===
                          `userInfo-${key}`
                        }
                      />

                    )

                  )
                )

              ) : (

                <EmptyValue />

              )}


              {addingInfo ? (

                <KeyValueAddForm
                  keyPlaceholder="Field e.g. Occupation"
                  valuePlaceholder="Value e.g. Student"
                  keyValue={
                    infoKeyInput
                  }
                  setKeyValue={
                    setInfoKeyInput
                  }
                  value={
                    infoValueInput
                  }
                  setValue={
                    setInfoValueInput
                  }
                  saving={
                    savingInfo
                  }
                  onSave={
                    handleAddInfo
                  }
                  onCancel={() => {

                    setInfoKeyInput(
                      ""
                    );

                    setInfoValueInput(
                      ""
                    );

                    setAddingInfo(
                      false
                    );

                  }}
                />

              ) : (

                <AddButton
                  label="Add Info"
                  onClick={() =>
                    setAddingInfo(
                      true
                    )
                  }
                />

              )}

            </div>

          </MemoryCard>


          {/* INTERESTS */}

          <MemoryCard
            icon={Heart}
            title="Interests"
            description="Topics and areas you are interested in."
          >

            {interests.length > 0 ? (

              <TagList
                items={interests}
                category="interests"
                deletingItem={
                  deletingItem
                }
                onDelete={
                  handleDeleteItem
                }
              />

            ) : (

              <EmptyValue />

            )}


            <div className="mt-4">

              {addingInterest ? (

                <SingleAddForm
                  placeholder="Add an interest..."
                  value={
                    interestInput
                  }
                  setValue={
                    setInterestInput
                  }
                  saving={
                    savingInterest
                  }
                  onSave={() =>
                    handleAddArrayItem(
                      "interests",
                      interestInput,
                      setInterestInput,
                      setAddingInterest,
                      setSavingInterest
                    )
                  }
                  onCancel={() => {

                    setInterestInput(
                      ""
                    );

                    setAddingInterest(
                      false
                    );

                  }}
                />

              ) : (

                <AddButton
                  label="Add Interest"
                  onClick={() =>
                    setAddingInterest(
                      true
                    )
                  }
                />

              )}

            </div>

          </MemoryCard>


          {/* SKILLS */}

          <MemoryCard
            icon={Target}
            title="Skills"
            description="Skills Nyxora has learned about you."
          >

            {skills.length > 0 ? (

              <TagList
                items={skills}
                category="skills"
                deletingItem={
                  deletingItem
                }
                onDelete={
                  handleDeleteItem
                }
              />

            ) : (

              <EmptyValue />

            )}


            <div className="mt-4">

              {addingSkill ? (

                <SingleAddForm
                  placeholder="Add a skill..."
                  value={
                    skillInput
                  }
                  setValue={
                    setSkillInput
                  }
                  saving={
                    savingSkill
                  }
                  onSave={() =>
                    handleAddArrayItem(
                      "skills",
                      skillInput,
                      setSkillInput,
                      setAddingSkill,
                      setSavingSkill
                    )
                  }
                  onCancel={() => {

                    setSkillInput(
                      ""
                    );

                    setAddingSkill(
                      false
                    );

                  }}
                />

              ) : (

                <AddButton
                  label="Add Skill"
                  onClick={() =>
                    setAddingSkill(
                      true
                    )
                  }
                />

              )}

            </div>

          </MemoryCard>


          {/* PREFERENCES */}

          <MemoryCard
            icon={Settings}
            title="Preferences"
            description="Preferences Nyxora uses to personalize responses."
          >

            <div className="space-y-3">

              {preferences.length >
              0 ? (

                preferences.map(
                  ([key, value]) => (

                    <MemoryValue
                      key={key}
                      label={
                        formatLabel(
                          key
                        )
                      }
                      value={
                        formatValue(
                          value
                        )
                      }
                      deleting={
                        deletingItem ===
                        `preference-${key}`
                      }
                      onDelete={() =>
                        handleDeletePreference(
                          key
                        )
                      }
                    />

                  )
                )

              ) : (

                <EmptyValue />

              )}


              {addingPreference ? (

                <KeyValueAddForm
                  keyPlaceholder="Preference e.g. Response Style"
                  valuePlaceholder="Value e.g. Concise"
                  keyValue={
                    preferenceKeyInput
                  }
                  setKeyValue={
                    setPreferenceKeyInput
                  }
                  value={
                    preferenceValueInput
                  }
                  setValue={
                    setPreferenceValueInput
                  }
                  saving={
                    savingPreference
                  }
                  onSave={
                    handleAddPreference
                  }
                  onCancel={() => {

                    setPreferenceKeyInput(
                      ""
                    );

                    setPreferenceValueInput(
                      ""
                    );

                    setAddingPreference(
                      false
                    );

                  }}
                />

              ) : (

                <AddButton
                  label="Add Preference"
                  onClick={() =>
                    setAddingPreference(
                      true
                    )
                  }
                />

              )}

            </div>

          </MemoryCard>

        </div>


        {/* RECENT CONTEXT */}

        {recentMessages.length > 0 && (

          <div
            className="
              mt-5
              border
              border-[#252D44]
              bg-[#101625]
              rounded-2xl
              p-6
            "
          >

            <div
              className="
                flex
                items-center
                gap-3
                mb-5
              "
            >

              <div
                className="
                  w-10
                  h-10
                  rounded-xl
                  bg-violet-600/10
                  flex
                  items-center
                  justify-center
                "
              >

                <MessageSquare
                  size={20}
                  className="
                    text-violet-400
                  "
                />

              </div>


              <div>

                <h2
                  className="
                    font-semibold
                    text-lg
                  "
                >
                  Recent Context
                </h2>

                <p
                  className="
                    text-sm
                    text-gray-500
                  "
                >
                  Recent conversation context
                  available to Nyxora.
                </p>

              </div>

            </div>


            <div className="space-y-3">

              {recentMessages
                .slice(-3)
                .map(
                  (
                    item,
                    index
                  ) => (

                    <div
                      key={index}
                      className="
                        rounded-xl
                        bg-[#151C2D]
                        border
                        border-[#252D44]
                        p-4
                      "
                    >

                      {item.user && (

                        <p
                          className="
                            text-sm
                            text-gray-300
                            mb-2
                          "
                        >

                          <span
                            className="
                              text-violet-400
                              font-medium
                            "
                          >
                            You:
                          </span>{" "}

                          {item.user}

                        </p>

                      )}


                      {item.ai && (

                        <p
                          className="
                            text-sm
                            text-gray-400
                            line-clamp-3
                          "
                        >

                          <span
                            className="
                              text-indigo-400
                              font-medium
                            "
                          >
                            Nyxora:
                          </span>{" "}

                          {item.ai}

                        </p>

                      )}

                    </div>

                  )
                )}

            </div>

          </div>

        )}


        {/* CLEAR MEMORY */}

        {memory && (

          <div
            className="
              mt-6
              flex
              items-center
              justify-between
              gap-5
              border
              border-red-500/20
              bg-red-500/5
              rounded-2xl
              p-5
            "
          >

            <div>

              <h3
                className="
                  font-semibold
                  text-white
                  mb-1
                "
              >
                Clear AI Memory
              </h3>

              <p
                className="
                  text-sm
                  text-gray-400
                "
              >
                Remove all information
                Nyxora currently remembers
                about you.
              </p>

            </div>


            <button
              type="button"
              onClick={
                handleClear
              }
              disabled={
                clearing
              }
              className="
                shrink-0
                flex
                items-center
                gap-2
                rounded-xl
                border
                border-red-500/30
                bg-red-500/10
                px-4
                py-2.5
                text-sm
                font-medium
                text-red-400
                hover:bg-red-500/20
                disabled:opacity-50
                disabled:cursor-not-allowed
                transition
              "
            >

              <Trash2 size={17} />

              {clearing
                ? "Clearing..."
                : "Clear Memory"}

            </button>

          </div>

        )}

      </div>

    </div>

  );

}


// ======================================================
// MEMORY CARD
// ======================================================

function MemoryCard({
  icon: Icon,
  title,
  description,
  children,
}) {

  return (

    <div
      className="
        border
        border-[#252D44]
        bg-[#101625]
        rounded-2xl
        p-6
      "
    >

      <div
        className="
          flex
          items-start
          gap-3
          mb-5
        "
      >

        <div
          className="
            w-10
            h-10
            rounded-xl
            bg-violet-600/10
            flex
            items-center
            justify-center
            shrink-0
          "
        >

          <Icon
            size={20}
            className="
              text-violet-400
            "
          />

        </div>


        <div>

          <h2
            className="
              font-semibold
              text-lg
            "
          >
            {title}
          </h2>

          <p
            className="
              text-sm
              text-gray-500
              mt-1
            "
          >
            {description}
          </p>

        </div>

      </div>


      {children}

    </div>

  );

}


// ======================================================
// ADD BUTTON
// ======================================================

function AddButton({
  label,
  onClick,
}) {

  return (

    <button
      type="button"
      onClick={onClick}
      className="
        flex
        items-center
        gap-2
        rounded-lg
        border
        border-dashed
        border-violet-500/30
        bg-violet-500/5
        px-3
        py-2
        text-sm
        font-medium
        text-violet-400
        hover:bg-violet-500/10
        hover:border-violet-500/50
        transition
      "
    >

      <Plus size={16} />

      {label}

    </button>

  );

}


// ======================================================
// SINGLE VALUE ADD FORM
// ======================================================

function SingleAddForm({
  placeholder,
  value,
  setValue,
  saving,
  onSave,
  onCancel,
}) {

  return (

    <div
      className="
        flex
        items-center
        gap-2
      "
    >

      <input
        type="text"
        value={value}
        onChange={(event) =>
          setValue(
            event.target.value
          )
        }
        onKeyDown={(event) => {

          if (
            event.key ===
            "Enter"
          ) {
            onSave();
          }

          if (
            event.key ===
            "Escape"
          ) {
            onCancel();
          }

        }}
        autoFocus
        placeholder={
          placeholder
        }
        className="
          flex-1
          min-w-0
          rounded-lg
          border
          border-[#343E59]
          bg-[#0D1321]
          px-3
          py-2.5
          text-sm
          text-white
          placeholder:text-gray-600
          outline-none
          focus:border-violet-500
        "
      />


      <SaveButton
        saving={saving}
        disabled={
          !value.trim()
        }
        onClick={onSave}
      />


      <CancelButton
        disabled={saving}
        onClick={onCancel}
      />

    </div>

  );

}


// ======================================================
// KEY + VALUE ADD FORM
// ======================================================

function KeyValueAddForm({
  keyPlaceholder,
  valuePlaceholder,
  keyValue,
  setKeyValue,
  value,
  setValue,
  saving,
  onSave,
  onCancel,
}) {

  return (

    <div
      className="
        rounded-xl
        border
        border-violet-500/30
        bg-[#151C2D]
        p-3
      "
    >

      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          gap-2
        "
      >

        <input
          type="text"
          value={keyValue}
          onChange={(event) =>
            setKeyValue(
              event.target.value
            )
          }
          autoFocus
          placeholder={
            keyPlaceholder
          }
          className="
            min-w-0
            rounded-lg
            border
            border-[#343E59]
            bg-[#0D1321]
            px-3
            py-2.5
            text-sm
            text-white
            placeholder:text-gray-600
            outline-none
            focus:border-violet-500
          "
        />


        <input
          type="text"
          value={value}
          onChange={(event) =>
            setValue(
              event.target.value
            )
          }
          onKeyDown={(event) => {

            if (
              event.key ===
              "Enter"
            ) {
              onSave();
            }

            if (
              event.key ===
              "Escape"
            ) {
              onCancel();
            }

          }}
          placeholder={
            valuePlaceholder
          }
          className="
            min-w-0
            rounded-lg
            border
            border-[#343E59]
            bg-[#0D1321]
            px-3
            py-2.5
            text-sm
            text-white
            placeholder:text-gray-600
            outline-none
            focus:border-violet-500
          "
        />

      </div>


      <div
        className="
          flex
          items-center
          justify-end
          gap-2
          mt-3
        "
      >

        <SaveButton
          saving={saving}
          disabled={
            !keyValue.trim() ||
            !value.trim()
          }
          onClick={onSave}
        />

        <CancelButton
          disabled={saving}
          onClick={onCancel}
        />

      </div>

    </div>

  );

}


// ======================================================
// EDIT VALUE FORM
// ======================================================

function EditValueForm({
  label,
  value,
  setValue,
  saving,
  onSave,
  onCancel,
}) {

  return (

    <div
      className="
        rounded-xl
        bg-[#151C2D]
        border
        border-violet-500/40
        p-4
      "
    >

      <label
        className="
          block
          text-xs
          text-gray-500
          mb-2
        "
      >
        {label}
      </label>


      <div
        className="
          flex
          items-center
          gap-2
        "
      >

        <input
          type="text"
          value={value}
          onChange={(event) =>
            setValue(
              event.target.value
            )
          }
          onKeyDown={(event) => {

            if (
              event.key ===
              "Enter"
            ) {
              onSave();
            }

            if (
              event.key ===
              "Escape"
            ) {
              onCancel();
            }

          }}
          autoFocus
          className="
            flex-1
            min-w-0
            rounded-lg
            border
            border-[#343E59]
            bg-[#0D1321]
            px-3
            py-2.5
            text-sm
            text-white
            outline-none
            focus:border-violet-500
          "
        />


        <SaveButton
          saving={saving}
          disabled={
            !value.trim()
          }
          onClick={onSave}
        />


        <CancelButton
          disabled={saving}
          onClick={onCancel}
        />

      </div>

    </div>

  );

}


// ======================================================
// SAVE BUTTON
// ======================================================

function SaveButton({
  saving,
  disabled,
  onClick,
}) {

  return (

    <button
      type="button"
      onClick={onClick}
      disabled={
        saving ||
        disabled
      }
      title="Save"
      className="
        w-10
        h-10
        shrink-0
        rounded-lg
        flex
        items-center
        justify-center
        bg-violet-600
        text-white
        hover:bg-violet-500
        disabled:opacity-40
        disabled:cursor-not-allowed
        transition
      "
    >

      <Check size={17} />

    </button>

  );

}


// ======================================================
// CANCEL BUTTON
// ======================================================

function CancelButton({
  disabled,
  onClick,
}) {

  return (

    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title="Cancel"
      className="
        w-10
        h-10
        shrink-0
        rounded-lg
        flex
        items-center
        justify-center
        bg-[#20283A]
        text-gray-400
        hover:text-white
        hover:bg-[#293247]
        disabled:opacity-40
        transition
      "
    >

      <X size={17} />

    </button>

  );

}


// ======================================================
// EDITABLE MEMORY VALUE
// ======================================================

function EditableMemoryValue({
  label,
  value,
  onEdit,
  onDelete,
  deleting = false,
}) {

  return (

    <div
      className="
        flex
        items-center
        justify-between
        gap-4
        rounded-xl
        bg-[#151C2D]
        border
        border-[#252D44]
        px-4
        py-3
      "
    >

      <span
        className="
          text-sm
          text-gray-500
        "
      >
        {label}
      </span>


      <div
        className="
          flex
          items-center
          gap-2
        "
      >

        <span
          className="
            text-sm
            font-medium
            text-gray-200
            text-right
            mr-1
          "
        >
          {String(value)}
        </span>


        <button
          type="button"
          onClick={onEdit}
          disabled={deleting}
          title={`Edit ${label}`}
          className="
            w-7
            h-7
            rounded-lg
            flex
            items-center
            justify-center
            text-gray-500
            hover:text-violet-400
            hover:bg-violet-500/10
            disabled:opacity-40
            transition
          "
        >

          <Pencil size={14} />

        </button>


        <button
          type="button"
          onClick={onDelete}
          disabled={deleting}
          title={`Forget ${label}`}
          className="
            w-7
            h-7
            rounded-lg
            flex
            items-center
            justify-center
            text-gray-500
            hover:text-red-400
            hover:bg-red-500/10
            disabled:opacity-40
            transition
          "
        >

          <X size={15} />

        </button>

      </div>

    </div>

  );

}


// ======================================================
// MEMORY VALUE
// ======================================================

function MemoryValue({
  label,
  value,
  onDelete,
  deleting = false,
}) {

  return (

    <div
      className="
        flex
        items-center
        justify-between
        gap-4
        rounded-xl
        bg-[#151C2D]
        border
        border-[#252D44]
        px-4
        py-3
      "
    >

      <span
        className="
          text-sm
          text-gray-500
        "
      >
        {label}
      </span>


      <div
        className="
          flex
          items-center
          gap-3
        "
      >

        <span
          className="
            text-sm
            font-medium
            text-gray-200
            text-right
          "
        >
          {String(value)}
        </span>


        {onDelete && (

          <button
            type="button"
            onClick={onDelete}
            disabled={deleting}
            title={`Remove ${label}`}
            className="
              flex
              items-center
              justify-center
              w-7
              h-7
              rounded-lg
              text-gray-500
              hover:text-red-400
              hover:bg-red-500/10
              disabled:opacity-40
              transition
            "
          >

            <X size={15} />

          </button>

        )}

      </div>

    </div>

  );

}


// ======================================================
// TAG LIST
// ======================================================

function TagList({
  items,
  category,
  deletingItem,
  onDelete,
}) {

  return (

    <div
      className="
        flex
        flex-wrap
        gap-2
      "
    >

      {items.map(
        (item, index) => {

          const deleteId =
            `${category}-${item}`;

          const deleting =
            deletingItem ===
            deleteId;


          return (

            <div
              key={`${item}-${index}`}
              className="
                flex
                items-center
                gap-1
                rounded-lg
                border
                border-violet-500/20
                bg-violet-500/10
                pl-3
                pr-1.5
                py-1.5
                text-sm
                text-violet-300
              "
            >

              <span>
                {item}
              </span>


              <button
                type="button"
                onClick={() =>
                  onDelete(
                    category,
                    item
                  )
                }
                disabled={deleting}
                title={`Forget ${item}`}
                className="
                  w-6
                  h-6
                  rounded-md
                  flex
                  items-center
                  justify-center
                  text-violet-400
                  hover:text-red-400
                  hover:bg-red-500/10
                  disabled:opacity-40
                  transition
                "
              >

                <X size={14} />

              </button>

            </div>

          );

        }
      )}

    </div>

  );

}


// ======================================================
// EMPTY VALUE
// ======================================================

function EmptyValue() {

  return (

    <p
      className="
        text-sm
        text-gray-500
        italic
      "
    >
      Nothing remembered yet.
    </p>

  );

}


// ======================================================
// NORMALIZE KEY
// ======================================================

function normalizeKey(value) {

  const words =
    String(value)
      .trim()
      .replace(
        /[^a-zA-Z0-9 ]/g,
        " "
      )
      .split(/\s+/)
      .filter(Boolean);


  if (
    words.length === 0
  ) {

    return "";

  }


  return (
    words[0].toLowerCase() +
    words
      .slice(1)
      .map(
        (word) =>
          word
            .charAt(0)
            .toUpperCase() +
          word
            .slice(1)
            .toLowerCase()
      )
      .join("")
  );

}


// ======================================================
// FORMAT LABEL
// ======================================================

function formatLabel(value) {

  return String(value)
    .replace(
      /([A-Z])/g,
      " $1"
    )
    .replace(
      /^./,
      (character) =>
        character.toUpperCase()
    );

}


// ======================================================
// FORMAT VALUE
// ======================================================

function formatValue(value) {

  if (
    typeof value ===
    "boolean"
  ) {

    return value
      ? "Yes"
      : "No";

  }


  if (
    Array.isArray(value)
  ) {

    return value.join(", ");

  }


  if (
    value &&
    typeof value ===
      "object"
  ) {

    return Object.values(
      value
    ).join(", ");

  }


  return String(value);

}