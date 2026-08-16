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


import {
    searchNotesImages,
}
from "../../../../../services/notesImageService";


// ======================================================
// EXTRACT NOTES IMAGE TOPICS
// ======================================================

function getNotesImageTopics(
    value = ""
) {

    const source =
        String(
            value || ""
        )
            .replace(
                /\r/g,
                ""
            )
            .trim();


    if (
        !source
    ) {

        return [];

    }


    const topics =
        [];


    const addTopic =
        (
            topic
        ) => {

            const cleanTopic =
                String(
                    topic || ""
                )
                    .replace(
                        /\s+/g,
                        " "
                    )
                    .trim()
                    .replace(
                        /^[#*\-\d.)\s]+/,
                        ""
                    )
                    .replace(
                        /[:：]\s*$/,
                        ""
                    )
                    .trim()
                    .slice(
                        0,
                        100
                    );


            if (
                !cleanTopic
            ) {

                return;

            }


            if (
                /^(?:introduction|conclusion|summary|revision|references|contents|index|overview)$/iu.test(
                    cleanTopic
                )
            ) {

                return;

            }


            if (
                cleanTopic.split(
                    /\s+/
                ).length >
                10
            ) {

                return;

            }


            const exists =
                topics.some(
                    (
                        existing
                    ) =>
                        existing.toLowerCase() ===
                        cleanTopic.toLowerCase()
                );


            if (
                !exists
            ) {

                topics.push(
                    cleanTopic
                );

            }

        };


    const lines =
        source.split(
            "\n"
        );


    lines.forEach(
        (
            rawLine
        ) => {

            const line =
                String(
                    rawLine || ""
                ).trim();


            if (
                !line
            ) {

                return;

            }


            // Markdown headings.

            const markdownHeading =
                line.match(
                    /^#{1,6}\s+(.+?)\s*$/u
                );


            if (
                markdownHeading
            ) {

                addTopic(
                    markdownHeading[1]
                );

                return;

            }


            // Numbered headings.

            const numberedHeading =
                line.match(
                    /^\d+\s*[.)-]\s+(.+?)\s*$/u
                );


            if (
                numberedHeading
            ) {

                const candidate =
                    numberedHeading[1]
                        .replace(
                            /\s*:+\s*$/,
                            ""
                        )
                        .trim();


                if (
                    candidate &&
                    candidate.split(
                        /\s+/
                    ).length <=
                    10 &&
                    !/[.!?]$/u.test(
                        candidate
                    )
                ) {

                    addTopic(
                        candidate
                    );

                }


                return;

            }


            // Bold standalone headings.

            const boldHeading =
                line.match(
                    /^\*{1,2}([^*]+?)\*{1,2}\s*:?\s*$/u
                );


            if (
                boldHeading
            ) {

                addTopic(
                    boldHeading[1]
                );

                return;

            }


            // Standalone colon headings.

            const colonHeading =
                line.match(
                    /^([A-Za-z\u0900-\u097F][A-Za-z0-9\u0900-\u097F &()\/,+\-]{2,80})\s*:\s*$/u
                );


            if (
                colonHeading
            ) {

                addTopic(
                    colonHeading[1]
                );

            }

        }
    );


    return topics.slice(
        0,
        5
    );

}


// ======================================================
// PREPARE WORKSPACE PDF DATA
//
// Workspace documents store the image-request metadata,
// but images themselves are fetched when the PDF is
// generated.
//
// This keeps Base64 images out of Firestore.
// ======================================================

async function prepareWorkspacePdfData(
    data = {}
) {

    const pdfData =
        {
            ...data
        };


    const content =
        String(
            data.content || ""
        ).trim();


    const isNotesDocument =
        /notes|नोट्स/iu.test(
            String(
                data.type || ""
            )
        ) ||
        /notes|नोट्स/iu.test(
            content
        );


    const shouldFetchImages =
        isNotesDocument &&
        (
            Boolean(
                data.notesImageRequested
            ) ||
            Boolean(
                String(
                    data.notesImageTopic ||
                    ""
                ).trim()
            )
        );


    if (
        !shouldFetchImages
    ) {

        return pdfData;

    }


    try {

        const imageTopics =
            getNotesImageTopics(
                content
            );


        const fallbackTopic =
            String(
                data.notesImageTopic ||
                data.chapter ||
                data.subject ||
                data.title ||
                ""
            )
                .trim()
                .replace(
                    /\s+/g,
                    " "
                )
                .slice(
                    0,
                    120
                );


        const resolvedImageTopics =
            imageTopics.length > 0
                ? imageTopics
                : (
                    fallbackTopic
                        ? [
                            fallbackTopic
                        ]
                        : []
                );


        console.log(
            "🖼️ Workspace PDF image topics:",
            resolvedImageTopics
        );


        if (
            resolvedImageTopics.length ===
            0
        ) {

            return pdfData;

        }


        const notesImages =
            await searchNotesImages(
                resolvedImageTopics
            );


        console.log(
            "🖼️ Workspace PDF images received:",
            notesImages
        );


        if (
            Array.isArray(
                notesImages
            ) &&
            notesImages.length >
            0
        ) {

            return {

                ...pdfData,

                notesImages,

                // Preserve single-image compatibility.

                notesImage:
                    notesImages[0],

            };

        }

    }
    catch (
        error
    ) {

        console.error(
            "❌ Workspace PDF Notes image fetch failed:",
            error
        );

    }


    return pdfData;

}


// ======================================================
// CREATE PDF BLOB
// ======================================================

async function createPdfBlob(
    data = {}
) {

    const preparedData =
        await prepareWorkspacePdfData(
            data
        );


    const documentElement =
        createElement(
            NyxoraPDF,
            {
                data:
                    preparedData
            }
        );


    const instance =
        pdf(
            documentElement
        );


    const blob =
        await instance.toBlob();


    return blob;

}


// ======================================================
// GENERATE WORKSPACE PDF
// ======================================================

export async function generateWorkspacePdf(

    data = {}

) {


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


// ======================================================
// CREATE WORKSPACE PDF URL
// ======================================================

export async function createWorkspacePdfUrl(

    data = {}

) {


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


// ======================================================
// DOWNLOAD WORKSPACE PDF
// ======================================================

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