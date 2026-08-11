import {

    View,

    Text

}

from "@react-pdf/renderer";


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

        const start =

            result.indexOf(

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



        if (

            command === "frac" ||

            command === "dfrac"

        ) {

            let denominatorStart =

                closeBrace + 1;



            while (

                denominatorStart < result.length &&

                /\s/.test(

                    result[denominatorStart]

                )

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

                if (

                    result[i] === "{"

                ) {

                    denominatorDepth++;

                }

                else if (

                    result[i] === "}"

                ) {

                    denominatorDepth--;



                    if (

                        denominatorDepth === 0

                    ) {

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

                result.slice(

                    0,

                    start

                ) +

                replacement +

                result.slice(

                    denominatorEnd + 1

                );



            searchFrom =

                start +

                replacement.length;



            continue;

        }



        const replacement =

            replacer(content);



        result =

            result.slice(

                0,

                start

            ) +

            replacement +

            result.slice(

                closeBrace + 1

            );



        searchFrom =

            start +

            replacement.length;

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

                        fontSize:pdfTheme.option.text

                    }}

                >

                    {part}

                </Text>

            );

        }

    );

}



export default function PDFOption({



    option,



    index = 0



}){



    const value =

        String(option || "")

        .trim();



    let label =

        String.fromCharCode(

            65 + index

        );



    let text = value;



    const match =

        value.match(

            /^(?:\*\*([a-dA-D])\*\*[.)]|([a-dA-D])[\.)])\s*(.*)/

        );



    if(match){



        label =

            (match[1] || match[2])

            .toUpperCase();



        text =

            match[3];

    }



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

                    {label}

                </Text>



            </View>



            <Text

                style={{

                    fontFamily:"NotoSansDevanagari",

                    fontSize:

                        pdfTheme.option.text,

                    color:

                        pdfTheme.colors.text

                }}

            >

                {

                    renderMixedMathText(

                        cleanAnswerKeyText(

                            text

                        )

                    )

                }



            </Text>



        </View>

    );

}