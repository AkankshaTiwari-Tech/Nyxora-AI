import {
    pdf
}
from "@react-pdf/renderer";


import {
    createElement
}
from "react";


import NyxoraPDF
from "../components/NyxoraPDF";





async function createPdfBlob(

    data = {}

){


const documentElement =

createElement(

    NyxoraPDF,

    {

        data

    }

);





const instance =

pdf();



instance.updateContainer(

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

){


const {

    blob,

    filename

}

=

await generateWorkspacePdf(

    data

);





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

filename;



document.body.appendChild(

    link

);



link.click();



document.body.removeChild(

    link

);





setTimeout(

()=>{

URL.revokeObjectURL(

    url

);

},

1000

);



}





export default generateWorkspacePdf;