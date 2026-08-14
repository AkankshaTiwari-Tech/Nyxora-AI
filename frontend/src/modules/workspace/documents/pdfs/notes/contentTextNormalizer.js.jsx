/*
 * Nyxora shared content normalizer
 *
 * Two independent pipelines:
 *
 * 1) normalizeLatexText()
 *    Converts higher-study LaTeX / TeX math into PDF-safe text.
 *
 * 2) cleanCodeText()
 *    Cleans Markdown/code-fence noise around source code while preserving
 *    the actual programming syntax. It does NOT translate or rewrite code.
 *
 * 3) normalizeContentText()
 *    Safe entry point for ordinary note text. It performs LaTeX cleanup,
 *    but does not aggressively modify arbitrary programming code.
 */

const GREEK = {
    "\\alpha":"α", "\\beta":"β", "\\gamma":"γ", "\\delta":"δ",
    "\\epsilon":"ε", "\\varepsilon":"ϵ", "\\zeta":"ζ", "\\eta":"η",
    "\\theta":"θ", "\\vartheta":"ϑ", "\\iota":"ι", "\\kappa":"κ",
    "\\lambda":"λ", "\\mu":"μ", "\\nu":"ν", "\\xi":"ξ",
    "\\omicron":"ο", "\\pi":"π", "\\varpi":"ϖ", "\\rho":"ρ",
    "\\varrho":"ϱ", "\\sigma":"σ", "\\varsigma":"ς", "\\tau":"τ",
    "\\upsilon":"υ", "\\phi":"φ", "\\varphi":"ϕ", "\\chi":"χ",
    "\\psi":"ψ", "\\omega":"ω",
    "\\Gamma":"Γ", "\\Delta":"Δ", "\\Theta":"Θ", "\\Lambda":"Λ",
    "\\Xi":"Ξ", "\\Pi":"Π", "\\Sigma":"Σ", "\\Upsilon":"Υ",
    "\\Phi":"Φ", "\\Psi":"Ψ", "\\Omega":"Ω"
};

const SYMBOLS = {
    "\\infty":"∞", "\\partial":"∂", "\\nabla":"∇",
    "\\sum":"∑", "\\prod":"∏", "\\coprod":"∐",
    "\\int":"∫", "\\iint":"∬", "\\iiint":"∭", "\\oint":"∮",
    "\\bigcup":"⋃", "\\bigcap":"⋂", "\\cup":"∪", "\\cap":"∩",
    "\\subset":"⊂", "\\subseteq":"⊆", "\\supset":"⊃",
    "\\supseteq":"⊇", "\\nsubseteq":"⊄",
    "\\in":"∈", "\\notin":"∉", "\\ni":"∋",
    "\\emptyset":"∅", "\\varnothing":"∅",
    "\\forall":"∀", "\\exists":"∃", "\\nexists":"∄",
    "\\therefore":"∴", "\\because":"∵", "\\propto":"∝",
    "\\parallel":"∥", "\\perp":"⊥", "\\angle":"∠",
    "\\triangle":"△", "\\square":"□",
    "\\cong":"≅", "\\approx":"≈", "\\sim":"∼", "\\simeq":"≃",
    "\\equiv":"≡", "\\ne":"≠", "\\neq":"≠",
    "\\le":"≤", "\\leq":"≤", "\\ge":"≥", "\\geq":"≥",
    "\\ll":"≪", "\\gg":"≫",
    "\\pm":"±", "\\mp":"∓", "\\times":"×", "\\cdot":"·",
    "\\ast":"∗", "\\star":"⋆", "\\circ":"∘", "\\bullet":"•",
    "\\oplus":"⊕", "\\ominus":"⊖", "\\otimes":"⊗",
    "\\oslash":"⊘", "\\odot":"⊙",
    "\\wedge":"∧", "\\vee":"∨", "\\neg":"¬", "\\lnot":"¬",
    "\\to":"→", "\\rightarrow":"→", "\\leftarrow":"←",
    "\\leftrightarrow":"↔", "\\Rightarrow":"⇒",
    "\\Longrightarrow":"⟹", "\\Leftarrow":"⇐",
    "\\Longleftarrow":"⟸", "\\Leftrightarrow":"⇔",
    "\\Longleftrightarrow":"⟺", "\\mapsto":"↦",
    "\\hookrightarrow":"↪", "\\hookleftarrow":"↩",
    "\\uparrow":"↑", "\\downarrow":"↓", "\\updownarrow":"↕",
    "\\implies":"⇒", "\\iff":"⇔", "\\vdash":"⊢", "\\models":"⊨",
    "\\ldots":"…", "\\cdots":"⋯", "\\vdots":"⋮", "\\ddots":"⋱",
    "\\dots":"…",
    "\\prime":"′", "\\dprime":"″", "\\degree":"°", "\\div":"÷"
    
};

