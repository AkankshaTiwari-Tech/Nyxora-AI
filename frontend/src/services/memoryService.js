import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";

import {
  db,
  auth,
} from "../firebase/firebase";


// ======================================================
// MEMORY REFERENCE
// ======================================================

function memoryRef() {

  const uid =
    auth.currentUser?.uid;


  if (!uid) {

    throw new Error(
      "User not authenticated."
    );

  }


  return doc(
    db,
    "users",
    uid,
    "settings",
    "aiMemory"
  );

}


// ======================================================
// CLEAN LEGACY RECENT MESSAGE
//
// Older Nyxora versions accidentally stored the full
// internal assistant-mode prompt inside recentMessages.
//
// Example:
//
// You are Nyxora AI...
// USER REQUEST: I am learning Node.js.
//
// becomes:
//
// I am learning Node.js.
// ======================================================

function cleanLegacyUserMessage(
  value
) {

  if (
    typeof value !== "string"
  ) {

    return "";

  }


  const text =
    value.trim();


  if (!text) {

    return "";

  }


  // ----------------------------------------------------
  // Only modify messages that clearly contain our old
  // internal USER REQUEST marker.
  //
  // Normal user messages are returned unchanged.
  // ----------------------------------------------------

  const marker =
    "USER REQUEST:";


  const markerIndex =
    text.lastIndexOf(
      marker
    );


  if (
    markerIndex === -1
  ) {

    return text;

  }


  const extractedRequest =
    text
      .slice(
        markerIndex +
        marker.length
      )
      .trim();


  // Safety:
  // Never replace valid content with an empty string.

  if (
    !extractedRequest
  ) {

    return text;

  }


  return extractedRequest;

}


// ======================================================
// CLEAN LEGACY RECENT CONTEXT
// ======================================================

async function cleanLegacyRecentContext(
  memory
) {

  if (
    !memory ||
    !Array.isArray(
      memory.recentMessages
    ) ||
    memory.recentMessages.length === 0
  ) {

    return memory;

  }


  let changed = false;


  const cleanedMessages =
    memory.recentMessages.map(
      (entry) => {

        if (
          !entry ||
          typeof entry !== "object"
        ) {

          return entry;

        }


        const originalUser =
          typeof entry.user === "string"
            ? entry.user
            : "";


        const cleanedUser =
          cleanLegacyUserMessage(
            originalUser
          );


        if (
          cleanedUser !==
          originalUser
        ) {

          changed = true;

        }


        return {

          ...entry,

          user:
            cleanedUser,

        };

      }
    );


  // Nothing polluted was found.

  if (!changed) {

    return memory;

  }


  // ----------------------------------------------------
  // Permanently repair the stored Firestore data.
  // ----------------------------------------------------

  await updateDoc(

    memoryRef(),

    {

      recentMessages:
        cleanedMessages,

      updatedAt:
        serverTimestamp(),

    }

  );


  console.log(
    "🧹 Legacy AI Recent Context cleaned."
  );


  return {

    ...memory,

    recentMessages:
      cleanedMessages,

  };

}


// ======================================================
// GET MEMORY
// ======================================================

export async function getMemory() {

  const snapshot =
    await getDoc(
      memoryRef()
    );


  if (!snapshot.exists()) {

    return null;

  }


  const memory =
    snapshot.data();


  // Automatically repair old polluted context.
  return await cleanLegacyRecentContext(
    memory
  );

}


// ======================================================
// SAVE MEMORY
// ======================================================

export async function saveMemory(
  memoryData
) {

  await setDoc(

    memoryRef(),

    {

      ...memoryData,

      updatedAt:
        serverTimestamp(),

    },

    {
      merge: true,
    }

  );

}


// ======================================================
// UPDATE MEMORY
// ======================================================

export async function updateMemory(
  memoryData
) {

  await setDoc(

    memoryRef(),

    {

      ...memoryData,

      updatedAt:
        serverTimestamp(),

    },

    {
      merge: true,
    }

  );

}


// ======================================================
// ADD ARRAY MEMORY ITEM
// Used for Interests + Skills
// ======================================================

