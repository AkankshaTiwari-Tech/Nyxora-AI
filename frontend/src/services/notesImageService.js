const NOTES_IMAGE_API_URL =
    "http://localhost:5000/api/notes-image";


// ======================================================
// NORMALIZE TOPIC
// ======================================================

function normalizeQuery(query = "") {

    return String(query || "")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 120);

}


// ======================================================
// SEARCH NOTES IMAGES
//
// Frontend -> Nyxora backend -> Pexels
//
// The Pexels API key NEVER reaches the frontend.
//
// Supports multiple relevant topics while preserving
// the original single-image function below.
// ======================================================

export async function searchNotesImages(
    topics = []
) {

    const normalizedTopics =
        Array.isArray(topics)
            ? topics
                .map(
                    normalizeQuery
                )
                .filter(Boolean)
                .slice(
                    0,
                    5
                )
            : [];


    if (
        !normalizedTopics.length
    ) {

        return [];

    }


    try {

        const response =
            await fetch(
                NOTES_IMAGE_API_URL,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({
                            topics:
                                normalizedTopics
                        })
                }
            );


        let data = null;

        try {

            data =
                await response.json();

        } catch {

            data = null;

        }


        if (!response.ok) {

            console.error(
                "Nyxora Notes images request failed:",
                data?.message ||
                `HTTP ${response.status}`
            );

            return [];
        }


        if (
            !data?.success ||
            !Array.isArray(
                data?.images
            )
        ) {

            return [];
        }


        return data.images
            .filter(
                Boolean
            )
            .map(
                (
                    image
                ) => ({

                    imageUrl:
                        String(
                            image?.imageUrl ||
                            ""
                        ).trim(),

                    thumbnailUrl:
                        String(
                            image?.thumbnailUrl ||
                            ""
                        ).trim(),

                    alt:
                        String(
                            image?.alt ||
                            image?.topic ||
                            ""
                        ).trim(),

                    topic:
                        String(
                            image?.topic ||
                            ""
                        ).trim(),

                    photographer:
                        String(
                            image?.photographer ||
                            ""
                        ).trim(),

                    photographerUrl:
                        String(
                            image?.photographerUrl ||
                            ""
                        ).trim(),

                    photoUrl:
                        String(
                            image?.photoUrl ||
                            ""
                        ).trim(),

                    pexelsUrl:
                        String(
                            image?.pexelsUrl ||
                            "https://www.pexels.com/"
                        ).trim(),

                    width:
                        Number(
                            image?.width
                        ) || 0,

                    height:
                        Number(
                            image?.height
                        ) || 0,

                    source:
                        "pexels"

                })
            )
            .filter(
                (
                    image
                ) =>
                    Boolean(
                        image.imageUrl
                    )
            );

    } catch (error) {

        console.error(
            "Nyxora Notes images service error:",
            error
        );

        return [];

    }

}


// ======================================================
// SEARCH NOTES IMAGE
//
// Frontend -> Nyxora backend -> Pexels
//
// The Pexels API key NEVER reaches the frontend.
// ======================================================

export async function searchNotesImage(
    topic = ""
) {

    const query =
        normalizeQuery(topic);

    if (!query) {
        return null;
    }


    try {

        const response =
            await fetch(
                NOTES_IMAGE_API_URL,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({
                            topic: query
                        })
                }
            );


        let data = null;

        try {

            data =
                await response.json();

        } catch {

            data = null;

        }


        if (!response.ok) {

            console.error(
                "Nyxora Notes image request failed:",
                data?.message ||
                `HTTP ${response.status}`
            );

            return null;
        }


        if (
            !data?.success ||
            !data?.image
        ) {

            return null;
        }


        return {

            imageUrl:
                String(
                    data.image.imageUrl ||
                    ""
                ).trim(),

            thumbnailUrl:
                String(
                    data.image.thumbnailUrl ||
                    ""
                ).trim(),

            alt:
                String(
                    data.image.alt ||
                    query
                ).trim(),

            topic:
                String(
                    data.image.topic ||
                    query
                ).trim(),

            photographer:
                String(
                    data.image.photographer ||
                    ""
                ).trim(),

            photographerUrl:
                String(
                    data.image.photographerUrl ||
                    ""
                ).trim(),

            photoUrl:
                String(
                    data.image.photoUrl ||
                    ""
                ).trim(),

            pexelsUrl:
                String(
                    data.image.pexelsUrl ||
                    "https://www.pexels.com/"
                ).trim(),

            width:
                Number(
                    data.image.width
                ) || 0,

            height:
                Number(
                    data.image.height
                ) || 0,

            source:
                "pexels"

        };

    } catch (error) {

        console.error(
            "Nyxora Notes image service error:",
            error
        );

        return null;
    }

}


// ======================================================
// DEFAULT EXPORT
//
// Existing imports remain compatible.
// ======================================================

export default searchNotesImage;