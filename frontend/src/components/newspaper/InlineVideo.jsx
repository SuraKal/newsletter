import React, { useState } from "react";
import { toVideoEmbed } from "@/lib/article-video";

export default function InlineVideo({ video, className = "", label = "" }) {
  const shared = toVideoEmbed(video);
  const [playing, setPlaying] = useState(false);
  if (!shared) return null;

  const play = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setPlaying(true);
  };

  if (shared.type === "file") {
    return (
      <video
        className={`h-full w-full object-cover ${className}`}
        controls
        playsInline
        preload="metadata"
        src={shared.src}
        aria-label={label}
      />
    );
  }

  if (playing) {
    return (
      <iframe
        className={`h-full w-full ${className}`}
        src={shared.embedSrc}
        title={label || "Article video"}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    );
  }

  return (
    <button
      type="button"
      onClick={play}
      className="group relative block h-full w-full cursor-pointer overflow-hidden bg-stone-950 text-left"
      aria-label={`Play ${label || "video"}`}
    >
      {shared.thumbnail ? (
        <img
          src={shared.thumbnail}
          alt=""
          loading="lazy"
          className={`h-full w-full object-cover ${className}`}
        />
      ) : null}
      <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/20 transition-colors group-hover:bg-black/35">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-stone-900 shadow-md sm:h-11 sm:w-11">
          <svg viewBox="0 0 24 24" fill="currentColor" className="ml-0.5 h-5 w-5" aria-hidden="true">
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      </span>
    </button>
  );
}