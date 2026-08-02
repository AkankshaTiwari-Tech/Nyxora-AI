import {
  db,
} from "../config/firebase.js";


// ======================================================
// MEMORY REFERENCE
// ======================================================

function memoryRef(userId) {

  if (!userId) {
    throw new Error(
      "User ID required for memory."
    );
  }

  return db
    .collection("users")
    .doc(userId)
    .collection("settings")
    .doc("aiMemory");
}


// ======================================================
// CANONICAL KEY
// ======================================================

function canonicalKey(value) {

  return String(value ?? "")
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]/gu, "");

}


// ======================================================
// CLEAN ARRAY
// ======================================================

function cleanArray(value) {

  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(
      (item) =>
        typeof item === "string"
    )
    .map(
      (item) =>
        item.trim()
    )
    .filter(Boolean);

}


// ======================================================
// CLEAN OBJECT
// ======================================================

function cleanObject(value) {

  if (
    !value ||
    typeof value !== "object" ||
    Array.isArray(value)
  ) {
    return {};
  }

  return value;

}


// ======================================================
// LEVENSHTEIN DISTANCE
// ======================================================

function levenshteinDistance(
  first,
  second
) {

  const a =
    canonicalKey(first);

  const b =
    canonicalKey(second);


  if (a === b) {
    return 0;
  }


  if (!a.length) {
    return b.length;
  }


  if (!b.length) {
    return a.length;
  }


  const previousRow =
    Array.from(
      {
        length:
          b.length + 1,
      },
      (_, index) =>
        index
    );


  for (
    let i = 1;
    i <= a.length;
    i++
  ) {

    const currentRow = [
      i,
    ];


    for (
      let j = 1;
      j <= b.length;
      j++
    ) {

      const insertion =
        currentRow[j - 1] + 1;


      const deletion =
        previousRow[j] + 1;


      const substitution =
        previousRow[j - 1] +
        (
          a[i - 1] ===
          b[j - 1]
            ? 0
            : 1
        );


      currentRow[j] =
        Math.min(
          insertion,
          deletion,
          substitution
        );

    }


    for (
      let j = 0;
      j < currentRow.length;
      j++
    ) {

      previousRow[j] =
        currentRow[j];

    }

  }


  return previousRow[
    b.length
  ];

}


// ======================================================
// SAFE MEMORY MATCH
// ======================================================

function isMemoryMatch(
  existingItem,
  requestedItem
) {

  const existingKey =
    canonicalKey(
      existingItem
    );


  const requestedKey =
    canonicalKey(
      requestedItem
    );


  if (
    !existingKey ||
    !requestedKey
  ) {
    return false;
  }


  if (
    existingKey ===
    requestedKey
  ) {
    return true;
  }


  const shortestLength =
    Math.min(
      existingKey.length,
      requestedKey.length
    );


  if (
    shortestLength < 6
  ) {
    return false;
  }


  const distance =
    levenshteinDistance(
      existingKey,
      requestedKey
    );


  const allowedDistance =
    shortestLength >= 11
      ? 2
      : 1;


  return (
    distance <=
    allowedDistance
  );

}


// ======================================================
// REMOVE ARRAY ITEMS
// ======================================================

function removeItems(
  existing = [],
  removals = []
) {

  const existingItems =
    cleanArray(existing);


  const removalItems =
    cleanArray(removals);


  if (
    removalItems.length === 0
  ) {
    return existingItems;
  }


  return existingItems.filter(
    (existingItem) => {

      const shouldRemove =
        removalItems.some(
          (requestedItem) =>
            isMemoryMatch(
              existingItem,
              requestedItem
            )
        );


      if (shouldRemove) {

        console.log(
          `🧠 Memory removed: "${existingItem}"`
        );

      }


      return !shouldRemove;

    }
  );

}


// ======================================================
// MERGE UNIQUE
// ======================================================

function mergeUnique(
  existing = [],
  additions = []
) {

  const result = [];


  for (
    const item of [
      ...cleanArray(existing),
      ...cleanArray(additions),
    ]
  ) {

    const duplicate =
      result.some(
        (existingItem) =>
          isMemoryMatch(
            existingItem,
            item
          )
      );


    if (duplicate) {
      continue;
    }


    result.push(item);

  }


  return result;

}


// ======================================================
// REMOVE OBJECT FIELDS
// ======================================================

function removeObjectFields(
  existing = {},
  removals = []
) {

  const result = {
    ...cleanObject(existing),
  };


  const removalKeys =
    cleanArray(removals)
      .map(
        (item) =>
          canonicalKey(item)
      )
      .filter(Boolean);


  if (
    removalKeys.length === 0
  ) {
    return result;
  }


  for (
    const existingKey
    of Object.keys(result)
  ) {

    const normalizedExistingKey =
      canonicalKey(
        existingKey
      );


    const shouldRemove =
      removalKeys.some(
        (removalKey) =>
          normalizedExistingKey ===
          removalKey
      );


    if (shouldRemove) {

      console.log(
        `🧠 Memory field removed: "${existingKey}"`
      );


      delete result[
        existingKey
      ];

    }

  }


  return result;

}


