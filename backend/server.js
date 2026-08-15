import "dotenv/config";
import express from "express";
import cors from "cors";

import chatRoutes from "./routes/chatRoutes.js";

import imageRoutes from "./routes/imageRoutes.js";

import notesImageRoutes from "./routes/notesImageRoutes.js";

// ======================================================
// ENVIRONMENT
// ======================================================



// ======================================================
// EXPRESS APP
// ======================================================

const app = express();


// ======================================================
// MIDDLEWARE
// ======================================================

app.use(
  cors()
);

// ======================================================
// JSON BODY LIMIT
//
// PDFs and images are currently sent as Base64 inside
// JSON. Base64 increases the original file size, so the
// default Express JSON limit is too small.
//
// 25 MB allows normal document/image uploads while still
// keeping a controlled server-side request limit.
// ======================================================

app.use(
  express.json({
    limit: "25mb",
  })
);


// Also support larger URL-encoded requests if required
// later by the application.

app.use(
  express.urlencoded({
    extended: true,
    limit: "25mb",
  })
);


// ======================================================
// HEALTH ROUTE
// ======================================================

app.get(
  "/",
  (req, res) => {

    res.json({
      success: true,
      message:
        "🚀 Nyxora AI Backend Running Successfully",
    });

  }
);


// ======================================================
// CHAT ROUTES
// ======================================================

app.use(
  "/api/chat",
  chatRoutes
);

app.use(
  "/api/generate-image",
  imageRoutes
);

app.use(
  "/api/notes-image",
  notesImageRoutes
);

// ======================================================
// PAYLOAD TOO LARGE ERROR
// ======================================================

app.use(
  (
    error,
    req,
    res,
    next
  ) => {

    if (
      error?.type ===
        "entity.too.large" ||
      error?.status ===
        413
    ) {

      console.error(
        "❌ Attachment payload too large."
      );


      return res
        .status(413)
        .json({
          success: false,
          reply:
            "This file is too large. Please upload a smaller file.",
        });

    }


    next(error);

  }
);


// ======================================================
// PORT
// ======================================================

const PORT =
  process.env.PORT ||
  5000;


// ======================================================
// START SERVER
// ======================================================

app.listen(
  PORT,
  () => {

    console.log(
      `✅ Server running on http://localhost:${PORT}`
    );

  }
);