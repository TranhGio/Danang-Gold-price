"use client";

import { useState } from "react";
import { POPUP_CONFIG } from "../data/popup";

export default function Popup() {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) return null;

  const closeDialog = () => {
    setIsOpen(false);
    window.location.href = POPUP_CONFIG.redirectUrl;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
        <div className="bg-[#C41E3A] px-6 py-4 flex items-center justify-between">
          <span className="text-white font-semibold text-lg">Thông báo</span>
          <button
            onClick={closeDialog}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-white/20 text-white text-xl leading-none hover:bg-white/30 transition-colors"
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        <div className="px-6 py-6">
          <p className="text-gray-700 font-medium text-base leading-relaxed">
            {POPUP_CONFIG.message}
          </p>
        </div>
      </div>
    </div>
  );
}
