import {

    View,

    Text

}

from "@react-pdf/renderer";



export default function PDFFooter(){



return (

<View

style={{

    position:"absolute",

    bottom:20,

    left:40,

    right:40,

    alignItems:"center"

}}

>



<Text

style={{

    fontSize:8,

    color:"#94A3B8"

}}

>

Nyxora AI • Smart Digital Learning Workspace

</Text>



</View>

);


}