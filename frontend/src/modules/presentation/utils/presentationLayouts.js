const presentationLayouts = {


  title: {

    name:
      "Title Slide",

    description:
      "Large centered title with subtitle and branding",

    type:
      "title",


  },



  content: {

    name:
      "Content Slide",

    description:
      "Title with bullet points and supporting visual",

    type:
      "content",


  },



  imageText: {

    name:
      "Image Text",

    description:
      "Split layout with text and visual",

    type:
      "imageText",


  },



  diagram: {

    name:
      "Process Diagram",

    description:
      "Flow based diagram with connected steps",

    type:
      "diagram",


  },



  comparison: {

    name:
      "Comparison",

    description:
      "Two side comparison layout",

    type:
      "comparison",


  },



  timeline: {

    name:
      "Timeline",

    description:
      "Sequential timeline presentation",

    type:
      "timeline",


  },



  summary: {

    name:
      "Summary",

    description:
      "Key takeaway ending slide",

    type:
      "summary",


  },


};





export function getPresentationLayout(

  layout

){


  return (

    presentationLayouts[layout]

    ||

    presentationLayouts.content

  );


}





export function getAvailableLayouts(){

  return Object.keys(

    presentationLayouts

  );


}





export default presentationLayouts;