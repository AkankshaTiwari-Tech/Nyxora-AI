import {
  db,
} from "../config/firebase.js";




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







function removeDuplicates(array = []) {


  return [

    ...new Set(

      array

        .map(
          item =>
            item
              .toLowerCase()
              .trim()
        )

    )

  ];


}








export async function getMemory(userId) {


  const snapshot =
    await memoryRef(userId).get();



  if(!snapshot.exists) {


    return {

      userInfo:{},

      preferences:{},

      interests:[],

      skills:[],

      recentMessages:[],

    };


  }




  const data =
    snapshot.data();



  return {


    userInfo:
      data.userInfo || {},


    preferences:
      data.preferences || {},


    interests:
      data.interests || [],


    skills:
      data.skills || [],


    recentMessages:
      data.recentMessages || [],


  };


}









export async function saveMemory(
  userId,
  memoryData
) {


  const existingMemory =
    await getMemory(userId);





  const mergedInterests =

    removeDuplicates([

      ...(existingMemory.interests || []),

      ...(memoryData.interests || []),

    ]);







  const mergedSkills =

    removeDuplicates([

      ...(existingMemory.skills || []),

      ...(memoryData.skills || []),

    ]);







  await memoryRef(userId).set(


    {


      userInfo:{


        ...(existingMemory.userInfo || {}),


        ...(memoryData.userInfo || {}),


      },





      preferences:{


        ...(existingMemory.preferences || {}),


        ...(memoryData.preferences || {}),


      },





      interests:


        mergedInterests,





      skills:


        mergedSkills,





      recentMessages:


        memoryData.recentMessages ||

        existingMemory.recentMessages || [],





      updatedAt:

        new Date(),



    },



    {

      merge:true,

    }


  );



}









export async function updateMemory(
  userId,
  memoryData
) {


  await saveMemory(

    userId,

    memoryData

  );


}