import {useEffect, useState} from "react";
import {useEditorState} from "@tiptap/react";
import {BubbleMenu} from "@tiptap/react/menus";
import {menuSurface, menuItem, menuItemActive, menuIcon, menuTitle, sectionLabel} from "../utils/menuStyles.js";
import {ITEMS} from "../utils/slashCommand.js";

const BLOCK_ITEMS = ITEMS.filter((item) => item.group !== "Formato");

const INLINE = [
  {name: "bold", title: "Negrita", label: "B", style: "font-bold", run: (c) => c.toggleBold()},
  {name: "italic", title: "Cursiva", label: "I", style: "font-serif italic", run: (c) => c.toggleItalic()},
  {name: "strike", title: "Tachado", label: "S", style: "line-through", run: (c) => c.toggleStrike()},
  {name: "code", title: "Código", label: "<>", style: "font-mono text-[11px]", run: (c) => c.toggleCode()},
  {name: "highlight", title: "Resaltado", label: "H", style: "", run: (c) => c.toggleHighlight()},
];

const currentBlock = (editor) => {
  for (let level = 1; level <= 3; level++) {
    if (editor.isActive("heading", {level})) return `Título ${level}`;
  }
  if (editor.isActive("bulletList")) return "Lista en puntos";
  if (editor.isActive("orderedList")) return "Lista numerada";
  if (editor.isActive("taskList")) return "Lista de tareas";
  if (editor.isActive("blockquote")) return "Cita";
  if (editor.isActive("codeBlock")) return "Código";
  return "Texto";
};

const iconButton = "inline-flex h-7 min-w-7 cursor-pointer pointer-coarse:h-9 pointer-coarse:min-w-9 items-center justify-center rounded-ui-sm px-1.5 text-[13px] transition-colors hover:bg-ink/5";

export const BubbleToolbar = ({editor}) => {
    const [open, setOpen] = useState(false);

    const state = useEditorState({
      editor,
      selector: ({editor}) => {
        if (!editor) return null;
        return {
          block: currentBlock(editor),
          bold: editor.isActive("bold"),
          italic: editor.isActive("italic"),
          strike: editor.isActive("strike"),
          code: editor.isActive("code"),
          highlight: editor.isActive("highlight"),
        };
      },
    });

    useEffect(() => {
      if (!editor) return;
      const close = () => setOpen(false);
      editor.on("selectionUpdate", close);
      return () => editor.off("selectionUpdate", close);
    }, [editor]);

    if (!editor || !state) return null;

    const applyBlock = (item) => {
      const {from} = editor.state.selection;
      item.command({editor, range: {from: from, to: from}});
    };

    const keepFocus = (e) => e.preventDefault();

    return (
      <BubbleMenu editor={editor} className={`${menuSurface} relative flex items-center gap-0.5`}>
        <button
          type="button"
          onMouseDown={(e) => {
            keepFocus(e);
            setOpen(!open);
          }}
          className={`${iconButton} gap-1.5 px-2 text-ink`}
        >
          {state.block}
          <span aria-hidden="true" className="text-[9px] text-ink-faint">▾</span>
        </button>

        <span aria-hidden="true" className="mx-1 h-4 w-px bg-line"/>

        {INLINE.map((btn) => (
          <button
            key={btn.name}
            type="button"
            title={btn.title}
            aria-label={btn.title}
            aria-pressed={state[btn.name]}
            onMouseDown={(e) => {
              keepFocus(e);
              btn.run(editor.chain().focus()).run();
            }}
            className={`${iconButton} ${btn.style} ${state[btn.name] ? "bg-ink/[0.08] text-ink" : "text-ink-soft"}`}
          >
            {btn.label}
          </button>
        ))}

        {open && (
          <div className={`${menuSurface} scroll-soft absolute left-0 top-full mt-1.5 max-h-64 w-52 overflow-y-auto`}>
            {BLOCK_ITEMS.map((item, index) => (
              <div key={item.title}>
                {(index === 0 || BLOCK_ITEMS[index - 1].group !== item.group) && (
                  <p className={`${sectionLabel} px-2 pb-1 pt-1.5`}>{item.group}</p>
                )}
                <button
                  type="button"
                  onMouseDown={(e) => {
                    keepFocus(e);
                    applyBlock(item);
                    setOpen(false);
                  }}
                  className={`${menuItem} w-full hover:bg-ink/5 ${item.title === state.block ? menuItemActive : ""}`}
                >
                  <span className={menuIcon}>{item.icon}</span>
                  <span className={menuTitle}>{item.title}</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </BubbleMenu>
    )};
