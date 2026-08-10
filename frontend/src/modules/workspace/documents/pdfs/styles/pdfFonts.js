import {
    Font
}
from "@react-pdf/renderer";



import NotoRegular
from "../../../../../assets/fonts/NotoSansDevanagari-Regular.ttf";

import NotoRegularLatin
from "../../../../../assets/fonts/NotoSans-Regular.ttf";

import NotoSymbols
from "../../../../../assets/fonts/NotoSansSymbols2-Regular.ttf";

import NotoMath
from "../../../../../assets/fonts/NotoSansMath-Regular.ttf";

import StixMath
from "../../../../../assets/fonts/STIXTwoMath-Regular.ttf";

Font.register({

    family:"NotoSansDevanagari",

    src:NotoRegular,

});

Font.register({
  family: "NotoSans",
  src: NotoRegularLatin,
});

Font.register({
  family: "NotoSansSymbols2",
  src: NotoSymbols,
});

Font.register({
  family: "NotoSansMath",
  src: NotoMath,
});

Font.register({
  family: "STIXTwoMath",
  src: StixMath,
});

export default "NotoSansDevanagari";