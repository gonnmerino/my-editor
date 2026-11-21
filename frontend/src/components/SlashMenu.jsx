import {forwardRef, useEffect, useImperativeHandle, useRef, useState} from "react";
import {menuDescription, menuIcon, menuItem, menuItemActive, menuSurface, menuTitle, sectionLabel} from "../utils/menuStyles.js";

export const SlashMenu = forwardRef((props, ref) => {

  const [selectedIndex, setSelectedIndex] = useState(0);
  const listRef = useRef(null);

  const selectItem = (index) => {
    const item = props.items[index]
    if (item) {
      props.command(item);
    }
  }

  useEffect(() => {
    setSelectedIndex(0);
  }, [props.items]);

  useEffect(() => {
    listRef.current
      ?.querySelector('[data-selected="true"]')
      ?.scrollIntoView({block: "nearest"});
  }, [selectedIndex]);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({event}) => {
      if (!props.items.length) return false;

      if (event.key === "ArrowUp") {
        setSelectedIndex((selectedIndex - 1 + props.items.length) % props.items.length);
        return true;
      }
      if (event.key === "ArrowDown") {
        setSelectedIndex((selectedIndex + 1) % props.items.length);
        return true;
      }
      if (event.key === "Enter") {
        selectItem(selectedIndex);
        return true;
      }
      return false;
    },
  }));

  return (
    <div
      ref={listRef}
      className={`${menuSurface} scroll-soft flex w-56 max-h-64 flex-col overflow-y-auto`}
    >
      {props.items.length ? (
        props.items.map((item, index) => {
          const isSelected = index === selectedIndex;
          const showGroup = index === 0 || props.items[index - 1].group !== item.group;

          return (
            <div key={index}>
              {showGroup && (
                <p className={`${sectionLabel} px-2 pb-1 pt-1.5`}>{item.group}</p>
              )}
              <button
                type="button"
                data-selected={isSelected}
                onMouseDown={(e) => {
                  e.preventDefault();
                  selectItem(index);
                }}
                onMouseEnter={() => setSelectedIndex(index)}
                className={`${menuItem} w-full ${isSelected ? menuItemActive : ""}`}
              >
                <span className={menuIcon}>{item.icon}</span>
                <span className="flex flex-col">
                  <span className={menuTitle}>{item.title}</span>
                  <span className={menuDescription}>{item.description}</span>
                </span>
              </button>
            </div>
          );
        })
      ) : (
        <div className="px-3 py-4 text-center text-xs text-neutral-400">
          No hay comandos que coincidan
        </div>
      )}
    </div>
  );
});
