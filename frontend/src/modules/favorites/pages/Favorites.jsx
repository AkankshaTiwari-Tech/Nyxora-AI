import {
  Star,
  MessageSquare,
  Trash2,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import MessageContent
  from "../../chat/components/ChatMessage/MessageContent";


// ======================================================
// FAVORITES PAGE
// ======================================================

export default function Favorites() {

  const [
    favorites,
    setFavorites,
  ] = useState([]);


  // ====================================================
  // LOAD FAVORITES
  // ====================================================

  useEffect(() => {

    loadFavorites();

  }, []);


  const loadFavorites = () => {

    try {

      const saved =
        JSON.parse(
          localStorage.getItem(
            "nyxora_favorites"
          )
        ) || [];


      setFavorites(
        Array.isArray(saved)
          ? saved
          : []
      );

    } catch (error) {

      console.error(
        "Failed to load favorites:",
        error
      );


      setFavorites([]);

    }

  };


  // ====================================================
  // REMOVE FAVORITE
  // ====================================================

  const removeFavorite = (
    index
  ) => {

    const updated =
      favorites.filter(
        (_, i) =>
          i !== index
      );


    localStorage.setItem(
      "nyxora_favorites",
      JSON.stringify(
        updated
      )
    );


    setFavorites(
      updated
    );

  };


  // ====================================================
  // CLEAR ALL FAVORITES
  // ====================================================

  const clearAllFavorites = () => {

    const confirmDelete =
      window.confirm(
        "Remove all favorite messages?"
      );


    if (
      !confirmDelete
    ) {

      return;

    }


    localStorage.removeItem(
      "nyxora_favorites"
    );


    setFavorites([]);

  };


  // ====================================================
  // GET FAVORITE MESSAGE
  // ====================================================

  const getFavoriteMessage = (
    item
  ) => {

    if (
      typeof item ===
      "string"
    ) {

      return item;

    }


    if (
      typeof item?.text ===
      "string"
    ) {

      return item.text;

    }


    if (
      typeof item?.content ===
      "string"
    ) {

      return item.content;

    }


    if (
      typeof item?.message ===
      "string"
    ) {

      return item.message;

    }


    return "";

  };


  // ====================================================
  // UI
  // ====================================================

  return (

    <div
      className="
        relative
        min-h-screen
        overflow-hidden
        bg-[#070B18]
        px-4
        py-6
        text-white
        sm:px-6
        lg:px-8
      "
    >

      {/* ===============================================
          PAGE AMBIENT GLOW
      ================================================ */}

      <div
        className="
          pointer-events-none
          fixed
          -left-40
          -top-40
          h-96
          w-96
          rounded-full
          bg-fuchsia-500/[0.05]
          blur-3xl
        "
      />

      <div
        className="
          pointer-events-none
          fixed
          -bottom-40
          right-0
          h-96
          w-96
          rounded-full
          bg-cyan-400/[0.05]
          blur-3xl
        "
      />


      <div
        className="
          relative
          z-10
          mx-auto
          w-full
          max-w-[1500px]
        "
      >

        {/* =============================================
            HEADER
        ============================================== */}

        <div
          className="
            mb-8
            flex
            flex-wrap
            items-center
            justify-between
            gap-4
          "
        >

          <div
            className="
              flex
              items-center
              gap-3
            "
          >

            <div
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-xl
                border
                border-violet-400/25
                bg-gradient-to-br
                from-fuchsia-500/15
                via-violet-500/15
                to-cyan-400/10
                shadow-[0_0_24px_rgba(139,92,246,0.12)]
              "
            >

              <Star
                size={22}
                className="
                  fill-violet-400/20
                  text-violet-300
                "
              />

            </div>


            <div>

              <h1
                className="
                  text-2xl
                  font-bold
                  tracking-tight
                  text-white
                  sm:text-3xl
                "
              >
                Favorites
              </h1>


              <p
                className="
                  mt-1
                  text-sm
                  text-slate-400
                "
              >
                Your saved Nyxora AI responses.
              </p>

            </div>

          </div>


          {favorites.length >
            0 && (

            <button
              type="button"
              onClick={
                clearAllFavorites
              }
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-red-500/20
                bg-red-500/[0.07]
                px-4
                py-2.5
                text-sm
                font-medium
                text-red-400
                transition-all
                duration-200
                hover:border-red-400/35
                hover:bg-red-500/10
                hover:text-red-300
              "
            >

              <Trash2
                size={16}
              />

              Clear All

            </button>

          )}

        </div>


        {/* =============================================
            EMPTY STATE
        ============================================== */}

        {favorites.length ===
        0 ? (

          <div
            className="
              relative
              overflow-hidden
              rounded-2xl
              border
              border-violet-400/15
              bg-gradient-to-br
              from-violet-950/15
              via-[#0B1020]/95
              to-cyan-950/15
              px-6
              py-16
              text-center
              shadow-[0_12px_40px_rgba(0,0,0,0.18)]
            "
          >

            <div
              className="
                pointer-events-none
                absolute
                left-1/2
                top-0
                h-32
                w-64
                -translate-x-1/2
                rounded-full
                bg-violet-500/[0.07]
                blur-3xl
              "
            />


            <div
              className="
                relative
                mx-auto
                mb-5
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-2xl
                border
                border-violet-400/20
                bg-violet-500/10
              "
            >

              <Star
                size={26}
                className="
                  text-violet-300
                "
              />

            </div>


            <h2
              className="
                relative
                text-lg
                font-semibold
                text-white
              "
            >
              No favorites yet
            </h2>


            <p
              className="
                relative
                mx-auto
                mt-2
                max-w-md
                text-sm
                leading-6
                text-slate-400
              "
            >
              Save important AI responses using
              the star button and they will appear
              here.
            </p>

          </div>

        ) : (

          /* ===========================================
             FAVORITES LIST
          ============================================ */

          <div
            className="
              space-y-5
            "
          >

            {favorites.map(
              (
                item,
                index
              ) => {

                const message =
                  getFavoriteMessage(
                    item
                  );


                return (

                  <div
                    key={
                      item?.id ||
                      `${index}-${message.slice(
                        0,
                        30
                      )}`
                    }
                    className="
                      group
                      relative
                      overflow-hidden
                      rounded-2xl
                      border
                      border-violet-400/15
                      bg-gradient-to-br
                      from-violet-950/15
                      via-[#0B1020]/95
                      to-cyan-950/15
                      shadow-[0_10px_40px_rgba(0,0,0,0.16)]
                      transition-all
                      duration-300
                      hover:border-violet-400/25
                    "
                  >

                    {/* TOP NYXORA ACCENT */}

                    <div
                      className="
                        absolute
                        left-0
                        right-0
                        top-0
                        h-[2px]
                        bg-gradient-to-r
                        from-fuchsia-500
                        via-violet-500
                        to-cyan-400
                        opacity-80
                      "
                    />


                    {/* AMBIENT GLOW */}

                    <div
                      className="
                        pointer-events-none
                        absolute
                        -left-20
                        -top-20
                        h-40
                        w-40
                        rounded-full
                        bg-fuchsia-500/[0.05]
                        blur-3xl
                      "
                    />

                    <div
                      className="
                        pointer-events-none
                        absolute
                        -bottom-20
                        right-0
                        h-40
                        w-40
                        rounded-full
                        bg-cyan-400/[0.05]
                        blur-3xl
                      "
                    />


                    {/* =================================
                        CARD HEADER
                    ================================== */}

                    <div
                      className="
                        relative
                        z-10
                        flex
                        items-center
                        justify-between
                        gap-4
                        border-b
                        border-white/[0.06]
                        px-5
                        py-4
                      "
                    >

                      <div
                        className="
                          flex
                          min-w-0
                          items-center
                          gap-3
                        "
                      >

                        <div
                          className="
                            flex
                            h-9
                            w-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-lg
                            border
                            border-violet-400/20
                            bg-violet-500/10
                          "
                        >

                          <MessageSquare
                            size={17}
                            className="
                              text-violet-300
                            "
                          />

                        </div>


                        <div
                          className="
                            min-w-0
                          "
                        >

                          <p
                            className="
                              text-sm
                              font-semibold
                              text-white
                            "
                          >
                            Nyxora AI Response
                          </p>


                          <p
                            className="
                              mt-0.5
                              text-xs
                              text-slate-500
                            "
                          >
                            Saved to Favorites
                          </p>

                        </div>

                      </div>


                      <button
                        type="button"
                        onClick={() =>
                          removeFavorite(
                            index
                          )
                        }
                        className="
                          flex
                          h-9
                          w-9
                          shrink-0
                          items-center
                          justify-center
                          rounded-lg
                          text-slate-500
                          transition-all
                          duration-200
                          hover:bg-red-500/10
                          hover:text-red-400
                        "
                        title="Remove favorite"
                      >

                        <Trash2
                          size={16}
                        />

                      </button>

                    </div>


                    {/* =================================
                        AI RESPONSE
                    ================================== */}

                    <div
                      className="
                        relative
                        z-10
                        px-5
                        py-5
                        text-slate-200
                      "
                    >

                      {message ? (

                        <MessageContent
                          message={
                            message
                          }
                        />

                      ) : (

                        <p
                          className="
                            text-sm
                            text-slate-500
                          "
                        >
                          This saved response has no
                          content.
                        </p>

                      )}

                    </div>

                  </div>

                );

              }
            )}

          </div>

        )}

      </div>

    </div>

  );

}