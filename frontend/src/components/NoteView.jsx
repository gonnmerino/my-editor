import {sectionLabel} from "../utils/menuStyles.js";
import Tiptap from "../Tiptap.jsx";

export default function NoteView({currentNote, changeName, changeContent, onDelete, onOpenSidebar}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <header className="flex h-12 shrink-0 items-center gap-2 border-b border-line px-3 text-[12.5px] text-ink-soft md:gap-4 md:px-7">
        <button
          type="button"
          aria-label="Abrir barra lateral"
          onClick={onOpenSidebar}
          className="-ml-1 grid h-10 w-10 shrink-0 cursor-pointer place-items-center rounded-ui text-lg text-ink transition-colors hover:bg-ink/5 md:hidden">
          <span aria-hidden="true">☰</span>
        </button>

        <nav aria-label="Ruta de la página" className="hidden md:block">
          <ol className="flex items-center gap-2">
            <li>Universidad</li>
            <li aria-hidden="true" className="text-ink-faint">/</li>
            <li aria-current="page" className="font-medium text-ink">Parcial 1</li>
          </ol>
        </nav>

        <div className="ml-auto flex items-center gap-1 md:gap-4">
          <p>Guardado</p>
          {currentNote && (
            <button
              type="button"
              onClick={() => onDelete(currentNote.id)}
              className="cursor-pointer rounded-ui px-3 py-2.5 text-[12.5px] font-medium text-ink-soft transition-colors hover:bg-ink/5 hover:text-ink md:py-1.5">
              Eliminar
            </button>
          )}
          <button
            type="button"
            className="cursor-pointer rounded-ui bg-ink px-3 py-2.5 text-[12.5px] font-medium text-white transition-colors hover:bg-ink/85 md:py-1.5"
          >
            Compartir
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        <article className="mx-auto w-full max-w-[42.5rem] px-4 pb-32 pt-8 md:px-6 md:pt-14">
          <header className="mb-6">
            <p className={`${sectionLabel} mb-3.5`}>{currentNote ? "Nota" : ""}</p>
            <h1 className="font-serif text-[2.25rem] font-medium leading-[1.05] tracking-[-0.025em] text-ink md:text-[3.125rem]">
              {currentNote ? (
              <input
                className="h-12 w-full border-none outline-none md:h-15"
                value={currentNote.title}
                onChange={(e) => changeName(e.target.value)}
              />
                ) : (
                  "Selecciona una nota"
                )
              }
            </h1>
          </header>
          <Tiptap key={currentNote?.id} content={currentNote?.content} onContentChange={changeContent}/>
        </article>
      </main>
    </div>
  );
}