export async function addMemoryItem(
  category,
  item
) {

  const cleanItem =
    String(item).trim();


  if (!cleanItem) {

    return {
      added: false,
      reason: "empty",
    };

  }


  const snapshot =
    await getDoc(
      memoryRef()
    );


  const memory =
    snapshot.exists()
      ? snapshot.data()
      : {};


  const currentItems =
    Array.isArray(
      memory[category]
    )
      ? memory[category]
      : [];


  const alreadyExists =
    currentItems.some(
      (currentItem) =>

        String(currentItem)
          .trim()
          .toLowerCase() ===

        cleanItem.toLowerCase()
    );


  if (alreadyExists) {

    return {
      added: false,
      reason: "duplicate",
    };

  }


  const updatedItems = [

    ...currentItems,

    cleanItem,

  ];


  await setDoc(

    memoryRef(),

    {

      [category]:
        updatedItems,

      updatedAt:
        serverTimestamp(),

    },

    {
      merge: true,
    }

  );


  return {

    added: true,

    item:
      cleanItem,

  };

}


// ======================================================
// DELETE ARRAY MEMORY ITEM
// Used for Interests + Skills
// ======================================================

export async function deleteMemoryItem(
  category,
  item
) {

  const snapshot =
    await getDoc(
      memoryRef()
    );


  if (!snapshot.exists()) {

    return;

  }


  const memory =
    snapshot.data();


  const currentItems =
    Array.isArray(
      memory[category]
    )
      ? memory[category]
      : [];


  const updatedItems =
    currentItems.filter(
      (currentItem) =>
        currentItem !== item
    );


  await updateDoc(

    memoryRef(),

    {

      [category]:
        updatedItems,

      updatedAt:
        serverTimestamp(),

    }

  );

}


// ======================================================
// ADD / UPDATE PREFERENCE
// ======================================================

export async function saveMemoryPreference(
  preferenceKey,
  preferenceValue
) {

  const cleanKey =
    String(
      preferenceKey
    ).trim();


  const cleanValue =
    String(
      preferenceValue
    ).trim();


  if (
    !cleanKey ||
    !cleanValue
  ) {

    return {
      saved: false,
      reason: "empty",
    };

  }


  const snapshot =
    await getDoc(
      memoryRef()
    );


  const memory =
    snapshot.exists()
      ? snapshot.data()
      : {};


  const preferences = {

    ...(
      memory.preferences ||
      {}
    ),

    [cleanKey]:
      cleanValue,

  };


  await setDoc(

    memoryRef(),

    {

      preferences,

      updatedAt:
        serverTimestamp(),

    },

    {
      merge: true,
    }

  );


  return {

    saved: true,

    key:
      cleanKey,

    value:
      cleanValue,

  };

}


// ======================================================
// DELETE PREFERENCE
// ======================================================

export async function deleteMemoryPreference(
  preferenceKey
) {

  const snapshot =
    await getDoc(
      memoryRef()
    );


  if (!snapshot.exists()) {

    return;

  }


  const memory =
    snapshot.data();


  const preferences = {

    ...(
      memory.preferences ||
      {}
    ),

  };


  delete preferences[
    preferenceKey
  ];


  await updateDoc(

    memoryRef(),

    {

      preferences,

      updatedAt:
        serverTimestamp(),

    }

  );

}


// ======================================================
// ADD / UPDATE ABOUT YOU INFO
// ======================================================

export async function updateUserInfo(
  infoKey,
  value
) {

  const cleanKey =
    String(
      infoKey
    ).trim();


  const cleanValue =
    String(
      value
    ).trim();


  if (
    !cleanKey ||
    !cleanValue
  ) {

    return {
      saved: false,
      reason: "empty",
    };

  }


  const snapshot =
    await getDoc(
      memoryRef()
    );


  const currentMemory =
    snapshot.exists()
      ? snapshot.data()
      : {};


  const userInfo = {

    ...(
      currentMemory.userInfo ||
      {}
    ),

    [cleanKey]:
      cleanValue,

  };


  await setDoc(

    memoryRef(),

    {

      userInfo,

      updatedAt:
        serverTimestamp(),

    },

    {
      merge: true,
    }

  );


  return {

    saved: true,

    key:
      cleanKey,

    value:
      cleanValue,

  };

}


// ======================================================
// DELETE ABOUT YOU INFO
// ======================================================

export async function deleteUserInfo(
  infoKey
) {

  const snapshot =
    await getDoc(
      memoryRef()
    );


  if (!snapshot.exists()) {

    return;

  }


  const memory =
    snapshot.data();


  const userInfo = {

    ...(
      memory.userInfo ||
      {}
    ),

  };


  delete userInfo[
    infoKey
  ];


  await updateDoc(

    memoryRef(),

    {

      userInfo,

      updatedAt:
        serverTimestamp(),

    }

  );

}


// ======================================================
// CLEAR ALL MEMORY
// ======================================================

export async function clearMemory() {

  await deleteDoc(
    memoryRef()
  );

}