import React from "react";

import {
    pdf,
} from "@react-pdf/renderer";

import HindiQuestionTestPDF
    from "./renderer/HindiQuestionTestPDF";



function createFileName(
    title = ""
) {

    const cleaned =
        String(title || "")
            .trim()
            .replace(
                /[<>:"/\\|?*]+/g,
                ""
            )
            .replace(
                /\s+/g,
                "-"
            )
            .toLowerCase();



    return (
        cleaned ||
        "nyxora-hindi-test"
    ) + ".pdf";

}



function createHindiTestDocument(
    documentData = {}
) {

    return (
        <HindiQuestionTestPDF
            data={{
                ...documentData,

                title:
                    documentData.title ||
                    "Nyxora Hindi Test",

                type:
                    documentData.type ||
                    "Test",

                subject:
                    documentData.subject ||
                    "",

                chapter:
                    documentData.chapter ||
                    "",

                content:
                    documentData.content ||
                    "",
            }}
        />
    );

}



export async function createHindiQuestionTestPdfBlob(
    documentData = {}
) {

    const document =
        createHindiTestDocument(
            documentData
        );



    const blob =
        await pdf(
            document
        ).toBlob();



    return blob;

}



export async function createHindiQuestionTestPdfUrl(
    documentData = {}
) {

    const blob =
        await createHindiQuestionTestPdfBlob(
            documentData
        );



    return URL.createObjectURL(
        blob
    );

}



export async function downloadHindiQuestionTestPdf(
    documentData = {}
) {

    const blob =
        await createHindiQuestionTestPdfBlob(
            documentData
        );



    const url =
        URL.createObjectURL(
            blob
        );



    const anchor =
        document.createElement(
            "a"
        );



    anchor.href =
        url;



    anchor.download =
        createFileName(
            documentData?.title
        );



    document.body.appendChild(
        anchor
    );



    anchor.click();



    anchor.remove();



    setTimeout(
        () => {

            URL.revokeObjectURL(
                url
            );

        },
        1000
    );

}