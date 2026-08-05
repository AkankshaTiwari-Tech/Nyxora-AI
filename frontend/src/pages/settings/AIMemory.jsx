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
          nyxora-page
          nyxora-grid-bg
          relative
          flex
          min-h-full
          items-center
          justify-center
          overflow-hidden
          px-6
          py-10
        "
      >

        <div
          className="
            pointer-events-none
            absolute
            h-72
            w-72
            rounded-full
            bg-violet-600/[0.08]
            blur-[110px]
          "
        />


        <div
          className="
            relative
            z-10
            flex
            flex-col
            items-center
            gap-4
          "
        >

          <div
            className="
              relative
              flex
              h-14
              w-14
              items-center
              justify-center
            "
          >

            <div
              className="
                absolute
                inset-0
                animate-spin
                rounded-full
                border-2
                border-transparent
                border-r-cyan-400
                border-t-violet-400
              "
            />


            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                border
                border-violet-400/20
                bg-violet-500/10
                text-violet-300
              "
            >

              <Brain size={20} />

            </div>

          </div>


          <div className="text-center">

            <p
              className="
                text-sm
                font-medium
                text-slate-300
              "
            >
              Loading Nyxora memory...
            </p>

            <p
              className="
                mt-1
                text-xs
                text-slate-600
              "
            >
              Preparing your personal context
            </p>

          </div>

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


  const totalMemories =
    userInfoEntries.length +
    interests.length +
    skills.length +
    preferences.length;


  // ====================================================
  // UI
  // ====================================================

  return (

    <main
      className="
        nyxora-page
        nyxora-grid-bg
        relative
        min-h-full
        overflow-hidden
        px-5
        py-7
        text-white
        sm:px-6
        lg:px-8
        lg:py-8
      "
    >

      {/* AMBIENT GLOWS */}

      <div
        className="
          pointer-events-none
          absolute
          -left-48
          -top-48
          h-[460px]
          w-[460px]
          rounded-full
          bg-fuchsia-600/[0.05]
          blur-[140px]
        "
      />


      <div
        className="
          pointer-events-none
          absolute
          -right-52
          top-[18%]
          h-[480px]
          w-[480px]
          rounded-full
          bg-violet-600/[0.05]
          blur-[150px]
        "
      />


      <div
        className="
          pointer-events-none
          absolute
          bottom-[-220px]
          left-[28%]
          h-[520px]
          w-[520px]
          rounded-full
          bg-cyan-500/[0.035]
          blur-[160px]
        "
      />


      <div
        className="
          relative
          z-10
          mx-auto
          w-full
          max-w-[1500px]
        "
      >

        {/* ==================================================
            HEADER
        ================================================== */}

        <section
          className="
            relative
            overflow-hidden
            rounded-3xl
            border
            border-white/[0.07]
            bg-[#080C18]/90
            px-6
            py-6
            shadow-[0_18px_60px_rgba(0,0,0,.22)]
            sm:px-7
            lg:px-8
            lg:py-7
          "
        >

          <div
            className="
              pointer-events-none
              absolute
              -left-20
              -top-24
              h-64
              w-64
              rounded-full
              bg-fuchsia-600/[0.08]
              blur-[95px]
            "
          />


          <div
            className="
              pointer-events-none
              absolute
              -right-16
              -top-24
              h-64
              w-64
              rounded-full
              bg-cyan-400/[0.07]
              blur-[95px]
            "
          />


          <div
            className="
              absolute
              left-8
              right-8
              top-0
              h-px
              bg-gradient-to-r
              from-transparent
              via-violet-400/60
              to-transparent
            "
          />


          <div
            className="
              relative
              z-10
              flex
              flex-col
              gap-6
              lg:flex-row
              lg:items-center
              lg:justify-between
            "
          >

            <div
              className="
                flex
                items-start
                gap-4
              "
            >

              <div
                className="
                  relative
                  flex
                  h-14
                  w-14
                  shrink-0
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-violet-400/20
                  bg-gradient-to-br
                  from-fuchsia-500/15
                  via-violet-500/20
                  to-cyan-400/10
                  text-violet-200
                  shadow-[0_0_30px_rgba(124,58,237,.12)]
                "
              >

                <Brain size={27} />

                <span
                  className="
                    absolute
                    -right-1
                    -top-1
                    h-2.5
                    w-2.5
                    rounded-full
                    bg-fuchsia-400
                    shadow-[0_0_10px_rgba(217,70,239,.9)]
                  "
                />

              </div>


              <div>

                <div
                  className="
                    mb-1.5
                    flex
                    items-center
                    gap-2
                    text-xs
                    font-semibold
                    uppercase
                    tracking-[0.18em]
                    text-violet-300
                  "
                >
<div
  className="
    flex
    h-7
    w-7
    shrink-0
    items-center
    justify-center
  "
>
  <NyxoraOrbitLogo
    size={27}
    animated={true}
  />
</div>

                  Personal AI Memory

                </div>


                <h1
                  className="
                    text-2xl
                    font-bold
                    tracking-tight
                    text-white
                    sm:text-3xl
                  "
                >
                  Nyxora Memory
                </h1>


                <p
                  className="
                    mt-2
                    max-w-2xl
                    text-sm
                    leading-6
                    text-slate-400
                    sm:text-[15px]
                  "
                >
                  Nyxora remembers useful details from your
                  conversations to provide more personalized
                  and relevant responses.
                </p>

              </div>

            </div>


            <div
              className="
                flex
                flex-wrap
                items-center
                gap-3
                lg:justify-end
              "
            >

              <div
                className="
                  rounded-xl
                  border
                  border-white/[0.07]
                  bg-white/[0.025]
                  px-4
                  py-3
                "
              >

                <p
                  className="
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-[0.16em]
                    text-slate-600
                  "
                >
                  Remembered
                </p>

                <p
                  className="
                    mt-1
                    text-lg
                    font-bold
                    text-white
                  "
                >
                  {totalMemories}
                </p>

              </div>


              <div
                className="
                  flex
                  items-center
                  gap-2
                  rounded-xl
                  border
                  border-emerald-400/10
                  bg-emerald-400/[0.04]
                  px-4
                  py-3
                  text-xs
                  font-medium
                  text-emerald-300
                "
              >

                <span
                  className="
                    h-2
                    w-2
                    rounded-full
                    bg-emerald-400
                    shadow-[0_0_8px_rgba(52,211,153,.65)]
                  "
                />

                Memory active

              </div>

            </div>

          </div>

        </section>


        {/* ==================================================
            MEMORY GRID
        ================================================== */}

        <div
          className="
            mt-6
            grid
            grid-cols-1
            gap-5
            xl:grid-cols-2
          "
        >

          {/* ABOUT YOU */}

          <MemoryCard
            icon={User}
            title="About You"
            description="Basic information Nyxora remembers about you."
            accent="fuchsia"
          >

            <div className="space-y-3">

              {userInfoEntries.length > 0 ? (

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

                    setInfoKeyInput("");

                    setInfoValueInput("");

                    setAddingInfo(false);

                  }}
                />

              ) : (

                <AddButton
                  label="Add Info"
                  onClick={() =>
                    setAddingInfo(true)
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
            accent="violet"
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

                    setInterestInput("");

                    setAddingInterest(false);

                  }}
                />

              ) : (

                <AddButton
                  label="Add Interest"
                  onClick={() =>
                    setAddingInterest(true)
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
            accent="cyan"
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

                    setSkillInput("");

                    setAddingSkill(false);

                  }}
                />

              ) : (

                <AddButton
                  label="Add Skill"
                  onClick={() =>
                    setAddingSkill(true)
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
            accent="blue"
          >

            <div className="space-y-3">

              {preferences.length > 0 ? (

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

                    setPreferenceKeyInput("");

                    setPreferenceValueInput("");

                    setAddingPreference(false);

                  }}
                />

              ) : (

                <AddButton
                  label="Add Preference"
                  onClick={() =>
                    setAddingPreference(true)
                  }
                />

              )}

            </div>

          </MemoryCard>

        </div>


        {/* ==================================================
            RECENT CONTEXT
        ================================================== */}

        {recentMessages.length > 0 && (

          <section
            className="
              group
              relative
              mt-5
              overflow-hidden
              rounded-2xl
              border
              border-white/[0.07]
              bg-[#0B1020]/90
              p-6
              shadow-[0_16px_50px_rgba(0,0,0,.16)]
            "
          >

            <div
              className="
                pointer-events-none
                absolute
                -right-20
                -top-20
                h-48
                w-48
                rounded-full
                bg-violet-600/[0.06]
                blur-[80px]
              "
            />


            <div
              className="
                absolute
                left-8
                right-8
                top-0
                h-px
                bg-gradient-to-r
                from-transparent
                via-violet-400/35
                to-transparent
              "
            />


            <div
              className="
                relative
                z-10
              "
            >

              <div
                className="
                  mb-5
                  flex
                  items-center
                  gap-3
                "
              >

                <div
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-violet-400/15
                    bg-violet-500/[0.08]
                    text-violet-300
                  "
                >

                  <MessageSquare size={19} />

                </div>


                <div>

                  <h2
                    className="
                      font-semibold
                      text-white
                    "
                  >
                    Recent Context
                  </h2>

                  <p
                    className="
                      mt-0.5
                      text-sm
                      text-slate-500
                    "
                  >
                    Recent conversation context available to Nyxora.
                  </p>

                </div>

              </div>


              <div
                className="
                  grid
                  gap-3
                  lg:grid-cols-3
                "
              >

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
                          border
                          border-white/[0.06]
                          bg-white/[0.025]
                          p-4
                          transition-all
                          duration-300
                          hover:border-violet-400/15
                          hover:bg-white/[0.035]
                        "
                      >

                        {item.user && (

                          <p
                            className="
                              mb-3
                              text-sm
                              leading-6
                              text-slate-300
                            "
                          >

                            <span
                              className="
                                mr-1
                                font-medium
                                text-fuchsia-300
                              "
                            >
                              You:
                            </span>

                            {item.user}

                          </p>

                        )}


                        {item.ai && (

                          <p
                            className="
                              line-clamp-3
                              text-sm
                              leading-6
                              text-slate-500
                            "
                          >

                            <span
                              className="
                                mr-1
                                font-medium
                                text-cyan-300
                              "
                            >
                              Nyxora:
                            </span>

                            {item.ai}

                          </p>

                        )}

                      </div>

                    )
                  )}

              </div>

            </div>

          </section>

        )}


        {/* ==================================================
            CLEAR MEMORY
        ================================================== */}

        {memory && (

          <section
            className="
              mt-5
              flex
              flex-col
              gap-5
              rounded-2xl
              border
              border-red-500/15
              bg-red-500/[0.025]
              p-5
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >

            <div>

              <h3
                className="
                  font-semibold
                  text-white
                "
              >
                Clear AI Memory
              </h3>

              <p
                className="
                  mt-1
                  max-w-2xl
                  text-sm
                  leading-6
                  text-slate-500
                "
              >
                Remove all information Nyxora currently remembers
                about you. This action cannot be undone.
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
                flex
                shrink-0
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-red-500/25
                bg-red-500/[0.08]
                px-4
                py-2.5
                text-sm
                font-medium
                text-red-300
                transition
                hover:bg-red-500/[0.14]
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >

              <Trash2 size={16} />

              {clearing
                ? "Clearing..."
                : "Clear Memory"}

            </button>

          </section>

        )}

      </div>

    </main>

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
  accent = "violet",
}) {

  const accentStyles = {

    fuchsia: {
      icon:
        "border-fuchsia-400/15 bg-fuchsia-500/[0.08] text-fuchsia-300",
      glow:
        "bg-fuchsia-500/[0.06]",
      line:
        "via-fuchsia-400/45",
    },

    violet: {
      icon:
        "border-violet-400/15 bg-violet-500/[0.08] text-violet-300",
      glow:
        "bg-violet-500/[0.06]",
      line:
        "via-violet-400/45",
    },

    cyan: {
      icon:
        "border-cyan-400/15 bg-cyan-500/[0.07] text-cyan-300",
      glow:
        "bg-cyan-500/[0.05]",
      line:
        "via-cyan-400/40",
    },

    blue: {
      icon:
        "border-blue-400/15 bg-blue-500/[0.07] text-blue-300",
      glow:
        "bg-blue-500/[0.05]",
      line:
        "via-blue-400/40",
    },

  };


  const style =
    accentStyles[accent] ||
    accentStyles.violet;


  return (

    <section
      className="
        group
        relative
        overflow-hidden
        rounded-2xl
        border
        border-white/[0.07]
        bg-[#0B1020]/90
        p-5
        shadow-[0_16px_50px_rgba(0,0,0,.14)]
        transition-all
        duration-300
        hover:-translate-y-0.5
        hover:border-white/[0.11]
        hover:bg-[#0D1324]/95
        sm:p-6
      "
    >

      <div
        className={`
          pointer-events-none
          absolute
          -right-16
          -top-16
          h-44
          w-44
          rounded-full
          blur-[80px]
          transition-opacity
          duration-300
          ${style.glow}
        `}
      />


      <div
        className={`
          absolute
          left-8
          right-8
          top-0
          h-px
          bg-gradient-to-r
          from-transparent
          to-transparent
          ${style.line}
        `}
      />


      <div
        className="
          relative
          z-10
        "
      >

        <div
          className="
            mb-5
            flex
            items-start
            gap-3
          "
        >

          <div
            className={`
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              border
              ${style.icon}
            `}
          >

            <Icon size={19} />

          </div>


          <div>

            <h2
              className="
                font-semibold
                text-white
              "
            >
              {title}
            </h2>

            <p
              className="
                mt-1
                text-sm
                leading-5
                text-slate-500
              "
            >
              {description}
            </p>

          </div>

        </div>


        {children}

      </div>

    </section>

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
        group
        flex
        items-center
        gap-2
        rounded-lg
        border
        border-dashed
        border-violet-400/20
        bg-violet-500/[0.035]
        px-3
        py-2
        text-sm
        font-medium
        text-violet-300
        transition-all
        duration-300
        hover:border-violet-400/40
        hover:bg-violet-500/[0.08]
        hover:text-violet-200
      "
    >

      <Plus
        size={15}
        className="
          transition-transform
          duration-300
          group-hover:rotate-90
        "
      />

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
          min-w-0
          flex-1
          rounded-xl
          border
          border-white/[0.08]
          bg-[#070B17]/80
          px-3.5
          py-2.5
          text-sm
          text-white
          outline-none
          transition-all
          placeholder:text-slate-600
          focus:border-violet-400/40
          focus:bg-[#090E1C]
          focus:shadow-[0_0_0_3px_rgba(124,58,237,.06)]
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
        border-violet-400/20
        bg-violet-500/[0.035]
        p-3
      "
    >

      <div
        className="
          grid
          grid-cols-1
          gap-2
          sm:grid-cols-2
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
            rounded-xl
            border
            border-white/[0.08]
            bg-[#070B17]/90
            px-3.5
            py-2.5
            text-sm
            text-white
            outline-none
            transition-all
            placeholder:text-slate-600
            focus:border-violet-400/40
            focus:shadow-[0_0_0_3px_rgba(124,58,237,.06)]
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
            rounded-xl
            border
            border-white/[0.08]
            bg-[#070B17]/90
            px-3.5
            py-2.5
            text-sm
            text-white
            outline-none
            transition-all
            placeholder:text-slate-600
            focus:border-violet-400/40
            focus:shadow-[0_0_0_3px_rgba(124,58,237,.06)]
          "
        />

      </div>


      <div
        className="
          mt-3
          flex
          items-center
          justify-end
          gap-2
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
        border
        border-violet-400/25
        bg-violet-500/[0.035]
        p-4
      "
    >

      <label
        className="
          mb-2
          block
          text-xs
          font-medium
          text-slate-500
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
            min-w-0
            flex-1
            rounded-xl
            border
            border-white/[0.08]
            bg-[#070B17]/90
            px-3.5
            py-2.5
            text-sm
            text-white
            outline-none
            transition-all
            focus:border-violet-400/40
            focus:shadow-[0_0_0_3px_rgba(124,58,237,.06)]
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
        flex
        h-10
        w-10
        shrink-0
        items-center
        justify-center
        rounded-xl
        border
        border-violet-400/20
        bg-violet-500/15
        text-violet-200
        transition-all
        hover:border-violet-400/35
        hover:bg-violet-500/25
        disabled:cursor-not-allowed
        disabled:opacity-40
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
        flex
        h-10
        w-10
        shrink-0
        items-center
        justify-center
        rounded-xl
        border
        border-white/[0.07]
        bg-white/[0.035]
        text-slate-500
        transition-all
        hover:bg-white/[0.07]
        hover:text-white
        disabled:opacity-40
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
        group
        flex
        items-center
        justify-between
        gap-4
        rounded-xl
        border
        border-white/[0.06]
        bg-white/[0.025]
        px-4
        py-3
        transition-all
        duration-300
        hover:border-violet-400/15
        hover:bg-white/[0.04]
      "
    >

      <span
        className="
          text-sm
          text-slate-500
        "
      >
        {label}
      </span>


      <div
        className="
          flex
          min-w-0
          items-center
          gap-1
        "
      >

        <span
          className="
            mr-2
            truncate
            text-right
            text-sm
            font-medium
            text-slate-200
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
            flex
            h-7
            w-7
            shrink-0
            items-center
            justify-center
            rounded-lg
            text-slate-600
            transition-all
            hover:bg-violet-500/10
            hover:text-violet-300
            disabled:opacity-40
          "
        >

          <Pencil size={13} />

        </button>


        <button
          type="button"
          onClick={onDelete}
          disabled={deleting}
          title={`Forget ${label}`}
          className="
            flex
            h-7
            w-7
            shrink-0
            items-center
            justify-center
            rounded-lg
            text-slate-600
            transition-all
            hover:bg-red-500/10
            hover:text-red-400
            disabled:opacity-40
          "
        >

          <X size={14} />

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
        border
        border-white/[0.06]
        bg-white/[0.025]
        px-4
        py-3
        transition-all
        duration-300
        hover:border-violet-400/15
        hover:bg-white/[0.04]
      "
    >

      <span
        className="
          text-sm
          text-slate-500
        "
      >
        {label}
      </span>


      <div
        className="
          flex
          min-w-0
          items-center
          gap-2
        "
      >

        <span
          className="
            truncate
            text-right
            text-sm
            font-medium
            text-slate-200
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
              h-7
              w-7
              shrink-0
              items-center
              justify-center
              rounded-lg
              text-slate-600
              transition-all
              hover:bg-red-500/10
              hover:text-red-400
              disabled:opacity-40
            "
          >

            <X size={14} />

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
                group
                flex
                items-center
                gap-1
                rounded-lg
                border
                border-violet-400/15
                bg-gradient-to-r
                from-fuchsia-500/[0.055]
                via-violet-500/[0.08]
                to-cyan-500/[0.045]
                py-1.5
                pl-3
                pr-1.5
                text-sm
                text-violet-200
                transition-all
                duration-300
                hover:border-violet-400/30
                hover:bg-violet-500/[0.11]
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
                  flex
                  h-6
                  w-6
                  items-center
                  justify-center
                  rounded-md
                  text-violet-400/70
                  transition-all
                  hover:bg-red-500/10
                  hover:text-red-400
                  disabled:opacity-40
                "
              >

                <X size={13} />

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

    <div
      className="
        rounded-xl
        border
        border-dashed
        border-white/[0.07]
        bg-white/[0.015]
        px-4
        py-4
      "
    >

      <p
        className="
          text-sm
          text-slate-600
        "
      >
        Nothing remembered yet.
      </p>

    </div>

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