const EXTRA_SYMBOLS = {

    "\\rightarrowtail":"↠",
};

const LETTER_SETS = {
    "\\mathbb{N}":"ℕ", "\\mathbb{Z}":"ℤ", "\\mathbb{Q}":"ℚ",
    "\\mathbb{R}":"ℝ", "\\mathbb{C}":"ℂ", "\\mathbb{H}":"ℍ",
    "\\mathbb{P}":"ℙ", "\\mathbb{F}":"𝔽", "\\mathbb{B}":"𝔹",
    "\\mathbb{E}":"𝔼", "\\mathbb{T}":"𝕋"
};

const SUPER = {
    "0":"⁰","1":"¹","2":"²","3":"³","4":"⁴","5":"⁵",
    "6":"⁶","7":"⁷","8":"⁸","9":"⁹","+":"⁺","-":"⁻",
    "=":"⁼","(":"⁽",")":"⁾","n":"ⁿ","i":"ⁱ","x":"ˣ",
    "y":"ʸ","k":"ᵏ","a":"ᵃ","b":"ᵇ","c":"ᶜ","d":"ᵈ",
    "e":"ᵉ","f":"ᶠ","g":"ᵍ","h":"ʰ","j":"ʲ","l":"ˡ",
    "m":"ᵐ","o":"ᵒ","p":"ᵖ","r":"ʳ","s":"ˢ","t":"ᵗ",
    "u":"ᵘ","v":"ᵛ","w":"ʷ","z":"ᶻ"
};

const SUB = {
    "0":"₀","1":"₁","2":"₂","3":"₃","4":"₄","5":"₅",
    "6":"₆","7":"₇","8":"₈","9":"₉","+":"₊","-":"₋",
    "=":"₌","(":"₍",")":"₎","a":"ₐ","e":"ₑ","h":"ₕ",
    "i":"ᵢ","j":"ⱼ","k":"ₖ","l":"ₗ","m":"ₘ","n":"ₙ",
    "o":"ₒ","p":"ₚ","r":"ᵣ","s":"ₛ","t":"ₜ","u":"ᵤ",
    "v":"ᵥ","x":"ₓ"
};

const CODE_LANGUAGES = new Set([
    "js","javascript","mjs","cjs","jsx",
    "ts","typescript","tsx",
    "py","python",
    "java",
    "c","h",
    "cpp","c++","cc","cxx","hpp",
    "cs","csharp",
    "go","golang",
    "rs","rust",
    "php",
    "rb","ruby",
    "swift",
    "kt","kts","kotlin",
    "dart",
    "r",
    "sql",
    "bash","sh","shell","zsh","fish",
    "ps1","powershell",
    "html","htm","xml","xhtml",
    "css","scss","sass","less",
    "json",
    "yaml","yml",
    "toml",
    "ini",
    "dockerfile",
    "makefile",
    "graphql","gql",
    "lua",
    "perl","pl",
    "scala",
    "groovy",
    "vb","vbs",
    "matlab",
    "asm","assembly",
    "sol","solidity",
    "ex","elixir",
    "exs",
    "clj","clojure",
    "fs","fsharp",
    "hs","haskell",
    "jl","julia"
]);

function stripOuterBraces(value) {
    return String(value || "")
        .replace(/^\{([\s\S]*)\}$/u, "$1");
}

