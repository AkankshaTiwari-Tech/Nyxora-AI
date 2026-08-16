import express from "express";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const PEXELS_API_URL =
  "https://api.pexels.com/v1/search";

const MAX_RESULTS =
  15;

const MAX_TOPICS =
  5;


// ======================================================
// NORMALIZE SEARCH QUERY
// ======================================================

function normalizeQuery(
  query = ""
) {

  return String(
    query || ""
  )
    .replace(/\s+/g, " ")
    .trim()
    .slice(
      0,
      120
    );

}


// ======================================================
// PHOTO VALIDATION
// ======================================================

function isValidPhoto(
  photo
) {

  return Boolean(
    photo &&
    photo.src &&
    (
      photo.src.large2x ||
      photo.src.large ||
      photo.src.landscape ||
      photo.src.original
    )
  );

}


// ======================================================
// PHOTO SCORE
// ======================================================

function getPhotoScore(
  photo
) {

  if (
    !photo ||
    !photo.src
  ) {

    return -Infinity;

  }

  let score = 0;

  const width =
    Number(
      photo.width
    ) || 0;

  const height =
    Number(
      photo.height
    ) || 0;


  // Prefer landscape.

  if (
    width >= height
  ) {

    score += 30;

  }


  // Prefer higher resolution.

  if (
    width >= 2000
  ) {

    score += 30;

  }
  else if (
    width >= 1600
  ) {

    score += 20;

  }
  else if (
    width >= 1200
  ) {

    score += 10;

  }


  if (
    height >= 1000
  ) {

    score += 15;

  }
  else if (
    height >= 700
  ) {

    score += 8;

  }


  // Metadata quality.

  if (
    String(
      photo.alt || ""
    ).trim()
  ) {

    score += 10;

  }


  if (
    String(
      photo.photographer || ""
    ).trim()
  ) {

    score += 5;

  }


  return score;

}


// ======================================================
// SELECT BEST PHOTO
// ======================================================

function chooseBestPhoto(
  photos = []
) {

  const validPhotos =
    photos
      .filter(
        isValidPhoto
      )
      .slice()
      .sort(
        (
          a,
          b
        ) =>
          getPhotoScore(b) -
          getPhotoScore(a)
      );


  return (
    validPhotos[0] ||
    null
  );

}


// ======================================================
// GET BEST IMAGE URL
// ======================================================

function getBestImageUrl(
  photo
) {

  if (
    !photo?.src
  ) {

    return "";

  }


  return (
    photo.src.large2x ||
    photo.src.large ||
    photo.src.landscape ||
    photo.src.original ||
    ""
  );

}


// ======================================================
// DOWNLOAD IMAGE AS BASE64
// ======================================================

async function downloadImageAsDataUrl(
  imageUrl
) {

  const imageResponse =
    await fetch(
      imageUrl,
      {
        method:
          "GET"
      }
    );


  if (
    !imageResponse.ok
  ) {

    throw new Error(
      `Unable to download Pexels image (${imageResponse.status}).`
    );

  }


  const arrayBuffer =
    await imageResponse.arrayBuffer();


  const buffer =
    Buffer.from(
      arrayBuffer
    );


  if (
    !buffer.length
  ) {

    throw new Error(
      "Pexels image response was empty."
    );

  }


  const contentType =
    imageResponse
      .headers
      .get(
        "content-type"
      ) ||
    "image/jpeg";


  return (
    `data:${contentType};base64,` +
    buffer.toString(
      "base64"
    )
  );

}


// ======================================================
// SEARCH ONE TOPIC
// ======================================================

