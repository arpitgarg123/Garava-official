import React, { useState } from 'react'

import { FaFacebookF, FaLinkedinIn,FaPinterestP,FaWhatsapp  } from "react-icons/fa";


const ShareButton = ({ title, url })=> {
  const [copied, setCopied] = useState(false);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const buttons = [
    {
      label: <FaFacebookF />,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: "bg-blue-600 text-white",
    },
    {
      label: <FaLinkedinIn />,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      color: "bg-blue-700 text-white",
    },
    {
      label: <FaPinterestP/>,
      href: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedTitle}`,
      color: "bg-red-600 text-white",
    },
    {
      label: <FaWhatsapp />,
      href: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
      color: "bg-green-600 text-white",
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-3">
      {buttons.map((btn, i) => (
        <a
          key={i}
          aria-label={btn.label}
          href={btn.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex h-10 w-10 items-center justify-center rounded-full ${btn.color} hover:opacity-90`}
        >
          <span className="text-xl font-bold">{btn.label}</span>
        </a>
      ))}

      <button
        type="button"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          } catch (e) {}
        }}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-500 text-white hover:opacity-90"
      >
        <span>{copied ? "✔" : "⧉"}</span>
      </button>
    </div>
  );
}

export default ShareButton