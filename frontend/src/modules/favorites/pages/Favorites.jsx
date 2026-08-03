import {
  Star,
  MessageSquare,
  Trash2,
} from "lucide-react";

import { useEffect, useState } from "react";


export default function Favorites() {

  const [
    favorites,
    setFavorites,
  ] = useState([]);



  useEffect(() => {

    loadFavorites();

  }, []);



  const loadFavorites = () => {

    const saved =
      JSON.parse(
        localStorage.getItem(
          "nyxora_favorites"
        )
      ) || [];


    setFavorites(saved);

  };



  const removeFavorite = (index) => {

    const updated =
      favorites.filter(
        (_, i) =>
          i !== index
      );


    localStorage.setItem(
      "nyxora_favorites",
      JSON.stringify(updated)
    );


    setFavorites(updated);

  };



  const clearAllFavorites = () => {

    const confirmDelete =
      window.confirm(
        "Remove all favorite messages?"
      );


    if(!confirmDelete){

      return;

    }


    localStorage.removeItem(
      "nyxora_favorites"
    );


    setFavorites([]);

  };



  return (

    <div
      className="
        min-h-screen
        bg-[#070B18]
        text-white
        p-8
      "
    >


      {/* HEADER */}

      <div
        className="
          flex
          items-center
          justify-between
          mb-8
        "
      >


        <div
          className="
            flex
            items-center
            gap-3
          "
        >

          <Star
            className="text-yellow-400"
            size={28}
          />


          <h1
            className="
              text-3xl
              font-bold
            "
          >
            Favorites
          </h1>


        </div>



        {
          favorites.length > 0 && (

            <button

              onClick={
                clearAllFavorites
              }

              className="
                flex
                items-center
                gap-2
                rounded-xl
                bg-red-500/10
                border
                border-red-500/20
                px-4
                py-2
                text-sm
                text-red-400
                transition
                hover:bg-red-500/20
                hover:text-red-300
              "

            >

              <Trash2
                size={16}
              />

              Clear All

            </button>

          )
        }


      </div>





      {
        favorites.length === 0 ? (


          <div
            className="
              border
              border-[#20263B]
              bg-[#111827]
              rounded-2xl
              p-10
              text-center
              text-gray-400
            "
          >

            <Star
              size={40}
              className="
                mx-auto
                mb-4
                text-gray-500
              "
            />


            <p>
              No favorite messages yet.
            </p>


            <p
              className="
                text-sm
                mt-2
              "
            >
              Save important AI responses using the star button.
            </p>


          </div>


        ) : (


          <div
            className="
              space-y-5
            "
          >


            {
              favorites.map(
                (
                  item,
                  index
                ) => (


                  <div

                    key={index}

                    className="
                      bg-[#111827]
                      border
                      border-[#20263B]
                      rounded-2xl
                      p-6
                    "

                  >


                    <div
                      className="
                        flex
                        items-center
                        justify-between
                        mb-4
                      "
                    >


                      <div
                        className="
                          flex
                          items-center
                          gap-2
                        "
                      >

                        <MessageSquare
                          size={18}
                          className="
                            text-indigo-400
                          "
                        />


                        <span
                          className="
                            text-sm
                            text-gray-400
                          "
                        >
                          AI Response
                        </span>


                      </div>



                      <button

                        onClick={() =>
                          removeFavorite(index)
                        }

                        className="
                          rounded-lg
                          p-2
                          text-gray-500
                          transition
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





                    <p
                      className="
                        text-gray-200
                        leading-7
                      "
                    >

                      {item}

                    </p>


                  </div>


                )

              )
            }


          </div>


        )
      }


    </div>

  );

}