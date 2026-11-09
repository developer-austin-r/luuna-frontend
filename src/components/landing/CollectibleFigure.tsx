type FigureVariant = "warrior" | "ninja" | "sunburst" | "web";

const palettes: Record<
  FigureVariant,
  { suit: string; hair: string; accent: string }
> = {
  warrior: { suit: "#25232b", hair: "#d7d6cf", accent: "#8c282e" },
  ninja: { suit: "#20252c", hair: "#13151a", accent: "#d94b36" },
  sunburst: { suit: "#e46a1d", hair: "#e1a63b", accent: "#2d2930" },
  web: { suit: "#24426a", hair: "#bd362f", accent: "#f0d24f" },
};

export default function CollectibleFigure({
  variant,
  className,
}: {
  variant: FigureVariant;
  className?: string | undefined;
}) {
  const colors = palettes[variant];

  return (
    <svg
      className={className}
      viewBox="0 0 260 300"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <ellipse cx="130" cy="278" rx="66" ry="12" fill="#08070b" opacity=".56" />
      <ellipse cx="130" cy="270" rx="58" ry="10" fill="#bc9cce" opacity=".2" />
      <path d="M79 258h42v16c0 5-4 8-9 8H86c-6 0-9-4-9-9z" fill="#19171d" />
      <path d="M139 258h42v16c0 5-4 8-9 8h-26c-5 0-8-4-8-9z" fill="#19171d" />
      <path d="M92 177h76l14 84h-41l-9-48-9 48H82z" fill={colors.suit} />
      <path
        d="M91 188 69 219l13 10 24-25m64-16 22 31-13 10-24-25"
        fill={colors.accent}
      />
      <path d="m104 178 26 20 26-20 15 18-41 28-41-28z" fill={colors.accent} />
      <path d="M108 196h44v10h-44z" fill="#d7c0db" opacity=".88" />
      <rect x="112" y="202" width="36" height="6" rx="3" fill="#22152c" />
      <path
        d="M130 151c-21 0-36 15-36 35h72c0-20-15-35-36-35"
        fill={colors.suit}
      />
      <path
        d="M93 78c0-31 16-48 38-48 26 0 41 19 41 49v40c0 25-16 43-41 43s-40-18-40-43z"
        fill="#dca77e"
      />
      <path
        d={
          variant === "warrior"
            ? "M91 98 74 62l24 11 5-40 21 28 16-34 12 40 24-23-5 54-13-13-4 29H93z"
            : variant === "sunburst"
              ? "M91 100 73 62l23 12 5-38 23 26 17-31 12 37 25-20-4 54-13-12-4 31H92z"
              : variant === "web"
                ? "M91 102 75 66l28 9 5-32 19 24 22-27 4 37 22-12-12 47-11-18-6 24H96z"
                : "M93 96 79 64l22 10 8-35 18 25 16-27 12 34 20-18-6 48-15-11-4 27H95z"
        }
        fill={colors.hair}
      />
      <path
        d="M101 115q10-7 20 0m19 0q10-7 20 0"
        stroke="#292028"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <circle cx="112" cy="119" r="3" fill="#28202a" />
      <circle cx="148" cy="119" r="3" fill="#28202a" />
      <path
        d="M121 139q9 8 18 0"
        stroke="#824d4b"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {variant === "web" && (
        <path
          d="m101 111 14 11m44-11-14 11m-36-25 20 11m36-11-20 11m-19-29v31m16-31v31"
          stroke="#f0d24f"
          strokeWidth="1.5"
          opacity=".85"
        />
      )}
      {variant === "warrior" && (
        <path
          d="M163 155c39 16 48 42 48 72-19-9-30-17-44-35"
          fill="#4f2932"
          opacity=".8"
        />
      )}
      <path
        d="M77 279h45m17 0h44"
        stroke="#d8b6e6"
        strokeWidth="3"
        strokeLinecap="round"
        opacity=".7"
      />
    </svg>
  );
}
