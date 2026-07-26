import React from "react";

interface AvatarProps {
  name: string;
  src?: string | undefined;
  size?: "sm" | "md" | "lg" | undefined;
  className?: string | undefined;
}

export const Avatar: React.FC<AvatarProps> = ({
  name,
  src,
  size = "md",
  className = "",
}) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-14 h-14 text-lg",
  };

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`rounded-full object-cover border border-border-custom bg-bg-secondary shrink-0 ${sizeClasses[size]} ${className}`}
        onError={(e) => {
          // If image fails to load, clear src to fallback to initials
          (e.target as HTMLImageElement).src = "";
        }}
      />
    );
  }

  return (
    <div
      className={`rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center border border-primary/20 uppercase shrink-0 ${sizeClasses[size]} ${className}`}
    >
      {initials}
    </div>
  );
};
