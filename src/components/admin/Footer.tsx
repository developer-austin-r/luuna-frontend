import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="py-4 px-6 border-t border-border-custom bg-white text-center text-text-custom/50 text-2xs font-medium">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
        <p>© {new Date().getFullYear()} Luuna Inc. All rights reserved.</p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-primary transition-colors">Help Center</a>
        </div>
      </div>
    </footer>
  );
};
