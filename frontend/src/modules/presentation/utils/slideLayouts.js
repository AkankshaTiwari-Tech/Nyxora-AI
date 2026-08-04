const slideLayouts = {


  title: {

    name:
      "Title Slide",

    type:
      "title",

    elements: [

      "title",

      "subtitle",

      "branding",

    ],

  },




  content: {

    name:
      "Title + Content",

    type:
      "content",

    elements: [

      "title",

      "bullets",

      "footer",

    ],

  },




  twoColumn: {

    name:
      "Two Column",

    type:
      "two-column",

    elements: [

      "title",

      "leftContent",

      "rightContent",

      "footer",

    ],

  },




  imageText: {

    name:
      "Image + Text",

    type:
      "image-text",

    elements: [

      "title",

      "image",

      "content",

      "footer",

    ],

  },




  diagram: {

    name:
      "Diagram Slide",

    type:
      "diagram",

    elements: [

      "title",

      "diagram",

      "explanation",

      "footer",

    ],

  },




  summary: {

    name:
      "Summary Slide",

    type:
      "summary",

    elements: [

      "title",

      "keyPoints",

      "branding",

    ],

  },


};


export default slideLayouts;