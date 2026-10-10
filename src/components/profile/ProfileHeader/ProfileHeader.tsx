import React from "react";

export interface ProfileHeaderProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  title = "Edit Your Profile",
  subtitle = "Update your personal information and account details",
  className = "",
}) => {
  return (
    <div className={`flex flex-col gap-1 mb-4 ${className}`}>
      <h2 className="text-xl font-bold text-gray-900 tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-sm text-gray-500">
          {subtitle}
        </p>
      )}
    </div>
  );
};
