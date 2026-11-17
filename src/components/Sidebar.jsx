import {menuItem, menuItemActive, menuTitle, sectionLabel} from "../utils/menuStyles.js";

export default function Sidebar({notes, onSelect, activeId, togglePinned}) {

  const pinnedNotes = notes.filter(item => item.isPinned === true)
  const unpinnedNotes = notes.filter(item => item.isPinned === false && item.isNote === true)

  return (
    <aside
      aria-label="Barra lateral"
      className="flex h-full w-64 shrink-0 flex-col border-r border-line bg-wash px-3 pb-3 pt-5">
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
          className="w-full rounded-ui border border-line bg-white px-2.5 py-1.5 text-[13px] text-ink outline-none placeholder:text-ink-faint focus:border-ink/40"
        />
        <kbd
          className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded-ui-sm border border-line px-1.5 text-[11px] font-medium text-ink-faint">
          Ctrl Space
        </kbd>
      </form>

      <nav aria-label="Páginas" className="flex flex-1 flex-col gap-6 overflow-y-auto">
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
          className="grid h-6 w-6 place-items-center rounded-full bg-ink text-[11px] font-semibold text-white"
        >
          G
        </span>
        <p>Gonzalo</p>
        <button type="button" className="ml-auto rounded-ui-sm px-1.5 py-0.5 hover:bg-ink/5">
          + Nueva
        </button>
      </footer>
    </aside>
  );
}
