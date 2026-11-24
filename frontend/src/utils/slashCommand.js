import {Extension, ReactRenderer} from "@tiptap/react";
import Suggestion from "@tiptap/suggestion";
import {SlashMenu} from "../components/SlashMenu.jsx";

const cmd = (accion) => ({editor, range}) =>
  accion(editor.chain().focus().deleteRange(range)).run();

export const ITEMS = [
  {
    group: "Texto", title: "Texto", icon: "¶", description: "Párrafo normal",
    command: cmd((c) => c.setParagraph())
  },

  {
    group: "Encabezados", title: "Título 1", icon: "H1", description: "Encabezado principal",
    command: cmd((c) => c.toggleHeading({level: 1}))
  },
  {
    group: "Encabezados", title: "Título 2", icon: "H2", description: "Subtítulo de la sección",
    command: cmd((c) => c.toggleHeading({level: 2}))
  },
  {
    group: "Encabezados", title: "Título 3", icon: "H3", description: "Encabezado pequeño",
    command: cmd((c) => c.toggleHeading({level: 3}))
  },

  {
    group: "Listas", title: "Lista en puntos", icon: "•", description: "Lista con viñetas",
    command: cmd((c) => c.toggleBulletList())
  },
  {
    group: "Listas", title: "Lista numerada", icon: "1.", description: "Lista ordenada",
    command: cmd((c) => c.toggleOrderedList())
  },
  {
    group: "Listas", title: "Lista de tareas", icon: "☐", description: "Lista con casillas",
    command: cmd((c) => c.toggleTaskList())
  },

  {
    group: "Bloques", title: "Cita", icon: "❝", description: "Texto citado",
    command: cmd((c) => c.toggleBlockquote())
  },
  {
    group: "Bloques", title: "Código", icon: "</>", description: "Bloque de código",
    command: cmd((c) => c.toggleCodeBlock())
  },
  {
    group: "Bloques", title: "Separador", icon: "—", description: "Línea horizontal",
    command: cmd((c) => c.setHorizontalRule())
  },

  {
    group: "Formato", title: "Negrita", icon: "B", description: "Texto en negrita",
    command: cmd((c) => c.toggleBold())
  },
  {
    group: "Formato", title: "Cursiva", icon: "I", description: "Texto en cursiva",
    command: cmd((c) => c.toggleItalic())
  },
  {
    group: "Formato", title: "Tachado", icon: "S", description: "Texto tachado",
    command: cmd((c) => c.toggleStrike())
  },
  {
    group: "Formato", title: "Resaltado", icon: "H", description: "Marcar texto",
    command: cmd((c) => c.toggleHighlight())
  },
  {
    group: "Formato", title: "Código en línea", icon: "<>", description: "Fragmento de código",
    command: cmd((c) => c.toggleCode())
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
              item.description.toLowerCase().includes(q) ||
              item.group.toLowerCase().includes(q)
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
            const gap = 6;
            const margin = 8;
            const viewport = window.visualViewport;
            const viewWidth = viewport?.width ?? window.innerWidth;
            const viewTop = viewport?.offsetTop ?? 0;
            const viewBottom = viewTop + (viewport?.height ?? window.innerHeight);
            const {offsetWidth, offsetHeight} = popup;
            const spaceBelow = viewBottom - rect.bottom - gap;
            const spaceAbove = rect.top - viewTop - gap;
            const placeAbove = spaceBelow < offsetHeight && spaceAbove > spaceBelow;
            const top = placeAbove ? rect.top - offsetHeight - gap : rect.bottom + gap;
            const maxLeft = Math.max(margin, viewWidth - offsetWidth - margin);
            const left = Math.min(Math.max(rect.left, margin), maxLeft);
            popup.style.top = `${top + window.scrollY}px`;
            popup.style.left = `${left + window.scrollX}px`;
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
