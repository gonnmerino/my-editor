import {Extension, ReactRenderer} from "@tiptap/react";
import Suggestion from "@tiptap/suggestion";
import {SlashMenu} from "../components/SlashMenu.jsx";

const ITEMS = [
  {
    title: "Título 1",
    icon: "H1",
    description: "Encabezado principal",
    command: ({editor, range}) => {
      editor.chain().focus().deleteRange(range).toggleHeading({level: 1}).run();
    },
  },
  {
    title: "Título 2",
    icon: "H2",
    description: "Subtítulo de la sección",
    command: ({editor, range}) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .toggleHeading({level: 2})
        .run();
    },
  },
  {
    title: "Negrita",
    icon: "B",
    description: "Texto en negrita",
    command: ({editor, range}) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .toggleBold()
        .run();
    },
  },
];

export const SlashCommand = Extension.create({
  name: "slashCommand",

  addOptions() {
    return {
      suggestion: {
        char: "/",

        command: ({editor, range, props}) => {
          props.command({editor, range});
        },

        items: ({query}) => {
          const q = query.toLowerCase();
          return ITEMS.filter(
            (item) =>
              item.title.toLowerCase().includes(q) ||
              item.description.toLowerCase().includes(q)
          );
        },

        render: () => {
          let component = null;
          let popup = null;

          const cleanup = () => {
            component?.destroy();
            popup?.remove();
            component = null;
            popup = null;
          };

          const updatePosition = (clientRect) => {
            const rect = clientRect?.();
            if (!rect || !popup) return;
            popup.style.top = `${rect.bottom + window.scrollY + 6}px`;
            popup.style.left = `${rect.left + window.scrollX}px`;
          };

          return {
            onStart: (props) => {
              component = new ReactRenderer(SlashMenu, {
                props,
                editor: props.editor,
              });

              popup = document.createElement("div");
              popup.style.position = "absolute";
              popup.style.zIndex = "999";
              popup.appendChild(component.element);
              document.body.appendChild(popup);

              updatePosition(props.clientRect);
            },

            onUpdate: (props) => {
              component?.updateProps(props);
              updatePosition(props.clientRect);
            },

            onKeyDown: (props) => {
              if (props.event.key === "Escape") {
                cleanup();
                return true;
              }
              return component?.ref?.onKeyDown(props) ?? false;
            },

            onExit: () => {
              cleanup();
            },
          };
        },
      },
    };
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ];
  },
});