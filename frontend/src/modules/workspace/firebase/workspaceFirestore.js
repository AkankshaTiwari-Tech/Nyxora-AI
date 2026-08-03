import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import {
  auth,
  db,
} from "../../../firebase/firebase";

import {
  WORKSPACE_COLLECTIONS,
} from "../constants/workspaceConstants";


// ======================================================
// CURRENT USER
// ======================================================

function getCurrentUserId() {

  const uid =
    auth.currentUser?.uid;


  if (!uid) {

    throw new Error(
      "User must be authenticated to use Workspace."
    );

  }


  return uid;

}


// ======================================================
// COLLECTION
//
// users/{uid}/workspace/{collectionName}/items/{itemId}
// ======================================================

function getWorkspaceCollection(
  collectionName
) {

  const uid =
    getCurrentUserId();


  return collection(
    db,
    "users",
    uid,
    "workspace",
    collectionName,
    "items"
  );

}


// ======================================================
// DOCUMENT REFERENCE
// ======================================================

function getWorkspaceDocumentRef(
  collectionName,
  id
) {

  if (!id) {

    throw new Error(
      "Workspace item ID is required."
    );

  }


  const uid =
    getCurrentUserId();


  return doc(
    db,
    "users",
    uid,
    "workspace",
    collectionName,
    "items",
    id
  );

}


// ======================================================
// CREATE
// ======================================================

export async function createWorkspaceItem(
  collectionName,
  data
) {

  const ref =
    await addDoc(
      getWorkspaceCollection(
        collectionName
      ),
      {
        ...data,

        createdAt:
          serverTimestamp(),

        updatedAt:
          serverTimestamp(),
      }
    );


  return ref.id;

}


// ======================================================
// UPDATE
// ======================================================

export async function updateWorkspaceItem(
  collectionName,
  id,
  data
) {

  await updateDoc(
    getWorkspaceDocumentRef(
      collectionName,
      id
    ),
    {
      ...data,

      updatedAt:
        serverTimestamp(),
    }
  );


  return true;

}


// ======================================================
// DELETE
// ======================================================

export async function deleteWorkspaceItem(
  collectionName,
  id
) {

  await deleteDoc(
    getWorkspaceDocumentRef(
      collectionName,
      id
    )
  );


  return true;

}


// ======================================================
// REALTIME SUBSCRIPTION
// ======================================================

export function subscribeToWorkspaceItems(
  collectionName,
  callback,
  onError
) {

  const workspaceQuery =
    query(
      getWorkspaceCollection(
        collectionName
      ),

      orderBy(
        "createdAt",
        "desc"
      )
    );


  return onSnapshot(
    workspaceQuery,

    (snapshot) => {

      const items =
        snapshot.docs.map(
          (item) => ({
            id:
              item.id,

            ...item.data(),
          })
        );


      callback(
        items
      );

    },

    (error) => {

      console.error(
        `Workspace ${collectionName} subscription error:`,
        error
      );


      onError?.(
        error
      );

    }
  );

}


// ======================================================
// COLLECTION-SPECIFIC HELPERS
// ======================================================

export function subscribeToClasses(
  callback,
  onError
) {

  return subscribeToWorkspaceItems(
    WORKSPACE_COLLECTIONS.CLASSES,
    callback,
    onError
  );

}


export function subscribeToStudents(
  callback,
  onError
) {

  return subscribeToWorkspaceItems(
    WORKSPACE_COLLECTIONS.STUDENTS,
    callback,
    onError
  );

}


export function subscribeToDocuments(
  callback,
  onError
) {

  return subscribeToWorkspaceItems(
    WORKSPACE_COLLECTIONS.DOCUMENTS,
    callback,
    onError
  );

}


export function subscribeToResults(
  callback,
  onError
) {

  return subscribeToWorkspaceItems(
    WORKSPACE_COLLECTIONS.RESULTS,
    callback,
    onError
  );

}