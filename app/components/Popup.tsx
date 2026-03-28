"use client";

import { useState } from "react";

export default function Popup() {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) return null;

  //chen link shoppee
  const openNewTab = () => {
    window.open("https://www.youtube.com", "_blank");
  }

  const closeDialog = () => {
    setIsOpen(false)
    openNewTab();
  }



  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="relative bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
        <button
          onClick={closeDialog}
          className="absolute top-3 right-3 flex items-center justify-center w-8 h-8 rounded-full bg-red-600 text-white font-bold text-lg leading-none hover:bg-red-700 transition-colors"
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-xl font-semibold mb-2">Welcome</h2>
        {/* Duc change this code for popup message */}
        <p className="text-gray-600">This message appears every time the page loads.</p>
      </div>
    </div>
  );
}