async function searchSingleTopic(
  topic
) {

  const query =
    normalizeQuery(
      topic
    );

  if (
    !query
  ) {

    return null;

  }


  const searchParams =
    new URLSearchParams({

      query,

      orientation:
        "landscape",

      size:
        "large",

      per_page:
        String(
          MAX_RESULTS
        ),

      page:
        "1"

    });


  const response =
    await fetch(
      `${PEXELS_API_URL}?${searchParams.toString()}`,
      {

        method:
          "GET",

        headers: {

          Authorization:
            process.env.PEXELS_API_KEY

        }

      }
    );


  if (
    !response.ok
  ) {

    let apiMessage =
      `Pexels request failed (${response.status}).`;


    try {

      const errorData =
        await response.json();


      if (
        errorData?.error
      ) {

        apiMessage +=
          ` ${errorData.error}`;

      }

    }
    catch {

      // Keep default error.

    }


    throw new Error(
      apiMessage
    );

  }


  const data =
    await response.json();


  const photos =
    Array.isArray(
      data?.photos
    )
      ? data.photos
      : [];


  const selectedPhoto =
    chooseBestPhoto(
      photos
    );


  if (
    !selectedPhoto
  ) {

    return null;

  }


  const imageUrl =
    getBestImageUrl(
      selectedPhoto
    );


  if (
    !imageUrl
  ) {

    return null;

  }


  const imageDataUrl =
    await downloadImageAsDataUrl(
      imageUrl
    );


  return {

    imageUrl:
      imageDataUrl,

    originalUrl:
      imageUrl,

    thumbnailUrl:
      selectedPhoto?.src?.medium ||
      selectedPhoto?.src?.small ||
      imageUrl,

    alt:
      String(
        selectedPhoto.alt ||
        query
      ).trim(),

    topic:
      query,

    photographer:
      String(
        selectedPhoto.photographer ||
        ""
      ).trim(),

    photographerUrl:
      String(
        selectedPhoto.photographer_url ||
        ""
      ).trim(),

    photoUrl:
      String(
        selectedPhoto.url ||
        ""
      ).trim(),

    pexelsUrl:
      "https://www.pexels.com/",

    width:
      Number(
        selectedPhoto.width
      ) || 0,

    height:
      Number(
        selectedPhoto.height
      ) || 0,

    source:
      "pexels"

  };

}


// ======================================================
// POST /api/notes-image
//
// Supports:
//
// topic
//     OR
//
// topics: []
//
// Response keeps the old `image` property for
// backwards compatibility and adds `images`.
// ======================================================

router.post(
  "/",
  async (
    req,
    res
  ) => {

    try {

      if (
        !process.env.PEXELS_API_KEY
      ) {

        console.error(
          "❌ PEXELS_API_KEY is missing."
        );


        return res
          .status(500)
          .json({

            success:
              false,

            message:
              "Pexels API key is not configured."

          });

      }


      // ==================================================
      // NORMALIZE TOPICS
      // ==================================================

      let topics = [];


      if (
        Array.isArray(
          req.body?.topics
        )
      ) {

        topics =
          req.body.topics
            .map(
              normalizeQuery
            )
            .filter(Boolean)
            .slice(
              0,
              MAX_TOPICS
            );

      }


      // ==================================================
      // BACKWARDS COMPATIBILITY
      // ==================================================

      if (
        !topics.length &&
        req.body?.topic
      ) {

        const singleTopic =
          normalizeQuery(
            req.body.topic
          );


        if (
          singleTopic
        ) {

          topics = [
            singleTopic
          ];

        }

      }


      if (
        !topics.length
      ) {

        return res
          .status(400)
          .json({

            success:
              false,

            message:
              "Notes image topic or topics required."

          });

      }


      console.log(
        "🔎 Searching Pexels for Notes topics:",
        topics
      );


      // ==================================================
      // SEARCH ALL REQUESTED TOPICS
      // ==================================================

      const results =
        await Promise.all(
          topics.map(
            async (
              topic
            ) => {

              try {

                return await searchSingleTopic(
                  topic
                );

              }
              catch (
                error
              ) {

                console.error(
                  `❌ Pexels topic failed: ${topic}`,
                  error
                );

                return null;

              }

            }
          )
        );


      const images =
        results.filter(
          Boolean
        );


      if (
        !images.length
      ) {

        return res
          .status(404)
          .json({

            success:
              false,

            message:
              "No relevant Pexels images found."

          });

      }


      console.log(
        "✅ Notes images selected:",
        images.length
      );


      return res.json({

        success:
          true,

        // New multi-image response.

        images,

        // Old single-image compatibility.

        image:
          images[0]

      });

    }
    catch (
      error
    ) {

      console.error(
        "❌ Notes image search failed:",
        error
      );


      return res
        .status(500)
        .json({

          success:
            false,

          message:
            error?.message ||
            "Failed to search for Notes images."

        });

    }

  }
);


export default router;