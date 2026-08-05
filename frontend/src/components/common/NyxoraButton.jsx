import {
  Loader2,
} from "lucide-react";


export default function NyxoraButton({

  children,

  onClick,

  type = "button",

  loading = false,

  disabled = false,

  icon: Icon,

  className = "",

}) {


  return (

    <button

      type={type}

      onClick={onClick}

      disabled={
        disabled ||
        loading
      }

      className={`

        nyxora-button

        group

        relative

        flex

        items-center

        justify-center

        gap-2

        overflow-hidden

        rounded-xl

        border

        border-white/10

        bg-gradient-to-r

        from-fuchsia-600

        via-violet-600

        to-cyan-500

        px-5

        py-3

        font-medium

        text-white

        shadow-lg

        shadow-violet-700/20

        transition-all

        duration-300

        hover:scale-[1.02]

        hover:border-violet-300/30

        hover:shadow-xl

        hover:shadow-violet-500/20

        disabled:cursor-not-allowed

        disabled:opacity-50

        disabled:hover:scale-100

        ${className}

      `}

    >


      {/* ==================================================
          SUBTLE BUTTON LIGHT
      ================================================== */}

      <div

        className="
          pointer-events-none
          absolute
          inset-0
          bg-gradient-to-b
          from-white/[0.10]
          via-transparent
          to-black/[0.08]
        "

      />


      {/* ==================================================
          HOVER SHINE
      ================================================== */}

      <div

        className="
          pointer-events-none
          absolute
          -left-1/2
          top-0
          h-full
          w-1/3
          -skew-x-12
          bg-gradient-to-r
          from-transparent
          via-white/20
          to-transparent
          opacity-0
          transition-all
          duration-700
          group-hover:left-[120%]
          group-hover:opacity-100
        "

      />


      {/* ==================================================
          LOADING
      ================================================== */}

      {loading && (

        <Loader2

          size={18}

          className="
            relative
            z-10
            animate-spin
          "

        />

      )}


      {/* ==================================================
          ICON
      ================================================== */}

      {!loading && Icon && (

        <Icon

          size={18}

          className="
            relative
            z-10
          "

        />

      )}


      {/* ==================================================
          CONTENT
      ================================================== */}

      <span
        className="
          relative
          z-10
        "
      >

        {children}

      </span>


    </button>

  );


}