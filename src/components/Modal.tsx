import { Dialog, DialogPanel, DialogBackdrop } from '@headlessui/react';
import React from 'react';

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}
export default function Modal({ open, onClose, children }: DialogProps) {
  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      {/* Dark backdrop with fade transition */}
      <DialogBackdrop transition className="fixed inset-0 bg-black/50 data-[closed]:opacity-0" />

      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel
          transition
          className="bg-[var(--background)] max-w-lg space-y-4 rounded-sm border p-4 relative z-10 duration-300 ease-out data-[closed]:opacity-0 data-[closed]:scale-95">
          {children}
        </DialogPanel>
      </div>
    </Dialog>
  );
}
