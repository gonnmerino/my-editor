import {sectionLabel} from "../utils/menuStyles.js";
import Tiptap from "../Tiptap.jsx";

export default function NoteView({currentNote, changeName, changeContent}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <header className="flex h-12 shrink-0 items-center gap-4 border-b border-line px-7 text-[12.5px] text-ink-soft">
        <nav aria-label="Ruta de la página">
          <ol className="flex items-center gap-2">
            <li>Universidad</li>
            <li aria-hidden="true" className="text-ink-faint">/</li>
            <li aria-current="page" className="font-medium text-ink">Parcial 1</li>
          </ol>
        </nav>

        <div className="ml-auto flex items-center gap-4">
          <p>Guardado</p>
          <button
            type="button"
            className="rounded-ui bg-ink px-3 py-1.5 text-[12.5px] font-medium text-white transition-colors hover:bg-ink/85"
          >
            Compartir
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        <article className="mx-auto w-full max-w-[42.5rem] px-6 pb-32 pt-14">
          <header className="mb-6">
            <p className={`${sectionLabel} mb-3.5`}>{currentNote ? "Nota" : ""}</p>
            <h1 className="font-serif text-[3.125rem] font-medium leading-[1.05] tracking-[-0.025em] text-ink">
              {currentNote ? (
              <input
                className="border-none outline-none"
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
