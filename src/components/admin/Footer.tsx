import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="py-4 px-6 border-t border-border-custom bg-white text-center text-text-custom/50 text-2xs font-medium">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
        <p>© {new Date().getFullYear()} Luuna Inc. All rights reserved.</p>
      </div>
    </footer>
  );
};
