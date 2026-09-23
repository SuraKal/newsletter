const YOUTUBE_RE =
  /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/|v\/)|youtu\.be\/)([\w-]{11})/;

const FILE_RE = /\.(mp4|webm|ogv|ogg|m4v|mov)(\?.*)?$/i;

function resolveString(value) {
  const match = value.match(YOUTUBE_RE);
  if (match) {
    const id = match[1];
    return {
      type: "youtube",
      id,
      embedSrc: `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`,
      thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
    };
  }
  if (FILE_RE.test(value) || value.startsWith("data:video/")) {
    return { type: "file", src: value, thumbnail: null };
  }
  return null;
}

export function toVideoEmbed(video) {
  if (!video) return null;
  if (typeof video === "string") return resolveString(video.trim());
  if (typeof video === "object") {
    const value = video.embedSrc || video.src || video.url || "";
    if (typeof value !== "string" || !value.trim()) return null;
    return resolveString(value.trim());
  }
  return null;
}