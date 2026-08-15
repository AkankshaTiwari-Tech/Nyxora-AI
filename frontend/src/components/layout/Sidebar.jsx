import {
  Home,
  MessageSquare,
  FolderOpen,
  FileText,
  FileDown,
  ClipboardList,
  Presentation,
  Star,
  Brain,
  LogOut,
  Menu,
  X,
} from "lucide-react";

import {
  NavLink,
  useNavigate,
} from "react-router-dom";

import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/firebase";

import NyxoraOrbitLogo from "../common/NyxoraOrbitLogo";

const menuItems = [
  {
    name: "Home",
    icon: Home,
    path: "/dashboard",
  },
  {
    name: "AI Chat",
    icon: MessageSquare,
    path: "/chat",
  },
  {
    name: "AI Memory",
    icon: Brain,
    path: "/ai-memory",
  },
  {
    name: "Workspace",
    icon: FolderOpen,
    path: "/workspace",
  },
  {
    name: "Notes",
    icon: FileText,
    path: "/notes",
  },
  {
    name: "PDF Generator",
    icon: FileDown,
    path: "/pdf",
  },
  {
    name: "Test Generator",
    icon: ClipboardList,
    path: "/chat",
    mode: "test",
  },
  {
    name: "Presentation",
    icon: Presentation,
    path: "/presentation",
  },
  {
    name: "Favorites",
    icon: Star,
    path: "/favorites",
  },
];

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/", { replace: true });
  };

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleClick = (item) => {
    if (item.mode === "test") {
      navigate("/chat", {
        state: {
          assistantMode: "test",
        },
      });

      setMobileOpen(false);
      return;
    }

    navigate(item.path);
    setMobileOpen(false);
  };

  return (
    <>
      {/* MOBILE MENU BUTTON */}

      {!mobileOpen && (
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Open navigation menu"
          className="
            fixed left-4 top-4 z-[100]
            flex h-11 w-11 items-center justify-center
            rounded-xl border border-white/[0.10]
            bg-[#060914]/95
            text-slate-300
            shadow-[0_8px_30px_rgba(0,0,0,.35)]
            backdrop-blur-xl
            transition
            hover:bg-white/[0.07]
            hover:text-white
            md:hidden
          "
        >
          <Menu size={21} />
        </button>
      )}

      {/* MOBILE OVERLAY */}

      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={() => setMobileOpen(false)}
          className="
            fixed inset-0 z-[90]
            bg-black/55
            backdrop-blur-[2px]
            md:hidden
          "
        />
      )}

      {/* SIDEBAR */}

      <aside
        className={`
          relative z-[95]
          flex min-h-screen w-72 shrink-0 flex-col overflow-hidden
          border-r border-white/[0.07]
          bg-[#060914]

          max-md:fixed
          max-md:left-0
          max-md:top-0
          max-md:h-[100dvh]
          max-md:min-h-0
          max-md:w-[min(82vw,18rem)]
          max-md:shadow-[20px_0_60px_rgba(0,0,0,.45)]
          max-md:transition-transform
          max-md:duration-300
          max-md:ease-out

          ${
            mobileOpen
              ? "max-md:translate-x-0"
              : "max-md:-translate-x-full"
          }
        `}
      >
        {/* MOBILE CLOSE BUTTON */}

        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          aria-label="Close navigation menu"
          className="
            absolute right-4 top-4 z-30
            flex h-9 w-9 items-center justify-center
            rounded-lg border border-white/[0.08]
            bg-white/[0.035]
            text-slate-400
            transition
            hover:bg-white/[0.07]
            hover:text-white
            md:hidden
          "
        >
          <X size={19} />
        </button>

        {/* BACKGROUND LIGHTS */}

        <div
          className="
            pointer-events-none absolute
            -left-28 top-[-70px]
            h-72 w-72 rounded-full
            bg-fuchsia-600/[0.07]
            blur-[90px]
          "
        />

        <div
          className="
            pointer-events-none absolute
            -right-32 top-[32%]
            h-72 w-72 rounded-full
            bg-violet-600/[0.055]
            blur-[100px]
          "
        />

        <div
          className="
            pointer-events-none absolute
            -bottom-24 left-12
            h-64 w-64 rounded-full
            bg-cyan-500/[0.045]
            blur-[100px]
          "
        />

        {/* BRAND HEADER */}

        <div
          className="
            relative z-10
            border-b border-white/[0.07]
            px-6 py-7
          "
        >
          <div className="flex items-center gap-4">
            <div
              className="
                relative flex
                h-[58px] w-[58px]
                shrink-0 items-center justify-center
              "
            >
              <NyxoraOrbitLogo
                size={52}
                animated={true}
              />
            </div>

            <div className="min-w-0">
              <h1
                className="
                  text-[22px]
                  font-bold
                  tracking-tight
                  text-white
                "
              >
                Nyxora{" "}
                <span className="nyxora-gradient-text">
                  AI
                </span>
              </h1>

              <p
                className="
                  mt-0.5
                  text-xs
                  font-medium
                  tracking-wide
                  text-slate-400
                "
              >
                Your AI Workspace
              </p>
            </div>
          </div>

          <div
            className="
              mt-5 h-px w-full
              bg-gradient-to-r
              from-fuchsia-500/45
              via-violet-500/30
              to-cyan-400/25
            "
          />
        </div>
                {/* NAVIGATION */}

        <nav
          className="
            relative z-10
            flex-1 overflow-y-auto
            px-4 py-5
          "
        >
          <div
            className="
              mb-3 px-3
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.18em]
              text-slate-600
            "
          >
            Workspace
          </div>

          <div className="space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;

              // Test Generator button
              if (item.mode === "test") {
                return (
                  <button
                    key={item.name}
                    onClick={() => handleClick(item)}
                    className="
                      group relative flex w-full items-center gap-4
                      overflow-hidden rounded-xl border border-transparent
                      px-4 py-3.5 text-slate-400
                      transition-all duration-300
                      hover:border-violet-400/[0.12]
                      hover:bg-white/[0.035]
                      hover:text-white
                    "
                  >
                    <div
                      className="
                        flex h-9 w-9 shrink-0 items-center justify-center
                        rounded-lg bg-white/[0.035]
                        text-slate-400 transition-all duration-300
                        group-hover:bg-violet-500/[0.10]
                        group-hover:text-violet-300
                        group-hover:shadow-[0_0_18px_rgba(124,58,237,.10)]
                      "
                    >
                      <Icon size={19} />
                    </div>

                    <span className="font-medium">
                      {item.name}
                    </span>
                  </button>
                );
              }

              // Normal navigation
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) => `
                    group relative flex w-full items-center gap-4
                    overflow-hidden rounded-xl border
                    px-4 py-3.5
                    transition-all duration-300

                    ${
                      isActive
                        ? `
                          border-violet-400/[0.15]
                          bg-gradient-to-r
                          from-fuchsia-500/[0.09]
                          via-violet-500/[0.11]
                          to-cyan-400/[0.055]
                          text-white
                          shadow-[inset_0_0_25px_rgba(124,58,237,.035),0_8px_28px_rgba(0,0,0,.14)]
                        `
                        : `
                          border-transparent
                          text-slate-400
                          hover:border-violet-400/[0.10]
                          hover:bg-white/[0.035]
                          hover:text-white
                        `
                    }
                  `}
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <div
                          className="
                            absolute left-0 top-[20%] bottom-[20%]
                            w-[3px] rounded-r-full
                            bg-gradient-to-b
                            from-fuchsia-400
                            via-violet-500
                            to-cyan-400
                            shadow-[0_0_12px_rgba(168,85,247,.6)]
                          "
                        />
                      )}

                      <div
                        className={`
                          flex h-9 w-9 shrink-0 items-center justify-center
                          rounded-lg transition-all duration-300

                          ${
                            isActive
                              ? `
                                bg-gradient-to-br
                                from-fuchsia-500/[0.16]
                                via-violet-500/[0.15]
                                to-cyan-400/[0.10]
                                text-violet-200
                                shadow-[0_0_18px_rgba(124,58,237,.12)]
                              `
                              : `
                                bg-white/[0.035]
                                text-slate-400
                                group-hover:bg-violet-500/[0.10]
                                group-hover:text-violet-300
                              `
                          }
                        `}
                      >
                        <Icon size={19} />
                      </div>

                      <span className="font-medium">
                        {item.name}
                      </span>

                      {isActive && (
                        <div
                          className="
                            ml-auto h-1.5 w-1.5
                            rounded-full bg-cyan-300
                            shadow-[0_0_9px_rgba(34,211,238,.8)]
                          "
                        />
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* BOTTOM / LOGOUT */}

        <div
          className="
            relative z-10
            border-t border-white/[0.07]
            p-4
          "
        >
          <button
            onClick={handleLogout}
            className="
              group flex w-full items-center gap-4
              rounded-xl border border-transparent
              px-4 py-3.5
              text-slate-400
              transition-all duration-300
              hover:border-red-400/[0.12]
              hover:bg-red-500/[0.07]
              hover:text-red-300
            "
          >
            <div
              className="
                flex h-9 w-9 items-center justify-center
                rounded-lg
                bg-red-500/[0.06]
                text-red-400
                transition-all duration-300
                group-hover:bg-red-500/[0.12]
                group-hover:shadow-[0_0_18px_rgba(239,68,68,.10)]
              "
            >
              <LogOut size={19} />
            </div>

            <span className="font-medium">
              Logout
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}