function convertSuperScript(value) {
    return String(value || "")
        .split("")
        .map(ch => SUPER[ch] || ch)
        .join("");
}

function convertSubScript(value) {
    return String(value || "")
        .split("")
        .map(ch => SUB[ch] || ch)
        .join("");
}

function readBalancedGroup(text, openIndex) {
    if (text[openIndex] !== "{") {
        return null;
    }

    let depth = 0;

    for (let i = openIndex; i < text.length; i++) {
        if (text[i] === "{") {
            depth++;
        } else if (text[i] === "}") {
            depth--;
            if (depth === 0) {
                return {
                    content: text.slice(openIndex + 1, i),
                    endIndex: i + 1
                };
            }
        }
    }

    return null;
}

function replaceBalancedCommand(text, command, replacer) {
    let result = String(text || "");
    let searchFrom = 0;
    const token = `\\${command}`;

    while (true) {
        const index = result.indexOf(token, searchFrom);

        if (index < 0) {
            break;
        }

        let cursor = index + token.length;

        while (result[cursor] === " ") {
            cursor++;
        }

        if (result[cursor] !== "{") {
            searchFrom = cursor + 1;
            continue;
        }

        const group = readBalancedGroup(
            result,
            cursor
        );

        if (!group) {
            break;
        }

        const replacement = replacer(
            group.content
        );

        result =
            result.slice(0, index) +
            replacement +
            result.slice(group.endIndex);

        searchFrom =
            index +
            replacement.length;
    }

    return result;
}

function replaceTwoBalancedCommand(text, command, replacer) {
    let result = String(text || "");
    let searchFrom = 0;
    const token = `\\${command}`;

    while (true) {
        const index = result.indexOf(token, searchFrom);

        if (index < 0) {
            break;
        }

        let cursor = index + token.length;

        while (result[cursor] === " ") {
            cursor++;
        }

        if (result[cursor] !== "{") {
            searchFrom = cursor + 1;
            continue;
        }

        const first = readBalancedGroup(
            result,
            cursor
        );

        if (!first) {
            break;
        }

        cursor = first.endIndex;

        while (result[cursor] === " ") {
            cursor++;
        }

        if (result[cursor] !== "{") {
            searchFrom = first.endIndex;
            continue;
        }

        const second = readBalancedGroup(
            result,
            cursor
        );

        if (!second) {
            break;
        }

        const replacement =
            replacer(
                first.content,
                second.content
            );

        result =
            result.slice(0, index) +
            replacement +
            result.slice(second.endIndex);

        searchFrom =
            index +
            replacement.length;
    }

    return result;
}

function normalizeChemicalFormula(value) {
    return String(value || "")
        .replace(/\\rightarrow/g, "→")
        .replace(/\\to/g, "→")
        .replace(/\\rightleftharpoons/g, "⇌")
        .replace(/\\leftrightharpoons/g, "⇌")
        .replace(/\\uparrow/g, "↑")
        .replace(/\\downarrow/g, "↓")
        .replace(/\^\{([^{}]+)\}/g, (_, x) =>
            convertSuperScript(x)
        )
        .replace(/\^([A-Za-z0-9+\-=()]+)/g, (_, x) =>
            convertSuperScript(x)
        )
        .replace(/_\{([^{}]+)\}/g, (_, x) =>
            convertSubScript(x)
        )
        .replace(/_([A-Za-z0-9+\-=()]+)/g, (_, x) =>
            convertSubScript(x)
        );
}

function normalizeMatrices(value) {
    let result = String(value || "");

    [
        "matrix","pmatrix","bmatrix","Bmatrix",
        "vmatrix","Vmatrix","cases"
    ].forEach(env => {

        const pattern =
            new RegExp(
                `\\\\begin\\{${env}\\}([\\s\\S]*?)\\\\end\\{${env}\\}`,
                "g"
            );

        result =
            result.replace(
                pattern,
                (_, body) => {

                    const rows =
                        String(body || "")
                            .split(/\\\\/u)
                            .map(row =>
                                row
                                    .replace(/\s+/g, " ")
                                    .trim()
                            )
                            .filter(Boolean);

                    const normalizedRows =
                        rows.map(row =>
                            row
                                .split("&")
                                .map(cell =>
                                    normalizeLatexText(cell)
                                )
                                .join("  ")
                        );

                    return `[ ${normalizedRows.join(" ; ")} ]`;
                }
            );
    });

    return result;
}

