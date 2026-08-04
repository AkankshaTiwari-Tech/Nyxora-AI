import PptxGenJS from "pptxgenjs";

import presentationThemes from "../utils/presentationThemes";

import {
  getPresentationLayout,
} from "../utils/presentationLayouts";

import {
  generateSlideVisual,
  prepareVisualForPpt,
} from "./visualGenerationService";



// ======================================================
// NYXORA AI PPT EXPORT ENGINE
//
// Preserved:
// ✓ PptxGenJS
// ✓ Layout Engine
// ✓ AI JSON support
// ✓ SVG support
// ✓ AI Image support
// ✓ Diagram
// ✓ Comparison
// ✓ Timeline
// ✓ Summary
//
// Added:
// ✓ Premium keynote design
// ✓ Smooth gradient bars
// ✓ Cover information
// ✓ Real AI images
// ✓ Number circles
// ✓ Connected flow charts
// ✓ Theme icons
// ======================================================



export async function exportPresentationToPpt({

  presentation,

  themeName = "nyxoraPremium",

}) {


  const pptx =

    new PptxGenJS();



  const theme =

    presentationThemes[themeName]

    ||

    presentationThemes.nyxoraPremium;





  pptx.layout =

    "LAYOUT_WIDE";





  pptx.author =

    "Nyxora AI";





  pptx.company =

    "Nyxora AI";





  pptx.title =

    presentation.title ||

    "Nyxora AI Presentation";





  pptx.theme = {


    headFontFace:

      theme.typography.title,


    bodyFontFace:

      theme.typography.body,


    lang:

      "en-US",


  };







  const slides =

    presentation.slides || [];






  for(

    let index = 0;

    index < slides.length;

    index++

  ){



    const slide =

      slides[index];





    if(

      !validateSlide(slide)

    ){

      continue;

    }






    await createSlide({

      pptx,

      slide,

      index,

      theme,

      presentation,

    });



  }






  await pptx.writeFile({

    fileName:

      `${

        presentation.title ||

        "Nyxora_AI_Presentation"

      }.pptx`,


  });


}









// ======================================================
// CREATE SLIDE
// ======================================================


async function createSlide({

  pptx,

  slide,

  index,

  theme,

  presentation,

}) {



  const page =

    pptx.addSlide();





  applyPremiumBackground(

    page,

    theme,

    index

  );







  const layout =


    getPresentationLayout(

      slide.layout

    )?.type

    ||

    "content";







  switch(layout){



    case "title":


      createTitleSlide(

        page,

        slide,

        presentation,

        theme

      );


      break;





    case "diagram":


      await createDiagramSlide(

        page,

        slide,

        theme

      );


      break;





    case "comparison":


      createComparisonSlide(

        page,

        slide,

        theme

      );


      break;





    case "timeline":


      createTimelineSlide(

        page,

        slide,

        theme

      );


      break;





    case "summary":


      createSummarySlide(

        page,

        slide,

        theme

      );


      break;





    default:


      await createContentSlide(

        page,

        slide,

        theme

      );


  }






  addSlideNumber(

    page,

    index,

    theme

  );



}
// ======================================================
// COVER SLIDE
// ======================================================


function createTitleSlide(

  page,

  slide,

  presentation,

  theme

){



  // only one gradient bar on cover

  addGradientBar(

    page

  );






  page.addText(

    slide.title ||

    presentation.title ||

    "Nyxora AI Presentation",

    {


      x:1,

      y:1.8,

      w:10.5,

      h:0.8,


      fontSize:44,


      bold:true,


      align:"center",


      color:

        cleanColor(

          theme.colors.text

        ),


      margin:0,


    }


  );







  page.addText(

    slide.subtitle ||

    "Introduction",

    {


      x:2,

      y:2.9,

      w:9,


      h:0.4,


      fontSize:20,


      align:"center",


      color:

        cleanColor(

          theme.colors.mutedText

        ),


      margin:0,


    }


  );







  page.addText(

`

Presented By

${

presentation.presenter ||

presentation.author ||

""

}



${

presentation.organization ||

""

}



${

presentation.date ||

""

}

`,

    {


      x:3,

      y:4.3,

      w:7,


      h:1.2,


      fontSize:17,


      align:"center",


      color:

        cleanColor(

          theme.colors.mutedText

        ),


      margin:0,


    }


  );



}









// ======================================================
// BACKGROUND SYSTEM
// ======================================================


function applyPremiumBackground(

  page,

  theme,

  index

){



  page.background = {


    color:

      cleanColor(

        theme.colors.background ||

        "FFFFFF"

      ),


  };







  // no extra line on cover

  if(index !== 0){



    addGradientBar(

      page

    );



  }







  // subtle decoration

  if(index % 2 === 0){



    addDotDecoration(

      page,

      theme

    );


  }



}









