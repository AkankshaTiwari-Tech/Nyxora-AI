import {
  View,
  Text
} from "@react-pdf/renderer";

import PDFOption
from "./PDFOption";

import MathExpression
from "../renderer/MathExpression";

import MathDiagram
from "../diagrams/MathDiagram";

import pdfTheme
from "../styles/pdfTheme";



function replaceBalancedLatexCommand(
  value,
  command,
  replacer
) {

  const prefix = "\\" + command;

  let result = String(value || "");

  let searchFrom = 0;

  while (true) {

    const start = result.indexOf(
      prefix,
      searchFrom
    );

    if (start < 0) {
      break;
    }

    const openBrace =
      result.indexOf(
        "{",
        start + prefix.length
      );

    if (openBrace < 0) {
      break;
    }

    let depth = 0;

    let closeBrace = -1;

    for (
      let i = openBrace;
      i < result.length;
      i++
    ) {

      if (result[i] === "{") {
        depth++;
      }

      else if (result[i] === "}") {

        depth--;

        if (depth === 0) {
          closeBrace = i;
          break;
        }

      }

    }

    if (closeBrace < 0) {
      break;
    }

    const content =
      result.slice(
        openBrace + 1,
        closeBrace
      );

    if (command === "frac" ||
        command === "dfrac") {

      let denominatorStart =
        closeBrace + 1;

      while (
        denominatorStart < result.length &&
        /\s/.test(result[denominatorStart])
      ) {
        denominatorStart++;
      }

      if (
        result[denominatorStart] !== "{"
      ) {
        searchFrom =
          closeBrace + 1;

        continue;
      }

      let denominatorDepth = 0;

      let denominatorEnd = -1;

      for (
        let i = denominatorStart;
        i < result.length;
        i++
      ) {

        if (result[i] === "{") {
          denominatorDepth++;
        }

        else if (result[i] === "}") {

          denominatorDepth--;

          if (denominatorDepth === 0) {
            denominatorEnd = i;
            break;
          }

        }

      }

      if (denominatorEnd < 0) {
        break;
      }

      const denominator =
        result.slice(
          denominatorStart + 1,
          denominatorEnd
        );

      const replacement =
        replacer(
          content,
          denominator
        );

      result =
        result.slice(0, start) +
        replacement +
        result.slice(denominatorEnd + 1);

      searchFrom =
        start + replacement.length;

      continue;
    }

    const replacement =
      replacer(content);

    result =
      result.slice(0, start) +
      replacement +
      result.slice(closeBrace + 1);

    searchFrom =
      start + replacement.length;
  }

  return result;
}



