const presentationLayouts = {


  title: {


    name:
      "Premium Hero",


    description:
      "Clean title slide with large typography and minimal branding",


    type:
      "title",


  },





  content: {


    name:
      "Editorial Content",


    description:
      "Minimal text layout with strong hierarchy and optional visual",


    type:
      "content",


  },





  imageText: {


    name:
      "Visual Story",


    description:
      "Split composition with explanation and supporting visual",


    type:
      "imageText",


  },





  diagram: {


    name:
      "Process Flow",


    description:
      "Clean step-by-step process visualization",


    type:
      "diagram",


  },





  comparison: {


    name:
      "Comparison View",


    description:
      "Balanced comparison between two concepts",


    type:
      "comparison",


  },





  timeline: {


    name:
      "Timeline Story",


    description:
      "Sequential story progression layout",


    type:
      "timeline",


  },





  summary: {


    name:
      "Key Takeaway",


    description:
      "Minimal closing slide with memorable message",


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