import {
    Worker
}
from "@react-pdf-viewer/core";


import {
    Viewer
}
from "@react-pdf-viewer/core";


import {
    defaultLayoutPlugin
}
from "@react-pdf-viewer/default-layout";


import "@react-pdf-viewer/core/lib/styles/index.css";

import "@react-pdf-viewer/default-layout/lib/styles/index.css";





export default function PDFPreview({

    fileUrl

}){


const defaultLayoutPluginInstance =

defaultLayoutPlugin();





if(!fileUrl){

    return null;

}





return (


<div

key={fileUrl}

style={{

    height:"900px",

    width:"100%",

    borderRadius:"16px",

    overflow:"hidden",

    background:"#ffffff"

}}

>


<Worker

workerUrl=

"https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js"

>


<Viewer

key={fileUrl}

fileUrl={fileUrl}

plugins={[

defaultLayoutPluginInstance

]}

/>


</Worker>


</div>


);


}