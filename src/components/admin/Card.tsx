import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  extra?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  title,
  extra,
}) => {
  return (
    <div
      className={`bg-white rounded-xl border border-border-custom shadow-xs overflow-hidden ${className}`}
    >
      {title || extra ? (
        <div className="px-6 py-4 border-b border-border-custom flex items-center justify-between">
          {title && (
            <h3 className="text-base font-semibold text-text-custom">
              {title}
            </h3>
          )}
          {extra && <div>{extra}</div>}
        </div>
      ) : null}
      <div className="p-6">{children}</div>
    </div>
  );
};