// ======================================================
// DEFAULT MEMORY
// ======================================================

function defaultMemory() {

  return {

    userInfo: {},

    preferences: {},

    interests: [],

    skills: [],

    recentMessages: [],

  };

}


// ======================================================
// GET MEMORY
// ======================================================

export async function getMemory(
  userId
) {

  const snapshot =
    await memoryRef(
      userId
    ).get();


  if (!snapshot.exists) {

    return defaultMemory();

  }


  const data =
    snapshot.data() || {};


  return {

    userInfo:
      cleanObject(
        data.userInfo
      ),

    preferences:
      cleanObject(
        data.preferences
      ),

    interests:
      cleanArray(
        data.interests
      ),

    skills:
      cleanArray(
        data.skills
      ),

    recentMessages:
      Array.isArray(
        data.recentMessages
      )
        ? data.recentMessages
        : [],

  };

}


// ======================================================
// SAVE MEMORY
// ======================================================

export async function saveMemory(
  userId,
  memoryData = {}
) {

  const reference =
    memoryRef(
      userId
    );


  await db.runTransaction(
    async (transaction) => {

      const snapshot =
        await transaction.get(
          reference
        );


      const existing =
        snapshot.exists
          ? snapshot.data() || {}
          : defaultMemory();


      // ==================================================
      // INTERESTS
      // ==================================================

      const interestAdditions = [

        ...cleanArray(
          memoryData.interests
        ),

        ...cleanArray(
          memoryData.addInterests
        ),

      ];


      const interestRemovals =
        cleanArray(
          memoryData.removeInterests
        );


      const interestsAfterRemoval =
        removeItems(

          cleanArray(
            existing.interests
          ),

          interestRemovals

        );


      const finalInterests =
        mergeUnique(

          interestsAfterRemoval,

          interestAdditions

        );


      // ==================================================
      // SKILLS
      // ==================================================

      const skillAdditions = [

        ...cleanArray(
          memoryData.skills
        ),

        ...cleanArray(
          memoryData.addSkills
        ),

      ];


      const skillRemovals =
        cleanArray(
          memoryData.removeSkills
        );


      const skillsAfterRemoval =
        removeItems(

          cleanArray(
            existing.skills
          ),

          skillRemovals

        );


      const finalSkills =
        mergeUnique(

          skillsAfterRemoval,

          skillAdditions

        );


      // ==================================================
      // USER INFO — REMOVE + UPDATE
      // ==================================================

      const userInfoAfterRemoval =
        removeObjectFields(

          cleanObject(
            existing.userInfo
          ),

          memoryData.removeUserInfo

        );


      const finalUserInfo = {

        ...userInfoAfterRemoval,

        ...cleanObject(
          memoryData.userInfo
        ),

      };


      // ==================================================
      // PREFERENCES — REMOVE + UPDATE
      // ==================================================

      const preferencesAfterRemoval =
        removeObjectFields(

          cleanObject(
            existing.preferences
          ),

          memoryData.removePreferences

        );


      const finalPreferences = {

        ...preferencesAfterRemoval,

        ...cleanObject(
          memoryData.preferences
        ),

      };


      // ==================================================
      // RECENT MESSAGES
      // ==================================================

      const finalRecentMessages =
        Array.isArray(
          memoryData.recentMessages
        )
          ? memoryData.recentMessages
          : Array.isArray(
              existing.recentMessages
            )
            ? existing.recentMessages
            : [];


      // ==================================================
      // DEBUG
      // ==================================================

      console.log(
        "🧠 Final userInfo:",
        finalUserInfo
      );


      console.log(
        "🧠 Final preferences:",
        finalPreferences
      );


      console.log(
        "🧠 Final interests:",
        finalInterests
      );


      console.log(
        "🧠 Final skills:",
        finalSkills
      );


      // ==================================================
      // ATOMIC FIRESTORE WRITE
      //
      // IMPORTANT:
      // DO NOT USE merge:true HERE.
      //
      // We are writing the complete aiMemory document.
      // Therefore removed nested fields are actually
      // removed from Firestore.
      // ==================================================

      transaction.set(

        reference,

        {

          userInfo:
            finalUserInfo,

          preferences:
            finalPreferences,

          interests:
            finalInterests,

          skills:
            finalSkills,

          recentMessages:
            finalRecentMessages,

          updatedAt:
            new Date(),

        }

      );

    }
  );


  console.log(
    "🧠 Memory transaction completed successfully."
  );

}


// ======================================================
// UPDATE MEMORY
// ======================================================

export async function updateMemory(
  userId,
  memoryData
) {

  return saveMemory(
    userId,
    memoryData
  );

}