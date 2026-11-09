import React from "react";
import Link from "next/link";

export const LoginOfferBar: React.FC = () => {
  return (
    <div className="relative z-50 w-full border-b border-gray-100 bg-white px-3 py-1 text-gray-900">
      <div className="mx-auto flex max-w-7xl flex-row flex-wrap items-center justify-center gap-x-2 text-center text-[10px] font-medium leading-4 sm:text-xs">
        <span className="tracking-wide">
          Log in & Unlock Your Exclusive Offer! -{" "}
          <span className="font-bold text-gray-900">10% OFF</span>
        </span>
        <Link
          href="/login"
          className="inline-flex items-center justify-center font-bold underline decoration-gray-400 underline-offset-2 transition-all duration-200 hover:decoration-gray-900"
        >
          Login Now
        </Link>
      </div>
    </div>
  );
};

export default LoginOfferBar;
