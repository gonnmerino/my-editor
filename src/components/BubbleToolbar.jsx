import {BubbleMenu} from "@tiptap/react/menus";
import {menuSurface, menuItem, menuItemActive, menuIcon} from "../utils/menuStyles.js";

const buttons = [
  {label: "B", name: "bold", action: (editor) => editor.chain().focus().toggleBold().run()},
  {label: "I", name: "italic", action: (editor) => editor.chain().focus().toggleItalic().run()},
  {label: "H", name: "highlight", action: (editor) => editor.chain().focus().toggleHighlight().run()},
];

export const BubbleToolbar = ({editor}) => {
  if (!editor) return null;

  return (
    <BubbleMenu editor={editor} className={`${menuSurface} flex items-center gap-0.5`}>
      {buttons.map((btn) => {
        const active = editor.isActive(btn.name);

        return (
          <button
            key={btn.label}
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              btn.action(editor);
            }}
            className={`${menuItem} ${active ? menuItemActive : ""}`}
          >
            <span className={menuIcon}>{btn.label}</span>
          </button>
        );
      })}
    </BubbleMenu>
  );
};