function normalizeLatexText(value = "") {

    if(
        value === null ||
        value === undefined
    ){
        return "";
    }

    if(
        typeof value === "object"
    ){
        return normalizeLatexText(
            JSON.stringify(value)
        );
    }

    let text =
        String(value);

    /*
     * Strip fenced-code wrappers only when they are actually present.
     */
    text =
        text.replace(
            /```(?:[A-Za-z0-9_+#.-]+)?\n([\s\S]*?)```/g,
            "$1"
        );

    /*
     * Math delimiters:
     *   $$ ... $$
     *   $ ... $
     *   \( ... \)
     *   \[ ... \]
     *
     * The regexes below are intentionally written as normal JS regex
     * literals so Vite/OXC cannot mis-parse the escaping.
     */
    text =
        text.replace(
            /\$\$([\s\S]*?)\$\$/g,
            function(_, content){
                return normalizeLatexText(content);
            }
        );

    text =
        text.replace(
            /\$([^$\n]+)\$/g,
            function(_, content){
                return normalizeLatexText(content);
            }
        );

    text =
        text.replace(
            /\\\(([\s\S]*?)\\\)/g,
            function(_, content){
                return normalizeLatexText(content);
            }
        );

    text =
        text.replace(
            /\\\[([\s\S]*?)\\\]/g,
            function(_, content){
                return normalizeLatexText(content);
            }
        );

    text =
        normalizeMatrices(text);

    text =
        text.replace(
            /\\ce\{([\s\S]*?)\}/g,
            function(_, content){
                return normalizeChemicalFormula(
                    content
                );
            }
        );

    text =
        text.replace(
            /\\x(rightarrow|leftarrow|leftrightarrow|Rightarrow|Leftarrow|Leftrightarrow)\s*(?:\[([\s\S]*?)\])?\s*\{([\s\S]*?)\}/gu,
            function(_, command, below, above){

                const arrows = {
                    rightarrow: "→",
                    leftarrow: "←",
                    leftrightarrow: "↔",
                    Rightarrow: "⇒",
                    Leftarrow: "⇐",
                    Leftrightarrow: "⇔"
                };

                const upper =
                    normalizeLatexText(
                        above || ""
                    ).trim();

                const lower =
                    normalizeLatexText(
                        below || ""
                    ).trim();

                if (
                    lower &&
                    upper
                ) {

                    return (
                        " " +
                        arrows[command] +
                        " " +
                        upper +
                        " (" +
                        lower +
                        ") "
                    );

                }

                return (
                    " " +
                    arrows[command] +
                    " " +
                    upper +
                    " "
                );

            }
        );

    text =
        replaceTwoBalancedCommand(
            text,
            "frac",
            function(numerator, denominator){
                return (
                    "(" +
                    normalizeLatexText(numerator) +
                    ")/(" +
                    normalizeLatexText(denominator) +
                    ")"
                );
            }
        );

    text =
        replaceTwoBalancedCommand(
            text,
            "dfrac",
            function(numerator, denominator){
                return (
                    "(" +
                    normalizeLatexText(numerator) +
                    ")/(" +
                    normalizeLatexText(denominator) +
                    ")"
                );
            }
        );

    text =
        replaceTwoBalancedCommand(
            text,
            "tfrac",
            function(numerator, denominator){
                return (
                    "(" +
                    normalizeLatexText(numerator) +
                    ")/(" +
                    normalizeLatexText(denominator) +
                    ")"
                );
            }
        );

    [
        ["sqrt", function(value){
            return (
                "√(" +
                normalizeLatexText(value) +
                ")"
            );
        }],
        ["cbrt", function(value){
            return (
                "∛(" +
                normalizeLatexText(value) +
                ")"
            );
        }],
        ["text", stripOuterBraces],
        ["textbf", stripOuterBraces],
        ["textit", stripOuterBraces],
        ["textrm", stripOuterBraces],
        ["mathrm", stripOuterBraces],
        ["mathbf", stripOuterBraces],
        ["mathit", stripOuterBraces],
        ["mathsf", stripOuterBraces],
        ["mathtt", stripOuterBraces],
        ["mathcal", stripOuterBraces],
        ["mathfrak", stripOuterBraces],
        ["mathbb", function(value){

            const key =
                "\\mathbb{" +
                stripOuterBraces(value) +
                "}";

            return (
                LETTER_SETS[key] ||
                stripOuterBraces(value)
            );

        }],
        ["operatorname", stripOuterBraces]
    ].forEach(
        function(entry){

            const command =
                entry[0];

            const replacer =
                entry[1];

            text =
                replaceBalancedCommand(
                    text,
                    command,
                    replacer
                );

        }
    );

    text =
        text
            .replace(/\\left(?![A-Za-z])/g, "")
            .replace(/\\right(?![A-Za-z])/g, "")
            .replace(/\\bigl(?![A-Za-z])/g, "")
            .replace(/\\bigr(?![A-Za-z])/g, "")
            .replace(/\\Bigl(?![A-Za-z])/g, "")
            .replace(/\\Bigr(?![A-Za-z])/g, "");

    Object.entries(
        LETTER_SETS
    ).forEach(
        function(entry){

            text =
                text.split(
                    entry[0]
                ).join(
                    entry[1]
                );

        }
    );

    Object.entries(
        GREEK
    ).forEach(
        function(entry){

            text =
                text.split(
                    entry[0]
                ).join(
                    entry[1]
                );

        }
    );

    Object.entries(
        SYMBOLS
    )
        .sort(
            function(a,b){
                return b[0].length - a[0].length;
            }
        )
        .forEach(
            function(entry){

                text =
                    text.split(
                        entry[0]
                    ).join(
                        entry[1]
                    );

            }
        );

    /*
     * Common higher-study symbols/operators not covered above.
     */
    const EXTRA_SYMBOLS = {
        "\\rightarrowtail":"↠",
        "\\twoheadrightarrow":"↠",
        "\\leftharpoonup":"↼",
        "\\rightharpoonup":"⇀",
        "\\leftharpoondown":"↽",
        "\\rightharpoondown":"⇁",
        "\\rightleftharpoons":"⇌",
        "\\leftrightharpoons":"⇌",
        "\\leftrightarrows":"⇆",
        "\\rightleftarrows":"⇄",
        "\\sphericalangle":"∢",
        "\\measuredangle":"∡",
        "\\Re":"ℜ",
        "\\Im":"ℑ",
        "\\wp":"℘",
        "\\ell":"ℓ",
        "\\hbar":"ℏ"
    };

    Object.entries(
        EXTRA_SYMBOLS
    ).forEach(
        function(entry){

            text =
                text.split(
                    entry[0]
                ).join(
                    entry[1]
                );

        }
    );

    text =
        text
            .replace(
                /\\,|\\;|\\:|\\!/g,
                " "
            )
            .replace(
                /\\quad|\\qquad/g,
                "  "
            )
            .replace(
                /\\textstyle|\\displaystyle|\\scriptstyle|\\scriptscriptstyle/g,
                ""
            )
            .replace(
                /\\limits|\\nolimits/g,
                ""
            )
            .replace(
                /\\_/g,
                "_"
            )
            .replace(
                /\\ /g,
                " "
            );

    /*
     * Powers and subscripts.
     */
    text =
        text
            .replace(
                /\^\{([^{}]+)\}/g,
                function(_, x){
                    return convertSuperScript(
                        normalizeLatexText(x)
                    );
                }
            )
            .replace(
                /_\{([^{}]+)\}/g,
                function(_, x){
                    return convertSubScript(
                        normalizeLatexText(x)
                    );
                }
            )
            .replace(
                /_([A-Za-z0-9+\-=()]+)/g,
                function(_, x){
                    return convertSubScript(x);
                }
            )
            .replace(
                /\^([A-Za-z0-9+\-=()]+)/g,
                function(_, x){
                    return convertSuperScript(x);
                }
            );

    return text
        .replace(/\r\n/g, "\n")
        .replace(/[ \t]+\n/g, "\n")
        .replace(/\n[ \t]+/g, "\n")
        .trim();

}


