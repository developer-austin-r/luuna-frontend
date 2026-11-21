import React from "react";

export const BatmanBanner: React.FC = () => {
  return (
    <div className="w-full bg-white border-b border-gray-200 shadow-xs">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8 py-2 sm:py-3 md:py-3.5">
        {/* Brand Name with stylized red A */}
        <div className="flex items-center min-w-0">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-[0.15em] sm:tracking-[0.25em] md:tracking-[0.3em] text-black select-none truncate">
            B<span className="text-[#E5252A]">A</span>TMAN
          </h1>
        </div>

        {/* Batman Cowl & Bust Graphic */}
        <div className="flex items-center justify-end shrink-0 pl-2">
          <svg
            className="h-10 sm:h-14 md:h-18 lg:h-20 w-auto object-contain shrink-0"
            viewBox="0 0 160 140"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="Batman Character"
            role="img"
          >
            {/* Batman Head, Mask & Winged Cape Silhouette */}
            <path
              d="M80 32
                 C88 32 94 33 97 35
                 L102 6
                 L107 42
                 C110 52 111 65 108 78
                 L134 88
                 C148 94 154 103 150 110
                 C138 105 127 112 121 120
                 C111 112 102 117 96 122
                 L80 122
                 L64 122
                 C58 117 49 112 39 120
                 C33 112 22 105 10 110
                 C6 103 12 94 26 88
                 L52 78
                 C49 65 50 52 53 42
                 L58 6
                 L63 35
                 C66 33 72 32 80 32 Z"
              fill="#0A0A0E"
            />
            {/* Angular White Cowl Eyes */}
            <polygon points="68,60 76,64 75,67 66,64" fill="#FFFFFF" />
            <polygon points="92,60 84,64 85,67 94,64" fill="#FFFFFF" />
            {/* Cowl Nose Ridge & Brow Accents */}
            <path
              d="M80 56 L80 72 M76 58 L80 61 L84 58"
              stroke="#FFFFFF"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Cowl Face / Chin Opening */}
            <path d="M73 78 L87 78 L85 93 L80 97 L75 93 Z" fill="#FFFFFF" />
            {/* Mouth Line & Shadow */}
            <path
              d="M76 86 L84 86 M78 91 L82 91"
              stroke="#0A0A0E"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default BatmanBanner;
