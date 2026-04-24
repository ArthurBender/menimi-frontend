import type { PropsWithChildren, ReactNode } from "react";

interface ModalProps extends PropsWithChildren {
  title: string;
  onClose: () => void;
  headerActions?: ReactNode;
  footer?: ReactNode;
}

const Modal = ({ title, onClose, headerActions, footer, children }: ModalProps) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    onClick={onClose}
  >
    <div
      className="w-full max-w-md overflow-hidden rounded-xl shadow-xl"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between gap-3 bg-primary px-6 py-4">
        <h3 className="text-xl font-bold text-light">{title}</h3>
        {headerActions && <div className="flex items-center gap-2">{headerActions}</div>}
      </div>

      <div className="bg-background px-6 py-5">{children}</div>

      {footer && (
        <div className="flex items-center justify-center gap-3 bg-background px-6 py-4">
          {footer}
        </div>
      )}
    </div>
  </div>
);

export default Modal;
