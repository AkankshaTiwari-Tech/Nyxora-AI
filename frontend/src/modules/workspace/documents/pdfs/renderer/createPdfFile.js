import {
    pdf
}
from "@react-pdf/renderer";


import NyxoraPDF
from "../components/NyxoraPDF";





export async function createPdfFile(

    data={}

){


const blob =

await pdf(

    <NyxoraPDF

        data={
            data
        }

    />

)

.toBlob();




const url =

URL.createObjectURL(

    blob

);



return url;


}