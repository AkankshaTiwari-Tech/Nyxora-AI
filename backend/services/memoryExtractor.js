export async function extractMemory(message) {


  if(!message) {

    return {};

  }



  const text =
    message.toLowerCase();



  const memory = {};




  // Name extraction

  const nameMatch =
    message.match(
      /my name is\s+([a-zA-Z]+)/i
    );



  if(nameMatch) {


    memory.userInfo = {

      name:
        nameMatch[1],

    };


  }




  // Theme preference

  if(
    text.includes("dark mode") ||
    text.includes("dark theme") ||
    text.includes("dark")
  ) {


    memory.preferences = {

      theme:
        "dark",

    };


  }




  if(
    text.includes("light mode") ||
    text.includes("light theme") ||
    text.includes("light")
  ) {


    memory.preferences = {

      theme:
        "light",

    };


  }







  // Learning style

  if(
    text.includes("explain simply") ||
    text.includes("simple explanation")
  ) {


    memory.preferences = {

      ...(memory.preferences || {}),

      learningStyle:
        "simple explanations",

    };


  }





  if(
    text.includes("detail") ||
    text.includes("detailed explanation")
  ) {


    memory.preferences = {

      ...(memory.preferences || {}),

      learningStyle:
        "detailed explanations",

    };


  }







  // Skills extraction

  const skillMatch =
    message.match(
      /i am learning\s+(.+)/i
    );



  if(skillMatch) {


    memory.skills = [

      skillMatch[1]
        .replace(".", "")
        .trim(),

    ];


  }







  // Interests extraction

  const likeMatch =
    message.match(
      /i like\s+(.+)/i
    );



  if(likeMatch) {


    const interest =
      likeMatch[1]
        .replace(".", "")
        .trim();



    if(
      interest &&
      !text.includes("dark mode") &&
      !text.includes("light mode")
    ) {


      memory.interests = [

        interest,

      ];


    }


  }







  // Remember statements

  const rememberMatch =
    message.match(
      /remember that i\s+(.+)/i
    );



  if(rememberMatch) {


    const fact =
      rememberMatch[1]
        .replace(".", "")
        .trim();



    memory.interests = [

      fact,

    ];


  }







  return memory;

}