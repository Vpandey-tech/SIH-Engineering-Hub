import React from "react";

interface Props {
  url: string;           // normal Google Drive share link
  onClose: () => void;   // to close the viewer
}

export default function DriveEmbed({ url, onClose }: Props) {
  // convert any Google Drive link to an embeddable preview URL
  const toEmbed = (link: string) => {
    const file = link.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (file) return `https://drive.google.com/file/d/${file[1]}/preview`;

    const folder = link.match(/\/folders\/([a-zA-Z0-9_-]+)/);
    if (folder) return `https://drive.google.com/embeddedfolderview?id=${folder[1]}#grid`;

    return link;
  };

  return (
    <div className="relative border rounded-lg overflow-hidden mt-6">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 bg-white/70 dark:bg-slate-700/70 rounded-full p-1"
      >
        ✕
      </button>
      <iframe
        src={toEmbed(url)}
        width="100%"
        height="600"
        style={{ border: "none" }}
        allow="autoplay"
        title="Drive Resource"
      />
    </div>
  );
}
