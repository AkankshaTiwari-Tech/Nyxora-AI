import PptxGenJS from "pptxgenjs";


import presentationThemes
  from "../utils/presentationThemes";


import branding
  from "../utils/branding";


import {
  getPresentationLayout,
} from "../utils/presentationLayouts";


import {
  generateSlideVisual,
} from "./visualGenerationService";







// ======================================================
// NYXORA AI KEYNOTE STYLE PPT ENGINE
//
// Flow:
//
// AI Slide JSON
//        ↓
// Layout Engine
//        ↓
// Visual Engine
//        ↓
// PPTX Export
//
// Style:
//
// - Apple Keynote inspired
// - Minimal
// - Cinematic
// - Premium spacing
//
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







  pptx.subject =

    presentation.title;







  pptx.title =

    presentation.title;








  pptx.theme = {


    headFontFace:

      theme.typography.title,



    bodyFontFace:

      theme.typography.body,



    lang:

      "en-US",



  };








  presentation.slides.forEach(

    (slide,index)=>{



      createSlide({

        pptx,

        slide,

        index,

        theme,

      });



    }

  );








  await pptx.writeFile({



    fileName:


      `${

        presentation.title ||

        "Nyxora_AI_Presentation"

      }.pptx`,



  });



}













function createSlide({


  pptx,


  slide,


  index,


  theme,



}) {



  const page =

    pptx.addSlide();








  applyPremiumBackground(

    page,

    theme

  );








  addBranding(

    page,

    theme

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

        theme

      );


      break;





    case "diagram":


      createDiagramSlide(

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


      createContentSlide(

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
function createTitleSlide(

  page,

  slide,

  theme

){



  // Main cinematic glow


  page.addShape(

    "ellipse",

    {


      x:

        4.2,


      y:

        1.2,


      w:

        4,


      h:

        3,



      fill:{


        color:

          cleanColor(

            theme.colors.primary

          ),


        transparency:

          65,



      },



      line:{


        transparency:

          100,



      },


    }


  );









  page.addText(


    slide.title ||


    "Nyxora AI Presentation",


    {


      x:

        1,


      y:

        2,


      w:

        11,


      h:

        0.8,



      fontSize:

        42,



      bold:

        true,



      align:

        "center",



      color:

        cleanColor(

          theme.colors.text

        ),



      breakLine:

        false,



      margin:

        0,



    }


  );









  if(slide.subtitle){



    page.addText(


      slide.subtitle,


      {


        x:

          2,


        y:

          3.1,


        w:

          9,


        h:

          0.4,



        fontSize:

          18,



        align:

          "center",



        color:

          cleanColor(

            theme.colors.mutedText

          ),



        margin:

          0,



      }


    );



  }









  page.addShape(

    "line",

    {


      x:

        5,


      y:

        4.1,


      w:

        2,


      h:

        0,



      line:{


        color:

          cleanColor(

            theme.colors.accent

          ),



        width:

          2,



      },


    }


  );



}











// ======================================================
// CONTENT SLIDE
//
// Keynote style:
// - Less text
// - Strong hierarchy
// - Visual focus
//
// ======================================================



function createContentSlide(

  page,

  slide,

  theme

){



  addTitle(

    page,

    slide.title,

    theme

  );







  if(

    slide.points &&

    slide.points.length

  ){



    page.addText(


      slide.points.map(

        point => ({


          text:

            point,


          options:{


            bullet:{


              indent:

                16,


            },



          },


        })


      ),



      {


        x:

          0.9,


        y:

          1.7,


        w:

          slide.imagePrompt

          ?


          5.2


          :


          10,



        h:

          3,



        fontSize:

          20,



        breakLine:

          true,



        color:

          cleanColor(

            theme.colors.text

          ),



        paraSpaceAfterPt:

          18,



      }


    );



  }







  if(

    slide.imagePrompt ||

    slide.visualType

  ){



    addGeneratedVisual(

      page,

      slide,

      theme

    );



  }








  if(

    slide.keyTakeaway

  ){



    createInsight(

      page,

      slide.keyTakeaway,

      theme

    );



  }



}
function createDiagramSlide(

  page,

  slide,

  theme

){



  addTitle(

    page,

    slide.title,

    theme

  );








  const steps =


    slide.diagram?.steps || [];








  if(

    steps.length === 0

  ){

    createVisualPlaceholder(

      page,

      "No Diagram Data",

      "AI could not generate diagram steps.",

      3,

      2.5,

      6,

      1.5,

      theme

    );


    return;

  }









  const startX = 0.8;


  const boxWidth = 2.1;


  const gap = 0.35;







  steps.forEach(

    (step,index)=>{



      const x =

        startX +

        index *

        (

          boxWidth +

          gap

        );








      page.addShape(

        "roundRect",

        {


          x,


          y:

            2.5,


          w:

            boxWidth,


          h:

            1.1,



          rectRadius:

            0.15,



          fill:{


            color:

              cleanColor(

                theme.colors.primary

              ),


            transparency:

              15,



          },



          line:{


            color:

              cleanColor(

                theme.colors.accent

              ),



            width:

              1,



          },



          shadow:{


            type:

              "outer",


            blur:

              3,


            angle:

              45,


            distance:

              2,


            opacity:

              0.2,



          },


        }


      );








      page.addText(


        step,


        {


          x:

            x + 0.15,


          y:

            2.82,


          w:

            boxWidth - 0.3,


          h:

            0.5,



          fontSize:

            getDynamicFontSize(

              step

            ),



          bold:

            true,



          align:

            "center",



          valign:

            "mid",



          color:

            "FFFFFF",



          breakLine:

            true,



          margin:

            0,



        }


      );









      if(

        index <

        steps.length - 1

      ){



        page.addText(

          "→",

          {


            x:

              x +

              boxWidth +

              0.05,



            y:

              2.85,



            w:

              0.3,



            h:

              0.3,



            fontSize:

              22,



            bold:

              true,



            color:

              cleanColor(

                theme.colors.accent

              ),



          }


        );



      }



    }


  );



}









function getDynamicFontSize(

  text

){



  if(

    !text

  ){

    return 16;

  }



  if(

    text.length > 30

  ){

    return 10;

  }



  if(

    text.length > 20

  ){

    return 12;

  }



  return 15;



}
function addGeneratedVisual(

  page,

  slide,

  theme

){



  const visual =


    generateSlideVisual({



      visualType:


        slide.visualType ||


        "image",




      prompt:


        slide.imagePrompt ||


        "",




      diagram:


        slide.diagram,



    });








  if(

    !visual

  ){

    return;

  }








  if(

    visual.type === "image"

    &&

    visual.format === "svg"

  ){



    page.addImage({



      data:


        svgToDataUri(

          visual.data

        ),




      x:

        7.2,



      y:

        1.7,



      w:

        4.1,



      h:

        2.8,



    });



  }



}









function createInsight(

  page,

  text,

  theme

){



  page.addShape(

    "roundRect",

    {


      x:

        0.9,


      y:

        5.5,


      w:

        5.5,


      h:

        0.8,



      fill:{


        color:

          cleanColor(

            theme.colors.primary

          ),


        transparency:

          35,



      },



      line:{


        color:

          cleanColor(

            theme.colors.accent

          ),



      },



    }


  );








  page.addText(


    "✦ " +

    text,


    {


      x:

        1.15,


      y:

        5.75,


      w:

        5,


      h:

        0.25,



      fontSize:

        14,



      bold:

        true,



      color:

        cleanColor(

          theme.colors.text

        ),



      margin:

        0,



    }


  );



}









function createComparisonSlide(

  page,

  slide,

  theme

){



  addTitle(

    page,

    slide.title,

    theme

  );








  createComparisonBlock(

    page,

    slide.leftTitle ||

    "Before",


    slide.leftPoints || [],


    0.9,


    theme



  );








  createComparisonBlock(

    page,

    slide.rightTitle ||

    "After",


    slide.rightPoints || [],


    6.8,


    theme



  );



}









function createComparisonBlock(

  page,

  title,

  points,

  x,

  theme

){



  page.addShape(

    "roundRect",

    {


      x,


      y:

        2,


      w:

        5,


      h:

        2.8,



      fill:{


        color:

          cleanColor(

            theme.colors.surface

          ),



        transparency:

          20,



      },



      line:{


        color:

          cleanColor(

            theme.colors.accent

          ),



        transparency:

          40,



      },



    }


  );








  page.addText(


    title,


    {


      x:

        x + 0.3,


      y:

        2.3,


      w:

        4,


      h:

        0.3,



      fontSize:

        22,



      bold:

        true,



      color:

        cleanColor(

          theme.colors.accent

        ),



    }


  );








  page.addText(


    points.map(

      item =>

        "• " + item

    ).join("\n"),



    {


      x:

        x + 0.3,


      y:

        2.9,


      w:

        4.2,


      h:

        1.3,



      fontSize:

        15,



      color:

        cleanColor(

          theme.colors.text

        ),



      breakLine:

        true,



    }


  );



}
function createTimelineSlide(

  page,

  slide,

  theme

){



  addTitle(

    page,

    slide.title,

    theme

  );








  const items =


    slide.timeline ||


    slide.points ||


    [];








  if(

    items.length === 0

  ){



    return;



  }








  items.forEach(

    (item,index)=>{



      const y =

        1.8 +

        index *

        0.7;








      page.addShape(

        "ellipse",

        {


          x:

            1,


          y,


          w:

            0.18,


          h:

            0.18,



          fill:{


            color:

              cleanColor(

                theme.colors.accent

              ),



          },



          line:{


            color:

              cleanColor(

                theme.colors.accent

              ),



          },


        }


      );








      page.addText(


        item,


        {


          x:

            1.5,


          y:

            y - 0.03,


          w:

            8.5,


          h:

            0.3,



          fontSize:

            18,



          color:

            cleanColor(

              theme.colors.text

            ),



          margin:

            0,



        }


      );








      if(

        index <

        items.length - 1

      ){



        page.addShape(

          "line",

          {


            x:

              1.08,


            y:

              y + 0.18,


            w:

              0,


            h:

              0.45,



            line:{


              color:

                cleanColor(

                  theme.colors.accent

                ),


              width:

                1,



            },


          }


        );



      }



    }


  );



}









function createSummarySlide(

  page,

  slide,

  theme

){



  addTitle(

    page,

    slide.title ||

    "Summary",

    theme

  );








  const summary =


    slide.keyTakeaway ||


    slide.points?.join("\n") ||


    "";









  page.addShape(

    "roundRect",

    {


      x:

        1.2,


      y:

        2,


      w:

        10.5,


      h:

        2.5,



      fill:{


        color:

          cleanColor(

            theme.colors.surface

          ),



        transparency:

          15,



      },



      line:{


        color:

          cleanColor(

            theme.colors.accent

          ),



      },



      shadow:{


        type:

          "outer",


        blur:

          5,


        angle:

          45,


        distance:

          2,


        opacity:

          0.25,



      },


    }


  );








  page.addText(


    summary,


    {


      x:

        1.8,


      y:

        2.8,


      w:

        9,


      h:

        0.8,



      fontSize:

        22,



      bold:

        true,



      align:

        "center",



      valign:

        "mid",



      color:

        cleanColor(

          theme.colors.text

        ),



      margin:

        0,



    }


  );



}
function addTitle(

  page,

  title,

  theme

){



  page.addText(


    title || "",


    {


      x:

        0.8,


      y:

        0.45,


      w:

        10,


      h:

        0.5,



      fontSize:

        30,



      bold:

        true,



      color:

        cleanColor(

          theme.colors.text

        ),



      margin:

        0,



    }


  );



}









function applyPremiumBackground(

  page,

  theme

){



  page.background = {



    color:

      cleanColor(

        theme.colors.background

      ),



  };








  page.addShape(

    "ellipse",

    {


      x:

        10.5,


      y:

        -0.8,


      w:

        3,


      h:

        3,



      fill:{


        color:

          cleanColor(

            theme.colors.primary

          ),



        transparency:

          75,



      },



      line:{


        transparency:

          100,



      },


    }


  );








  page.addShape(

    "ellipse",

    {


      x:

        -1,


      y:

        5.5,


      w:

        3,


      h:

        3,



      fill:{


        color:

          cleanColor(

            theme.colors.accent

          ),



        transparency:

          85,



      },



      line:{


        transparency:

          100,



      },


    }


  );



}









function addBranding(

  page,

  theme

){



  if(

    branding.header.enabled

  ){



    page.addText(


      branding.header.text,


      {


        x:

          0.5,


        y:

          0.2,


        w:

          3,


        h:

          0.2,



        fontSize:

          10,



        bold:

          true,



        color:

          cleanColor(

            theme.colors.accent

          ),



        margin:

          0,



      }


    );



  }








  if(

    branding.footer.enabled

  ){



    page.addText(


      branding.footer.text,


      {


        x:

          0.5,


        y:

          7,


        w:

          4,


        h:

          0.2,



        fontSize:

          9,



        color:

          cleanColor(

            theme.colors.mutedText

          ),



        margin:

          0,



      }


    );



  }



}









function addSlideNumber(

  page,

  index,

  theme

){



  page.addText(


    String(index + 1),


    {


      x:

        12.6,


      y:

        7,


      w:

        0.2,


      h:

        0.2,



      fontSize:

        10,



      color:

        cleanColor(

          theme.colors.mutedText

        ),



      margin:

        0,



    }


  );



}
// ======================================================
// SVG IMAGE SUPPORT
//
// Used by:
// visualGenerationService
//
// Flow:
//
// SVG
// ↓
// Data URI
// ↓
// pptx.addImage()
//
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
// VISUAL PLACEHOLDER
//
// Used when AI visual generation
// does not return an asset.
//
// ======================================================


function createVisualPlaceholder(

  page,

  title,

  description,

  x,

  y,

  w,

  h,

  theme

){



  page.addShape(

    "roundRect",

    {


      x,

      y,

      w,

      h,



      fill:{


        color:

          cleanColor(

            theme.colors.surface

          ),



        transparency:

          20,



      },



      line:{


        color:

          cleanColor(

            theme.colors.accent

          ),



      },


    }


  );








  page.addText(


    title,


    {


      x:

        x + 0.2,


      y:

        y + 0.25,


      w:

        w - 0.4,


      h:

        0.3,



      fontSize:

        18,



      bold:

        true,



      align:

        "center",



      color:

        cleanColor(

          theme.colors.accent

        ),



      margin:

        0,



    }


  );








  page.addText(


    description,


    {


      x:

        x + 0.3,


      y:

        y + 0.8,


      w:

        w - 0.6,


      h:

        h - 1,



      fontSize:

        13,



      align:

        "center",



      color:

        cleanColor(

          theme.colors.text

        ),



      margin:

        0,



    }


  );



}









// ======================================================
// TEXT HELPERS
// ======================================================


function cleanColor(

  color

){



  return (

    color ||

    "#FFFFFF"

  ).replace(

    "#",

    ""

  );



}









function safeText(

  value

){



  return (

    value ||

    ""

  );



}









function trimText(

  text,

  limit = 120

){



  const value =

    safeText(

      text

    );







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
// FUTURE AI IMAGE SUPPORT
//
// Future flow:
//
// imagePrompt
//      ↓
// AI Image Generator
//      ↓
// Image URL / Base64
//      ↓
// pptx.addImage()
//
// ======================================================


async function addExternalImage(

  page,

  imageSource,

  x,

  y,

  w,

  h

){



  if(

    !imageSource

  ){

    return;

  }







  page.addImage({



    path:

      imageSource,



    x,

    y,

    w,

    h,



  });



}









// ======================================================
// EXPORT VALIDATION
//
// Prevents broken slides
// ======================================================


function validateSlide(

  slide

){



  return (

    slide &&

    typeof slide ===

    "object"

  );



}









// ======================================================
// END OF NYXORA AI KEYNOTE PPT ENGINE
//
// Current Architecture:
//
// Gemini
//    ↓
// Presentation JSON
//    ↓
// Layout Engine
//    ↓
// Visual Generation Service
//    ↓
// addImage()
// or
// addShape()
//    ↓
// Premium PPTX
//
// Ready for:
//
// ✓ AI image generation
// ✓ SVG visuals
// ✓ Cinematic templates
// ✓ Smart layouts
//
// ======================================================