// ======================================================
// SMOOTH BLENDED GRADIENT BAR
// ======================================================


function addGradientBar(

 page

){



 const svg = `

<svg

xmlns="http://www.w3.org/2000/svg"

width="1600"

height="40"

>



<defs>


<linearGradient

id="premium"

x1="0"

x2="1"

>



<stop

offset="0"

stop-color="#2563EB"

/>



<stop

offset="0.25"

stop-color="#06B6D4"

/>



<stop

offset="0.5"

stop-color="#22C55E"

/>



<stop

offset="0.75"

stop-color="#EAB308"

/>



<stop

offset="1"

stop-color="#F97316"

/>



</linearGradient>


</defs>





<rect

width="1600"

height="40"

fill="url(#premium)"

/>



</svg>

`;





 page.addImage({

  data:

    svgToDataUri(svg),


  x:0,

  y:0,


  w:13.33,

  h:0.12,


 });



}









// ======================================================
// DOT DECORATION
// Maximum 2 per page
// ======================================================


function addDotDecoration(

 page,

 theme

){



 const color =

 cleanColor(

  theme.colors.accent ||

  "2563EB"

 );







 for(

  let row=0;

  row<4;

  row++

 ){



  for(

   let col=0;

   col<5;

   col++

  ){



   page.addShape(

    "ellipse",

    {


      x:

       11.1 +

       col*0.16,


      y:

       6.25 +

       row*0.16,


      w:

       0.04,


      h:

       0.04,



      fill:{

        color,

        transparency:55,

      },



      line:{

        transparency:100,

      },


    }


   );


  }


 }



}
// ======================================================
// CONTENT SLIDE
// ======================================================


async function createContentSlide(

  page,

  slide,

  theme

){



  addTitleIcon(

    page,

    slide,

    theme

  );







  page.addText(

    slide.title || "",

    {


      x:1.15,

      y:0.55,

      w:7,

      h:0.45,


      fontSize:30,


      bold:true,


      color:

        cleanColor(

          theme.colors.text

        ),


      margin:0,


    }


  );







  if(slide.headline){



    page.addText(

      slide.headline,

      {


        x:1.15,

        y:1.15,

        w:6.5,

        h:0.4,


        fontSize:17,


        color:

          cleanColor(

            theme.colors.mutedText

          ),


        margin:0,


      }


    );



  }







  renderNumberPoints(

    page,

    slide.points || [],

    theme

  );







  // Real AI image

  if(

    slide.imagePrompt

  ){



    await addGeneratedImage(

      page,

      slide,

      theme

    );



  }



}









// ======================================================
// TITLE ICON
// ======================================================


function addTitleIcon(

 page,

 slide,

 theme

){



 page.addShape(

  "ellipse",

  {


   x:0.55,

   y:0.55,

   w:0.45,

   h:0.45,


   fill:{

    color:

     cleanColor(

      theme.colors.accent ||

      "2563EB"

     ),

   },


   line:{

    transparency:100,

   },


  }


 );






 page.addText(

  "✦",

  {


   x:0.55,

   y:0.64,

   w:0.45,

   h:0.12,


   fontSize:16,


   bold:true,


   align:"center",


   color:"FFFFFF",


   margin:0,


  }


 );



}









// ======================================================
// NUMBERED POINTS
// ======================================================


function renderNumberPoints(

 page,

 points,

 theme

){



 const colors = [


  "2563EB",

  "06B6D4",

  "22C55E",

  "F97316"

 ];







 points

 .slice(

  0,

  4

 )

 .forEach(

 (point,index)=>{



  const y =

    1.8 +

    index *

    0.85;





  const color =

    colors[

      index %

      colors.length

    ];







  page.addShape(

   "ellipse",

   {


    x:0.8,

    y,


    w:0.58,

    h:0.58,


    fill:{

      color,

    },


    line:{

      color,

      transparency:100,

    },


   }


  );







  page.addText(

   String(

    index + 1

   ),

   {


    x:0.8,

    y:y+0.16,


    w:0.58,

    h:0.15,


    fontSize:17,


    bold:true,


    color:"FFFFFF",


    align:"center",


    margin:0,


   }


  );







  page.addText(

   point,

   {


    x:1.65,

    y:y+0.12,


    w:5.2,

    h:0.35,


    fontSize:18,


    color:

      cleanColor(

        theme.colors.text

      ),


    margin:0,


   }


  );



 });



}









// ======================================================
// REAL AI IMAGE RENDERER
// No fake placeholder
// ======================================================


