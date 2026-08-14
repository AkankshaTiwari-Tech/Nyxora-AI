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


export default searchNotesImage;