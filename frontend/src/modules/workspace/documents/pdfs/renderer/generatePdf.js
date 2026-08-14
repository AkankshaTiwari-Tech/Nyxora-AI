import {
    pdf
}
from "@react-pdf/renderer";


import {
    createElement
}
from "react";

import {
    Buffer
}
from "buffer";

if (
    typeof globalThis.Buffer === "undefined"
) {
    globalThis.Buffer = Buffer;
}


import NyxoraPDF
from "../components/NyxoraPDF";





async function createPdfBlob(data = {}) {
    const documentElement = createElement(
        NyxoraPDF,
        {
            data
        }
    );

    const instance = pdf(
        documentElement
    );

    const blob =
        await instance.toBlob();

    return blob;
}








export async function generateWorkspacePdf(

    data = {}

){


const blob =

await createPdfBlob(

    data

);




return {

    blob,


    filename:

    `${data.title || "Nyxora Document"}.pdf`

};


}








export async function createWorkspacePdfUrl(

    data = {}

){


const {

    blob

}

=

await generateWorkspacePdf(

    data

);




return URL.createObjectURL(

    blob

);


}








export async function downloadWorkspacePdf(
  data = {}
) {

  const {
    blob,
    filename,
  } =
    await generateWorkspacePdf(
      data
    );


  if (
    !blob ||
    blob.size === 0
  ) {

    throw new Error(
      "Generated PDF is empty."
    );

  }


  const url =
    URL.createObjectURL(
      blob
    );


  const link =
    document.createElement(
      "a"
    );


  link.href =
    url;

  link.download =
    filename ||
    "Nyxora Document.pdf";


  link.style.display =
    "none";


  document.body.appendChild(
    link
  );


  link.click();


  document.body.removeChild(
    link
  );


  // Keep the Blob URL alive long enough for
  // the browser to complete the download.

  setTimeout(
    () => {

      URL.revokeObjectURL(
        url
      );

    },
    10000
  );

}

export default generateWorkspacePdf;