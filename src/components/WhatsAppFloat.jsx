import React from "react";

export default function WhatsAppFloat() {
  return (
    <a
      href="https://wa.me/442079460958"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      title="Chat on WhatsApp"
      className="fixed bottom-24 right-5 z-[60] inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_16px_35px_rgba(0,0,0,0.24)] transition-transform duration-300 hover:scale-105 hover:bg-[#1fb85a] sm:right-6 sm:h-16 sm:w-16 md:bottom-6"
    >
      <img
        src="https://cdn.simpleicons.org/whatsapp/ffffff"
        alt=""
        className="h-7 w-7 sm:h-8 sm:w-8"
      />
    </a>
  );
}