async function addGeneratedImage(

 page,

 slide,

 theme

){



 try{



  const visual =

    await generateSlideVisual({


      visualType:

        "image",



      prompt:

        slide.imagePrompt,



    });






  const prepared =

    prepareVisualForPpt(

      visual

    );







  if(!prepared){


    return;


  }








  page.addImage({

    data:

      prepared.data,


    x:7.4,

    y:1.4,


    w:4.3,

    h:3.5,


  });





 }

 catch(error){



  console.error(

    "Image generation failed",

    error

  );



 }



}
// ======================================================
// DIAGRAM SLIDE
// Connected flow chart
//
// Added:
// ✓ arrows
// ✓ icons
// ✓ better spacing
// ======================================================


async function createDiagramSlide(

 page,

 slide,

 theme

){



 addTitleIcon(

  page,

  slide,

  theme

 );





 page.addText(

  slide.title || "",

  {


   x:1.15,

   y:0.55,

   w:8,

   h:0.45,


   fontSize:30,


   bold:true,


   color:

    cleanColor(

     theme.colors.text

    ),


   margin:0,


  }


 );







 const steps =

   slide.diagram?.steps || [];







 const startX = 0.7;

 const gap = 0.65;

 const width = 1.9;







 steps.forEach(

 (step,index)=>{



  const x =

    startX +

    index *

    (width + gap);







  // connector arrow

  if(

   index < steps.length - 1

  ){



   page.addShape(

    "line",

    {


     x:x+width,

     y:2.8,


     w:gap,

     h:0,


     line:{

      color:

       cleanColor(

        theme.colors.accent

       ),


      width:2,


      endArrowType:

       "triangle",


     },


    }


   );



  }









  // node box

  page.addShape(

   "roundRect",

   {


    x,

    y:2.25,


    w:width,

    h:1.2,


    fill:{

     color:

      cleanColor(

       theme.colors.surface ||

       "F8FAFC"

      ),

    },


    line:{

     color:

      cleanColor(

       theme.colors.accent ||

       "2563EB"

      ),


     width:1.2,


    },


   }


  );








  // icon

  page.addShape(

   "ellipse",

   {


    x:x+0.7,

    y:2.4,


    w:0.45,

    h:0.45,


    fill:{

     color:

      cleanColor(

       theme.colors.accent ||

       "2563EB"

      ),

    },


    line:{

     transparency:100,

    },


   }


  );








  page.addText(

   "✦",

   {


    x:x+0.7,

    y:2.5,


    w:0.45,

    h:0.1,


    fontSize:14,


    align:"center",


    color:"FFFFFF",


    margin:0,


   }


  );








  page.addText(

   step,

   {


    x:x+0.1,

    y:3,


    w:1.7,

    h:0.25,


    fontSize:13,


    bold:true,


    align:"center",


    color:

     cleanColor(

      theme.colors.text

     ),


    margin:0,


   }


  );




 });


}









// ======================================================
// COMPARISON SLIDE
// ======================================================


function createComparisonSlide(

 page,

 slide,

 theme

){



 addTitleIcon(

  page,

  slide,

  theme

 );






 page.addText(

  slide.title || "",

  {


   x:1.15,

   y:0.55,


   w:8,

   h:0.45,


   fontSize:30,


   bold:true,


   color:

    cleanColor(

     theme.colors.text

    ),


   margin:0,


  }


 );







 createComparisonBlock(

  page,

  slide.leftTitle ||

   "Before",


  slide.leftPoints || [],


  0.8,


  "2563EB",


  theme


 );







 createComparisonBlock(

  page,

  slide.rightTitle ||

   "After",


  slide.rightPoints || [],


  6.8,


  "22C55E",


  theme


 );



}









function createComparisonBlock(

 page,

 title,

 points,

 x,

 accent,

 theme

){



 page.addShape(

  "roundRect",

  {


   x,

   y:1.7,


   w:5,

   h:3.3,


   fill:{

    color:

     "F8FAFC",

   },


   line:{

    color:accent,

    width:1.5,

   },


  }


 );







 page.addText(

  title,

  {


   x:x+0.3,

   y:2.05,


   w:4,


   h:0.3,


   fontSize:22,


   bold:true,


   color:accent,


   margin:0,


  }


 );







 points

 .slice(0,3)

 .forEach(

 (item,index)=>{



  const y =

   2.7 +

   index *

   0.65;







  page.addShape(

   "ellipse",

   {


    x:x+0.35,

    y,


    w:0.35,

    h:0.35,


    fill:{

     color:accent,

    },


    line:{

     transparency:100,

    },


   }


  );







  page.addText(

   String(index+1),

   {


    x:x+0.35,

    y:y+0.08,


    w:0.35,

    h:0.1,


    fontSize:11,


    bold:true,


    color:"FFFFFF",


    align:"center",


    margin:0,


   }


  );








  page.addText(

   item,

   {


    x:x+0.85,


    y:y+0.04,


    w:3.6,


    h:0.25,


    fontSize:15,


    color:

     cleanColor(

      theme.colors.text

     ),


    margin:0,


   }


  );



 });


}









