import {useEffect, useRef} from "react";
import {sectionLabel} from "../utils/menuStyles.js";

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  onConfirm,
  onCancel,
}) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const handleCancel = (e) => {
    e.preventDefault();
    onCancel();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onCancel();
  };

  return (
    <dialog
      ref={dialogRef}
      onCancel={handleCancel}
      onClick={handleBackdropClick}
      aria-labelledby="confirm-title"
      aria-describedby="confirm-message"
      className="m-auto w-[calc(100%-2rem)] max-w-sm rounded-ui border border-line bg-white p-0 text-ink shadow-lg shadow-ink/10 backdrop:bg-ink/30"
    >
      <div className="p-5 md:p-6">
        <p className={`${sectionLabel} mb-3`}>Confirmación</p>
        <h2 id="confirm-title" className="mb-2 font-serif text-2xl font-medium tracking-tight text-ink">
          {title}
        </h2>
        <p id="confirm-message" className="text-sm leading-relaxed text-ink-soft">
          {message}
        </p>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="cursor-pointer rounded-ui border border-line px-4 py-2.5 text-[13px] font-medium text-ink-soft transition-colors hover:bg-ink/5 hover:text-ink md:px-3 md:py-1.5"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="cursor-pointer rounded-ui bg-ink px-4 py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-ink/85 md:px-3 md:py-1.5"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  );
}
