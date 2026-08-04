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

        flex

        items-center

        justify-center

        gap-2

        rounded-xl

        border

        border-violet-400/40

        bg-gradient-to-br

        from-violet-900/60

        via-purple-900/40

        to-slate-900/80

        px-5

        py-3

        font-medium

        text-white

        shadow-lg

        shadow-violet-700/30

        transition-all

        duration-300

        hover:scale-[1.02]

        hover:border-violet-300/60

        hover:shadow-violet-500/40

        disabled:cursor-not-allowed

        disabled:opacity-50

        disabled:hover:scale-100

        ${className}

      `}


    >


      {loading && (

        <Loader2

          size={18}

          className="animate-spin"

        />

      )}



      {!loading && Icon && (

        <Icon

          size={18}

        />

      )}



      {children}


    </button>

  );


}