// ======================================================
// TIMELINE SLIDE
// ======================================================


function createTimelineSlide(

 page,

 slide,

 theme

){



 addTitleIcon(

  page,

  slide,

  theme

 );







 page.addText(

  slide.title || "",

  {


   x:1.15,

   y:0.55,


   w:8,


   h:0.45,


   fontSize:30,


   bold:true,


   color:

    cleanColor(

     theme.colors.text

    ),


   margin:0,


  }


 );







 const items =

  slide.timeline ||

  slide.points ||

  [];







 items.forEach(

 (item,index)=>{



  const y =

   1.8 +

   index *

   0.75;







  page.addShape(

   "ellipse",

   {


    x:1,


    y,


    w:0.4,


    h:0.4,


    fill:{

     color:

      index % 2 === 0

      ?

      "2563EB"

      :

      "22C55E",

    },


    line:{

     transparency:100,

    },


   }


  );







  page.addText(

   String(index+1),

   {


    x:1,


    y:y+0.1,


    w:0.4,


    h:0.1,


    fontSize:11,


    bold:true,


    color:"FFFFFF",


    align:"center",


    margin:0,


   }


  );







  page.addText(

   item,

   {


    x:1.7,


    y:y+0.05,


    w:8,


    h:0.25,


    fontSize:18,


    color:

     cleanColor(

      theme.colors.text

     ),


    margin:0,


   }


  );



 });


}
// ======================================================
// SUMMARY SLIDE
// ======================================================


function createSummarySlide(

 page,

 slide,

 theme

){



 addGradientBar(

  page

 );







 page.addText(

  slide.title ||

  "Key Takeaway",

  {


   x:0.8,

   y:1.6,


   w:11,


   h:0.6,


   fontSize:40,


   bold:true,


   align:"center",


   color:

    cleanColor(

     theme.colors.text

    ),


   margin:0,


  }


 );







 page.addText(

  slide.keyTakeaway ||

  slide.description ||

  "",

  {


   x:1.5,


   y:2.8,


   w:10,


   h:0.8,


   fontSize:24,


   bold:true,


   align:"center",


   color:

    cleanColor(

     theme.colors.text

    ),


   margin:0,


  }


 );



}









// ======================================================
// SLIDE NUMBER
// ======================================================


function addSlideNumber(

 page,

 index,

 theme

){



 page.addText(

  String(index+1),

  {


   x:12.5,

   y:7,


   w:0.25,

   h:0.2,


   fontSize:10,


   color:

    cleanColor(

     theme.colors.mutedText

    ),


   margin:0,


  }


 );



}









// ======================================================
// SVG DATA URI
// ======================================================


function svgToDataUri(

 svg

){



 return (

  "data:image/svg+xml;base64," +

  btoa(

   unescape(

    encodeURIComponent(

     svg

    )

   )

  )

 );



}









// ======================================================
// COLOR CLEANER
// ======================================================


function cleanColor(

 color

){



 return String(

  color ||

  "FFFFFF"

 )

 .replace(

  "#",

  ""

 );



}









// ======================================================
// VALIDATION
// ======================================================


function validateSlide(

 slide

){



 return (

  slide &&

  typeof slide === "object"

 );



}









// ======================================================
// SAFE TEXT HELPERS
// ======================================================


function safeText(

 value

){


 return value || "";


}








function trimText(

 text,

 limit = 120

){



 const value =

  safeText(text);





 if(

  value.length <= limit

 ){

  return value;

 }






 return (

  value.substring(

   0,

   limit

  )

  +

  "..."

 );



}









// ======================================================
// END NYXORA AI PPT EXPORT ENGINE
//
// Preserved:
//
// ✓ PptxGenJS
// ✓ Export
// ✓ Layout system
// ✓ AI JSON
// ✓ SVG support
// ✓ Image support
// ✓ Diagram
// ✓ Comparison
// ✓ Timeline
// ✓ Summary
//
// Added:
//
// ✓ Smooth gradient bar
// ✓ Cover information
// ✓ AI image rendering
// ✓ Numbered points
// ✓ Connected flow charts
// ✓ Premium spacing
// ✓ Decorative dots
//
// ======================================================