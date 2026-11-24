import {useEffect} from "react";
import {menuItem, menuItemActive, menuTitle, sectionLabel} from "../utils/menuStyles.js";
import {useAuth} from "../auth/AuthContext.jsx";

export default function Sidebar({notes, onSelect, onNewNote, activeId, togglePinned, open, onClose}) {
  const {user, logout} = useAuth()

  useEffect(() => {
    if (!open) return
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [open, onClose])

  const pinnedNotes = notes.filter(item => item.is_active && item.is_pinned)
  const unpinnedNotes = notes.filter(item => item.is_active && !item.is_pinned)

  return (
    <>
    <div
      aria-hidden="true"
      onClick={onClose}
      className={`fixed inset-0 z-30 bg-ink/30 transition-opacity duration-200 md:hidden ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
    />
    <aside
      aria-label="Barra lateral"
      className={`fixed inset-y-0 left-0 z-40 flex w-72 max-w-[85vw] shrink-0 flex-col border-r border-line bg-wash px-3 pb-3 pt-5 transition-[transform,visibility] duration-200 md:static md:z-auto md:h-full md:w-64 md:max-w-none md:translate-x-0 md:visible ${open ? "translate-x-0" : "invisible -translate-x-full"}`}>
      <header className="flex items-center gap-2.5 px-2 pb-4">
        <span
          aria-hidden="true"
          className="grid h-[22px] w-[22px] place-items-center rounded-ui bg-ink font-serif text-sm font-semibold text-white"
        >
          e
        </span>
        <p className="font-serif text-xl font-semibold tracking-tight text-ink">my-editor</p>
      </header>

      <form role="search" className="relative mb-6">
        <input
          type="search"
          aria-label="Buscar páginas"
          placeholder="Buscar"
          className="w-full rounded-ui border border-line bg-white px-2.5 py-2 text-base text-ink md:py-1.5 md:text-[13px] outline-none placeholder:text-ink-faint focus:border-ink/40"
        />
        <kbd
          className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded-ui-sm border border-line px-1.5 text-[11px] font-medium text-ink-faint pointer-coarse:hidden">
          Ctrl Space
        </kbd>
      </form>

      <nav aria-label="Páginas" className="flex flex-1 flex-col gap-6 overflow-y-auto">
        <button onClick={() => onNewNote()} type="button" className={`${menuItem} h-10 w-full text-ink-soft hover:bg-ink/5`}>
        <span aria-hidden="true" className="w-5 text-center text-sm text-ink-soft">+</span>
          <span className={menuTitle}>Nueva nota</span>
        </button>

        <section>
          <h2 className={`${sectionLabel} px-2 pb-1.5`}>Fijadas</h2>
          <ul className="flex flex-col gap-px">
            {pinnedNotes.map((note) => (
              <li key={note.id} className="flex items-stretch">
                <button onClick={() => togglePinned(note.id)} type="button" aria-label="Desfijar nota" className={`${menuItem} shrink-0 hover:bg-ink/5`}>
                  <span aria-hidden="true" className="w-5 text-center text-xl text-ink-soft">🖈</span>
                </button>
                <button onClick={() => onSelect(note.id)} type="button" className={`${menuItem} min-w-0 flex-1 hover:bg-ink/5 ${note.id === activeId ? menuItemActive : ""}`}>
                  <span className={`${menuTitle} truncate`}>{note.title}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className={`${sectionLabel} px-2 pb-1.5`}>Notas</h2>
          <ul className="flex flex-col gap-px">
            {unpinnedNotes.map((note) => (
              <li key={note.id} className="flex items-stretch">
                <button onClick={() => togglePinned(note.id)} type="button" aria-label="Fijar nota" className={`${menuItem} shrink-0 hover:bg-ink/5`}>
                  <span aria-hidden="true" className="w-5 text-center text-sm text-ink-soft">⏹</span>
                </button>
                <button onClick={() => onSelect(note.id)} type="button" className={`${menuItem} min-w-0 flex-1 hover:bg-ink/5 ${note.id === activeId ? menuItemActive : ""}`}>
                  <span className={`${menuTitle} truncate`}>{note.title}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      </nav>

      <footer className="flex items-center gap-2.5 border-t border-line px-2 pt-3 text-[13px] text-ink-soft">
        <span
          aria-hidden="true"
          className="grid h-6 w-6 place-items-center rounded-full bg-ink text-[11px] font-semibold text-white">
          {user.name.charAt(0).toUpperCase()}
        </span>
        <p className="min-w-0 flex-1 truncate">{user.name}</p>
        <button
          type="button"
          onClick={logout}
          className="shrink-0 cursor-pointer rounded-ui-sm px-1.5 py-0.5 hover:bg-ink/5 hover:text-ink pointer-coarse:px-2.5 pointer-coarse:py-2">
          Cerrar sesión
        </button>
      </footer>
    </aside>
    </>
  );
}
