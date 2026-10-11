import React from "react";

export interface ProfileActionsProps {
  onCancel?: () => void;
  onSave?: () => void;
  isSaving?: boolean;
  cancelLabel?: string;
  saveLabel?: string;
  className?: string;
}

export const ProfileActions: React.FC<ProfileActionsProps> = ({
  onCancel,
  onSave,
  isSaving = false,
  cancelLabel = "Cancel",
  saveLabel = "Save Changes",
  className = "",
}) => {
  return (
    <div className={`flex flex-col-reverse sm:flex-row items-center justify-end gap-4 mt-8 ${className}`}>
      <button
        type="button"
        onClick={onCancel}
        disabled={isSaving}
        className="w-full sm:w-auto px-4 py-2 text-sm font-semibold text-gray-500 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
      >
        {cancelLabel}
      </button>
      <button
        type="button"
        onClick={onSave}
        disabled={isSaving}
        className="w-full sm:w-auto px-8 py-2 rounded-full border border-transparent text-sm font-semibold text-white bg-[#4C1D95] hover:bg-[#3B0764] shadow-sm disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center min-w-[140px]"
      >
        {isSaving ? (
          <>
            <svg 
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Saving...
          </>
        ) : (
          saveLabel
        )}
      </button>
    </div>
  );
};