function cleanAnswerKeyText(text = "") {

  let value =
    String(text || "");

  // --------------------------------------------------
  // REMOVE MARKDOWN
  // --------------------------------------------------

  value =
    value
      .replace(/\*\*/g, "")
      .replace(/\`/g, "");



  // --------------------------------------------------
  // FRACTIONS
  // --------------------------------------------------

  value =
    replaceBalancedLatexCommand(
      value,
      "frac",
      (numerator, denominator) =>
        `${numerator}/${denominator}`
    );

  value =
    replaceBalancedLatexCommand(
      value,
      "dfrac",
      (numerator, denominator) =>
        `${numerator}/${denominator}`
    );



  // --------------------------------------------------
  // SQUARE ROOTS
  // --------------------------------------------------

  value =
    replaceBalancedLatexCommand(
      value,
      "sqrt",
      content =>
        `√(${content})`
    );



  // --------------------------------------------------
  // COMMON LATEX COMMANDS
  // --------------------------------------------------

  value =
    value
      .replace(/\\implies/g, "⇒")
      .replace(/\\Rightarrow/g, "⇒")
      .replace(/\\Longrightarrow/g, "⇒")

      .replace(/\\therefore/g, "∴")
      .replace(/\\because/g, "∵")

      .replace(/\\rightarrow/g, "→")
      .replace(/\\to/g, "→")

      .replace(/\\triangle/g, "△ ")
      .replace(/\\Delta/g, "Δ")

      .replace(/\\angle/g, "∠")
      .replace(/\\alpha/g, "α")
      .replace(/\\beta/g, "β")
      .replace(/\\gamma/g, "γ")
      .replace(/\\delta/g, "δ")
      .replace(/\\epsilon/g, "ε")
      .replace(/\\theta/g, "θ")
      .replace(/\\lambda/g, "λ")
      .replace(/\\mu/g, "μ")
      .replace(/\\pi/g, "π")
      .replace(/\\rho/g, "ρ")
      .replace(/\\sigma/g, "σ")
      .replace(/\\phi/g, "φ")
      .replace(/\\psi/g, "ψ")
      .replace(/\\omega/g, "ω")

      .replace(/\\Gamma/g, "Γ")
      .replace(/\\Delta/g, "Δ")
      .replace(/\\Theta/g, "Θ")
      .replace(/\\Lambda/g, "Λ")
      .replace(/\\Pi/g, "Π")
      .replace(/\\Sigma/g, "Σ")
      .replace(/\\Phi/g, "Φ")
      .replace(/\\Psi/g, "Ψ")
      .replace(/\\Omega/g, "Ω")

      .replace(/\\cong/g, "≅")
      .replace(/\\approx/g, "≈")

      .replace(/\\times/g, "×")
      .replace(/\\cdot/g, "·")
      .replace(/\\div/g, "÷")

      .replace(/\\pm/g, "±")

      .replace(/\\leq/g, "≤")
      .replace(/\\le/g, "≤")

      .replace(/\\geq/g, "≥")
      .replace(/\\ge/g, "≥")

      .replace(/\\neq/g, "≠")

      .replace(/\\sim/g, "∼")

      .replace(/\\parallel/g, " || ")

      .replace(/\\perpendicular/g, "⊥")
      .replace(/\\perp/g, "⊥")

      .replace(/\\in/g, "∈")
      .replace(/\\notin/g, "∉");



  // --------------------------------------------------
  // TRIGONOMETRY
  // --------------------------------------------------

  value =
    value
      .replace(/\\tan\b/g, "tan")
      .replace(/\\theta/g, "θ")
      .replace(/\\sin\b/g, "sin")
      .replace(/\\cos\b/g, "cos")
      .replace(/\\cot\b/g, "cot")
      .replace(/\\sec\b/g, "sec")
      .replace(/\\csc\b/g, "csc");



  // --------------------------------------------------
  // TEXT COMMANDS
  // --------------------------------------------------

  value =
    value
      .replace(
        /\\text\{([^{}]*)\}/g,
        "$1"
      )

      .replace(
        /\\mathrm\{([^{}]*)\}/g,
        "$1"
      )

      .replace(
        /\\mathbf\{([^{}]*)\}/g,
        "$1"
      )

      .replace(
        /\\textbf\{([^{}]*)\}/g,
        "$1"
      )

      .replace(
        /\\textit\{([^{}]*)\}/g,
        "$1"
      );



  // --------------------------------------------------
  // ANGLES / POWERS
  // --------------------------------------------------

  value =
    value
      .replace(
        /^{([^{}]+)}/g,
        "^$1"
      )

      .replace(
        /\^\\circ/g,
        "°"
      )

      .replace(
        /\^o\b/g,
        "°"
      )

      .replace(
        /\\circ/g,
        "°"
      );



  // --------------------------------------------------
  // LATEX DELIMITERS
  // --------------------------------------------------

  value =
    value
      .replace(/\\left/g, "")
      .replace(/\\right/g, "")

      .replace(/\\\(/g, "")
      .replace(/\\\)/g, "")

      .replace(/\\\[/g, "")
      .replace(/\\\]/g, "")

      .replace(/\$\$/g, "")
      .replace(/\$/g, "")

      .replace(/\\,/g, " ")
      .replace(/\\_/g, "_")
      .replace(/\\ /g, " ");



  // --------------------------------------------------
  // CLEAN SPACING
  // --------------------------------------------------

  value =
    value
      .replace(
        /[ \t]+/g,
        " "
      )

      .replace(
        /[ \t]*\r?\n[ \t]*/g,
        "\n"
      )

      .trim();



  return value;
}



function renderMixedMathText(text = "") {

  const value =
    String(text || "");



  const mathSymbols =
    /[△⊥∥α-ωΑ-ΩθπμσφψΔΓΣΩ∠∼≅≈≠≤≥±×÷·√∞∴∵→⇒←↔∈∉°]/u;



const parts =
  value.split(
    /(r_[A-Za-z0-9]+(?:\^[A-Za-z0-9]+)?|[A-Za-z]\^[A-Za-z0-9]+|[A-Za-z]_[A-Za-z0-9]+|[△⊥∥α-ωΑ-ΩθπμσφψΔΓΣΩ∠∼≅≈≠≤≥±×÷·√∞∴∵→⇒←↔∈∉°])/u
  );


  return parts.map(
    (part, index) => {

      if (!part) {
        return null;
      }



      const subSupMatch =
        part.match(
          /^([A-Za-z])_([A-Za-z0-9]+)\^([A-Za-z0-9]+)$/
        );



      if (subSupMatch) {

        return (
          <Text
            key={"mixed-math-" + index}
          >

            <Text>
              {subSupMatch[1]}
            </Text>



            <Text
              style={{
                fontSize:6.5,
                verticalAlign:"sub"
              }}
            >
              {subSupMatch[2]}
            </Text>



            <Text
              style={{
                fontSize:6.5,
                verticalAlign:"super"
              }}
            >
              {subSupMatch[3]}
            </Text>

          </Text>
        );

      }



      const subMatch =
        part.match(
          /^([A-Za-z])_([A-Za-z0-9]+)$/
        );



      if (subMatch) {

        return (
          <Text
            key={"mixed-math-" + index}
          >

            <Text>
              {subMatch[1]}
            </Text>



            <Text
              style={{
                fontSize:6.5,
                verticalAlign:"sub"
              }}
            >
              {subMatch[2]}
            </Text>

          </Text>
        );

      }



      const supMatch =
        part.match(
          /^([A-Za-z])\^([A-Za-z0-9]+)$/
        );



      if (supMatch) {

        return (
          <Text
            key={"mixed-math-" + index}
          >

            <Text>
              {supMatch[1]}
            </Text>



            <Text
              style={{
                fontSize:6.5,
                verticalAlign:"super"
              }}
            >
              {supMatch[2]}
            </Text>

          </Text>
        );

      }



      let fontFamily =
        "NotoSans";



      if (
        /[\u0900-\u097F]/u.test(part)
      ) {

        fontFamily =
          "NotoSansDevanagari";

      }

      else if (
        part === "△"
      ) {

        fontFamily =
          "NotoSansSymbols2";

      }

      else if (
        mathSymbols.test(part)
      ) {

        fontFamily =
          "STIXTwoMath";

      }



      return (
        <Text
          key={"mixed-math-" + index}
          style={{
            fontFamily,
            fontSize:11
          }}
        >
          {part}
        </Text>
      );

    }
  );

}



function NumberBubble({
  number
}){

  const displayNumber =
    number !== undefined &&
    number !== null &&
    String(number).trim() !== ""
      ? String(number)
      : "1";

  return (
    <View
      style={{
        width:34,
        height:22,
        marginRight:8,
        flexDirection:"row",
        alignItems:"center",
        flexShrink:0
      }}
    >

      <View
        style={{
          width:3,
          height:16,
          borderRadius:2,
          backgroundColor:"#6D5DFB",
          marginRight:5,
          flexShrink:0
        }}
      />

      <Text
        style={{
          width:20,
          fontFamily:"NotoSans",
          color:"#4F46E5",
          fontSize:10,
          fontWeight:"bold",
          lineHeight:12,
          textAlign:"center",
          flexShrink:0
        }}
      >
        {displayNumber}
      </Text>

    </View>
  );

}

function parseHindiInlineMCQ(text=""){



  const value = String(text || "")

    .replace(/\s+/g," ")

    .trim();



  const firstOption = value.search(

    /([कखगघ])\s*\*\*/u

  );



  if(firstOption < 0){

    return null;

  }



  const questionText =

    value

      .slice(0,firstOption)

      .trim();



  if(!questionText){

    return null;

  }



  const optionPart =

    value.slice(firstOption);



  const matches = [

    ...optionPart.matchAll(

      /([कखगघ])\s*\*\*([\s\S]*?)(?=\s*\*\*([कखगघ])\s*\*\*|$)/gu

    )

  ];



  if(matches.length < 2){

    return null;

  }



  const options = matches

    .map(match=>({

      letter:match[1],

      text:String(match[2] || "")

        .trim()

    }))

    .filter(option=>option.text);



  if(options.length < 2){

    return null;

  }



  return {

    questionText,

    options

  };

}



function HindiMCQOption({

  letter,

  text

}){



  return (

    <View

      wrap={false}

      style={{

        flexDirection:"row",

        alignItems:"center",

        marginTop:6,

        marginLeft:28,

        padding:8,

        backgroundColor:"#F7F5FF",

        borderWidth:1,

        borderColor:"#E2D9FF",

        borderRadius:10

      }}

    >



      <View

        style={{

          width:20,

          height:20,

          borderRadius:10,

          backgroundColor:"#6D5DFB",

          justifyContent:"center",

          alignItems:"center",

          marginRight:8

        }}

      >



        <Text

          style={{

            fontFamily:"NotoSansDevanagari",

            color:"#FFFFFF",

            fontSize:9,

            fontWeight:700

          }}

        >

          {letter}

        </Text>



      </View>



      <Text

        style={{

          fontFamily:"NotoSansDevanagari",

          fontSize:pdfTheme.option.text,

          color:pdfTheme.colors.text,

          flex:1

        }}

      >

        {text}

      </Text>



    </View>

  );

}



function HindiMCQOptions({

  options=[]

}){



  const letters=[

    "क",

    "ख",

    "ग",

    "घ"

  ];



  return (

    <View

      style={{

        width:"100%",

        marginTop:2

      }}

    >



      {

        options.map(

          (option,index)=>{

            const value =

              typeof option === "object"

                ?

                String(

                  option.text ||

                  option.value ||

                  ""

                )

                :

                String(option || "");



            return (

              <HindiMCQOption

                key={"hindi-option-"+index}

                letter={

                  typeof option === "object" &&

                  option.letter

                    ?

                    option.letter

                    :

                    letters[index] ||

                    String.fromCharCode(97 + index)

                }

                text={value.trim()}

              />

            );

          }

        )

      }



    </View>

  );

}



export default function PDFQuestion({



  number,



  question = {},



  isInstruction = false



}){

const resolvedNumber =
  Number(number) ||
  Number(question?.number) ||
  1;

  console.log(

    "NYXORA DIAGRAM DEBUG:",

    number,

    question.diagram

  );



  const rawQuestionText =

    String(question.text || "");



  const inlineHindiMCQ =

    parseHindiInlineMCQ(

      rawQuestionText

    );



  const separateHindiOptions =

    Array.isArray(question.options)

      ?

      question.options

      :

      [];



  const looksLikeHindiMCQ =

    question.isHindiMCQ === true

    ||

    inlineHindiMCQ !== null

    ||

    (

      /^प्र(?:श्न)?\s*\d+\s*[.)]/u.test(

        rawQuestionText.trim()

      )

      &&

      separateHindiOptions.length >= 2

      &&

      /([कखगघ])/u.test(

        separateHindiOptions

          .map(option=>

            typeof option === "object"

              ?

              String(

                option.text ||

                option.value ||

                ""

              )

              :

              String(option || "")

          )

          .join(" ")

      )

    );



  if(looksLikeHindiMCQ && !isInstruction){



    const hindiQuestionText =

      inlineHindiMCQ

        ?

        inlineHindiMCQ.questionText

        :

        rawQuestionText;



    const hindiOptions =

      inlineHindiMCQ

        ?

        inlineHindiMCQ.options

        :

        separateHindiOptions;



    return (

      <View

       style={{

          marginBottom:12,

          width:"100%"

        }}

      >



        <View

          wrap={false}

          style={{

            width:"100%",

            paddingVertical:8,

            paddingHorizontal:10,

            borderRadius:12,

            backgroundColor:"#F5F1FF",

            borderWidth:1,

            borderColor:"#D8CCFF",

            flexDirection:"row",

            alignItems:"flex-start",

            marginBottom:6

          }}

        >



        <View
  style={{
    width:3,
    height:16,
    borderRadius:2,
    backgroundColor:"#6D5DFB",
    marginRight:5,
    flexShrink:0
  }}
/>

<View
  style={{
    width:22,
    height:22,
    marginRight:8,
    justifyContent:"center",
    alignItems:"center",
    flexShrink:0
  }}
>
  <Text
    style={{
      fontFamily:"NotoSans",
      fontSize:10,
      fontWeight:"bold",
      color:"#4F46E5",
      lineHeight:12,
      textAlign:"center",
      flexShrink:0
    }}
  >
    {resolvedNumber}
  </Text>
</View>

          <Text

            style={{

              flex:1,

              fontFamily:"NotoSansDevanagari",

              fontSize:11,

              lineHeight:1.4,

              color:"#161C48"

            }}

          >

            {

              renderMixedMathText(

                cleanAnswerKeyText(

                  hindiQuestionText

                )

              )

            }



            {

              question.math &&

              <MathExpression

                value={question.math}

              />

            }



          </Text>



        </View>



        <HindiMCQOptions

          options={hindiOptions}

        />



      </View>

    );

  }



  return (

    <View
      
        
      style={{

        marginBottom:12

      }}

    >



      <View

        wrap={false}

        style={{

          flexDirection:"row",

          alignItems:"flex-start"

        }}

      >


<View
  style={{
    width:3,
    height:16,
    borderRadius:2,
    backgroundColor:"#6D5DFB",
    marginRight:5,
    flexShrink:0
  }}
/>

<View
  style={{
    width:22,
    height:22,
    marginRight:8,
    justifyContent:"center",
    alignItems:"center",
    flexShrink:0
  }}
>
  <Text
    style={{
      fontFamily:"NotoSans",
      fontSize:10,
      fontWeight:"bold",
      color:"#4F46E5",
      lineHeight:12,
      textAlign:"center",
      flexShrink:0
    }}
  >
    {resolvedNumber}
  </Text>
</View>

        <Text

          style={{

            flex:1,

            fontFamily:"NotoSansDevanagari",

            fontSize:11,

            color:"#161C48"

          }}

        >

          {

            renderMixedMathText(

              cleanAnswerKeyText(

                question.text

              )

            )

          }



          {

            question.math &&

            <MathExpression

              value={question.math}

            />

          }



        </Text>



      </View>



      {

        !isInstruction &&

        question.diagram &&

        (

          <View
    style={{
        width:"100%",
        marginTop:4,
        marginBottom:6,
        alignItems:"center",
        justifyContent:"center"
    }}
>
    <MathDiagram
        {...question.diagram}

        width={
            Number(question.diagram?.width) > 0
                ? Math.min(
                    Number(question.diagram.width),
                    500
                )
                : 500
        }

        height={
            Number(question.diagram?.height) > 0
                ? Math.min(
                    Number(question.diagram.height),
                    240
                )
                : 240
        }
    />
</View>

        )

      }



      {

        !isInstruction &&

        <View

          wrap={false}

          style={{

            marginTop:6

          }}

        >



          {

            (question.options || [])

              .map(

                (option,index)=>(



                  <PDFOption

                    key={index}

                    option={option}

                    index={index}

                  />



                )

              )

          }



        </View>

      }



    </View>

  );

}