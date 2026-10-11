import React from "react";
import Link from "next/link";

export const LoginOfferBar: React.FC = () => {
  return (
    <div className="w-full bg-white text-gray-900 px-4 py-1.5 text-xs sm:text-sm font-medium z-50 relative border-b border-gray-100">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-center">
        <span className="tracking-wide">
          Log In & Unlock Your Exclusive Offer! - <span className="font-bold text-gray-900">10% OFF</span>
        </span>
        <Link 
          href="/login" 
          className="inline-flex items-center justify-center font-bold underline decoration-gray-400 hover:decoration-gray-900 underline-offset-2 transition-all duration-200 ml-1"
        >
          Login Now
        </Link>
      </div>
    </div>
  );
};

export default LoginOfferBar;
