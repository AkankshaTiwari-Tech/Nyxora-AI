import { useEffect, useRef, useState } from "react";
import {
  Bot,
  Sparkles,
  MoreVertical,
  ChevronDown,
} from "lucide-react";


const assistantModes = [
  {
    id: "normal",
    label: "Normal Assistant",
    emoji: "💬",
  },
  {
    id: "teacher",
    label: "Teacher Assistant",
    emoji: "🧑‍🏫",
  },
  {
    id: "test",
    label: "Test Generator",
    emoji: "📝",
  },
  {
    id: "homework",
    label: "Homework Creator",
    emoji: "📚",
  },
  {
    id: "report",
    label: "Student Report Analyzer",
    emoji: "📊",
  },
  {
    id: "doubt",
    label: "Doubt Solver",
    emoji: "❓",
  },
];


export default function ChatHeader({
  selectedMode,
  onModeChange,
}) {

  const [isOpen, setIsOpen] =
    useState(false);

  const dropdownRef =
    useRef(null);


  const currentMode =
    assistantModes.find(
      (mode) =>
        mode.id === selectedMode
    ) || assistantModes[0];


  useEffect(() => {

    const handleOutsideClick =
      (event) => {

        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(
            event.target
          )
        ) {
          setIsOpen(false);
        }

      };


    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );


    return () => {

      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );

    };

  }, []);


  const handleSelectMode =
    (mode) => {

      onModeChange(mode.id);

      setIsOpen(false);

    };


  return (
    <header
      className="
        relative
        z-40
        h-20
        border-b
        border-[#20263B]
        bg-[#050816]
        flex
        items-center
        justify-between
        px-8
      "
    >

      {/* Left */}
      <div className="flex items-center gap-4">

        <div
          className="
            w-12
            h-12
            rounded-xl
            bg-indigo-600
            flex
            items-center
            justify-center
          "
        >
          <Bot
            className="text-white"
            size={24}
          />
        </div>


        <div>

          <h2 className="text-xl font-semibold text-white">
            Nyxora AI Assistant
          </h2>


          <p
            className="
              text-sm
              text-green-400
              flex
              items-center
              gap-2
            "
          >
            <Sparkles size={14} />

            Online
          </p>

        </div>

      </div>


      {/* Right */}
      <div className="flex items-center gap-4">


        {/* Assistant Selector */}
        <div
          ref={dropdownRef}
          className="relative"
        >

          <button
            type="button"
            onClick={() =>
              setIsOpen(
                (current) =>
                  !current
              )
            }
            className="
              min-w-[225px]
              h-12
              px-4
              rounded-xl
              border
              border-slate-600
              bg-[#111827]
              hover:bg-[#151D30]
              hover:border-violet-500
              transition
              flex
              items-center
              justify-between
              gap-4
              text-white
            "
            aria-haspopup="menu"
            aria-expanded={isOpen}
          >

            <div className="flex items-center gap-3">

              <span className="text-xl leading-none">
                {currentMode.emoji}
              </span>

              <span className="font-medium whitespace-nowrap">
                {currentMode.label}
              </span>

            </div>


            <ChevronDown
              size={18}
              className={`
                shrink-0
                text-gray-400
                transition-transform
                duration-200
                ${
                  isOpen
                    ? "rotate-180"
                    : ""
                }
              `}
            />

          </button>


          {/* Dropdown */}
          {isOpen && (

            <div
              className="
                absolute
                right-0
                top-[58px]
                z-50
                w-[300px]
                overflow-hidden
                rounded-2xl
                border
                border-[#293149]
                bg-[#111827]
                p-2
                shadow-2xl
              "
              role="menu"
            >

              {assistantModes.map(
                (mode) => {

                  const isSelected =
                    currentMode.id ===
                    mode.id;


                  return (

                    <button
                      key={mode.id}
                      type="button"
                      onClick={() =>
                        handleSelectMode(
                          mode
                        )
                      }
                      className={`
                        w-full
                        flex
                        items-center
                        gap-4
                        rounded-xl
                        px-4
                        py-3
                        text-left
                        transition
                        ${
                          isSelected
                            ? "bg-violet-600/15 text-violet-300"
                            : "text-gray-200 hover:bg-[#1A2236] hover:text-white"
                        }
                      `}
                      role="menuitem"
                    >

                      <span className="w-7 text-center text-xl">
                        {mode.emoji}
                      </span>

                      <span className="font-medium">
                        {mode.label}
                      </span>

                    </button>

                  );

                }
              )}

            </div>

          )}

        </div>


        {/* More Options */}
        <button
          type="button"
          className="
            w-11
            h-11
            rounded-xl
            bg-[#151B2F]
            hover:bg-[#1B2340]
            transition
            flex
            items-center
            justify-center
          "
          aria-label="More options"
        >

          <MoreVertical
            className="text-gray-300"
            size={20}
          />

        </button>

      </div>

    </header>
  );
}