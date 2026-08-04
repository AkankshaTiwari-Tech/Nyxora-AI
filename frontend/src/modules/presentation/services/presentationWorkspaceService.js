import {
  db,
} from "../../../firebase/firebase";


import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  orderBy,
  limit,
  serverTimestamp,
} from "firebase/firestore";




// ======================================================
// NYXORA AI PRESENTATION WORKSPACE SERVICE
//
// Firestore Structure:
//
// users
//   └── userId
//        └── workspace (document)
//              └── presentations (collection)
//                    └── presentationId
//
// ======================================================







// ======================================================
// SAVE PRESENTATION
// ======================================================


export async function saveWorkspacePresentation({


  userId,


  title,


  topic,


  slides,


  theme,



}) {



  if(!userId){


    throw new Error(

      "User authentication required."

    );


  }








  // workspace document


  const workspaceRef = doc(


    db,


    "users",


    userId,


    "workspace",


    "main"



  );








  // presentations collection


  const presentationsRef = collection(


    workspaceRef,


    "presentations"



  );








  const presentationRef = doc(


    presentationsRef



  );









  await setDoc(


    presentationRef,


    {


      id:


        presentationRef.id,



      title:


        title ||


        "Nyxora AI Presentation",




      topic:


        topic || "",





      slides:


        slides || [],





      theme:


        theme ||


        "nyxoraPremium",





      createdAt:


        serverTimestamp(),





      updatedAt:


        serverTimestamp(),




    }



  );








  return presentationRef.id;



}









// ======================================================
// GET SINGLE PRESENTATION
// ======================================================


export async function getWorkspacePresentation({


  userId,


  presentationId,



}) {



  if(

    !userId ||

    !presentationId

  ){


    return null;


  }







  const presentationRef = doc(



    db,


    "users",


    userId,


    "workspace",


    "main",


    "presentations",


    presentationId



  );







  const snapshot =


    await getDoc(


      presentationRef


    );







  if(

    !snapshot.exists()

  ){


    return null;


  }







  return {



    id:


      snapshot.id,



    ...snapshot.data(),



  };



}
// ======================================================
// GET LATEST PRESENTATION
//
// Used on page refresh.
//
// Loads the latest generated PPT
// from Workspace.
//
// ======================================================


export async function getLatestWorkspacePresentation({


  userId,



}) {



  if(!userId){


    return null;


  }








  const workspaceRef = doc(



    db,


    "users",


    userId,


    "workspace",


    "main"



  );








  const presentationsRef = collection(



    workspaceRef,


    "presentations"



  );









  const latestQuery = query(



    presentationsRef,



    orderBy(



      "createdAt",



      "desc"



    ),



    limit(1)



  );








  const snapshot =


    await getDocs(


      latestQuery


    );








  if(

    snapshot.empty

  ){


    return null;


  }








  const latest =


    snapshot.docs[0];








  return {



    id:


      latest.id,



    ...latest.data(),



  };



}