function looksLikeCodeFence(value = "") {
    return /^```([A-Za-z0-9_+#.-]+)?\s*[\r\n]/u.test(
        String(value || "").trim()
    );
}

function extractCodeFence(value = "") {

    const text =
        String(value || "")
            .replace(/\r\n/g, "\n")
            .trim();

    const match =
        text.match(
            /^```([A-Za-z0-9_+#.-]+)?\n([\s\S]*?)```$/u
        );

    if (!match) {
        return {
            language:"",
            code:text,
            fenced:false
        };
    }

    return {
        language:
            String(match[1] || "")
                .trim()
                .toLowerCase(),
        code:match[2] || "",
        fenced:true
    };
}

function cleanCodeText(value = "", language = "") {

    if (
        value === null ||
        value === undefined
    ) {
        return "";
    }

    if (
        typeof value === "object"
    ) {
        return cleanCodeText(
            JSON.stringify(value),
            language
        );
    }

    const extracted =
        extractCodeFence(
            value
        );

    const lang =
        String(
            language ||
            extracted.language ||
            ""
        )
            .trim()
            .toLowerCase();

    let code =
        String(extracted.code || "")
            .replace(/\r\n/g, "\n")
            .replace(/\r/g, "\n")
            .replace(/\u00A0/g, " ");

    /*
     * Markdown noise surrounding code.
     */
    code =
        code
            .replace(/^\s*```[A-Za-z0-9_+#.-]*\s*$/gm, "")
            .replace(/^\s*```\s*$/gm, "")
            .replace(/^\s*~~~[A-Za-z0-9_+#.-]*\s*$/gm, "")
            .replace(/^\s*~~~\s*$/gm, "");

    /*
     * Remove accidental "Copy code" / language-only labels that sometimes
     * appear when AI output is copied into a note, but only when they form
     * an isolated first line.
     */
    code =
        code.replace(
            /^(?:copy\s+code|code|source\s+code)\s*[\r\n]+/iu,
            ""
        );

    /*
     * Normalize tabs only; do not collapse internal spaces because spaces
     * are syntax in Python/YAML and can affect readability in other code.
     */
    code =
        code
            .split("\n")
            .map(line =>
                line
                    .replace(/\t/g, "    ")
                    .replace(/[ \t]+$/g, "")
            )
            .join("\n");

    /*
     * Remove common Markdown quote/list wrappers only when they wrap the
     * entire source line. Actual operators/indentation remain untouched.
     */
    code =
        code
            .split("\n")
            .map(line =>
                line.replace(
                    /^(\s*)>\s?/,
                    "$1"
                )
            )
            .join("\n");

    /*
     * Language-specific, presentation-safe cleanup.
     * We deliberately DO NOT reformat syntax because that could change
     * semantics or accidentally damage valid source code.
     */
    if (
        CODE_LANGUAGES.has(lang)
    ) {

        if (
            [
                "json","yaml","yml","toml",
                "ini","xml","html","htm",
                "css","scss","sass","less"
            ].includes(lang)
        ) {
            code =
                code.trim();
        }

        if (
            [
                "sql"
            ].includes(lang)
        ) {
            code =
                code
                    .replace(
                        /^\s*--\s*sql\s*$/im,
                        ""
                    )
                    .trim();
        }

        if (
            [
                "bash","sh","shell",
                "zsh","fish","ps1","powershell"
            ].includes(lang)
        ) {
            code =
                code.trim();
        }

    }

    return code.trim();
}

function normalizeContentText(value = "") {

    return normalizeLatexText(
        String(value || "")
            .replace(/\r\n/g, "\n")
            .replace(/\r/g, "\n")
    );

}

export {
    normalizeLatexText,
    cleanCodeText,
    normalizeContentText,
    looksLikeCodeFence,
    extractCodeFence
};

export default normalizeContentText;