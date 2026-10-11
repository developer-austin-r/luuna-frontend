"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Lock, CheckCircle2, AlertCircle, ChevronLeft, Eye, EyeOff } from "lucide-react";
import { AccountMenu } from "@/components/profile/AccountMenu/AccountMenu";
import { ProfileHeader } from "@/components/profile/ProfileHeader/ProfileHeader";
import { ProfileActions } from "@/components/profile/ProfileActions/ProfileActions";
import Navbar from "@/components/landing/Navbar/Navbar";
import Footer from "@/components/landing/Footer/Footer";
import LoginOfferBar from "@/components/landing/LoginOfferBar/LoginOfferBar";

const PasswordInput = ({ 
  label, 
  name, 
  value, 
  onChange, 
  error,
  placeholder 
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error: string;
  placeholder: string;
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = `profile-input-${name}`;

  return (
    <div className="flex flex-col w-full">
      <label htmlFor={inputId} className="block text-xs font-semibold text-gray-700 mb-1.5 ml-1">
        {label}
      </label>
      <div className="relative flex items-center w-full">
        <div className="absolute left-3.5 text-gray-400 pointer-events-none flex items-center justify-center">
          <Lock size={16} />
        </div>
        <input
          id={inputId}
          type={showPassword ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full bg-[#fdfcff] border border-gray-200 text-sm rounded-xl py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#6B21A8] focus:ring-1 focus:ring-[#6B21A8] transition-colors pl-10 pr-10 ${error ? "border-red-500" : ""}`}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 text-gray-400 hover:text-gray-600 focus:outline-none flex items-center justify-center"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {error && (
        <span className="text-xs text-red-500 mt-1.5 ml-1 block">
          {error}
        </span>
      )}
    </div>
  );
};

export default function ChangePasswordPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [errors, setErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "" }));
    if (statusMessage) setStatusMessage(null);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    setStatusMessage(null);
    
    // Client-side validation
    let isValid = true;
    const newErrors = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    };

    if (!formData.currentPassword) {
      newErrors.currentPassword = "Current Password is required.";
      isValid = false;
    }
    if (!formData.newPassword) {
      newErrors.newPassword = "New Password is required.";
      isValid = false;
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters long.";
      isValid = false;
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm New Password is required.";
      isValid = false;
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
      isValid = false;
    }

    if (!isValid) {
      setErrors(newErrors);
      setIsSaving(false);
      return;
    }

    // Simulate API call for password change
    setTimeout(() => {
      setIsSaving(false);
      // Backend integration note: Real password change submission requires backend API integration.
      // This is purely a frontend validation simulation.
      setStatusMessage({ type: 'success', text: "Password verified successfully!" });
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    }, 1000);
  };

  const handleCancel = () => {
    setFormData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
    setErrors({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
    setStatusMessage(null);
  };

  const handleLogout = () => {
    console.log("Logging out...");
  };

  return (
    <>
      <LoginOfferBar />
      <Navbar />
      
      <div className="min-h-screen bg-gradient-to-b from-[#2a1740] via-[#755494] to-[#E9D5FF] pb-16 pt-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto mb-6">
          <Link href="/" className="inline-flex items-center text-sm font-semibold text-white hover:text-[#E9D5FF] transition-colors">
            <ChevronLeft size={16} className="mr-1" />
            Back to Home
          </Link>
        </div>

        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6">
          
          {/* Left Sidebar Navigation */}
          <div className="w-full md:w-72 shrink-0">
            <h2 className="text-xl font-bold text-white mb-4 px-1 tracking-tight">Manage My Account</h2>
            <AccountMenu onLogout={handleLogout} />
          </div>

          {/* Right Main Content area */}
          <div className="flex-1 bg-white rounded-3xl shadow-2xl p-6 sm:p-8">
            <div className="mb-6">
              <ProfileHeader 
                title="Change Password" 
                subtitle="Update your password to keep your account secure." 
              />
            </div>

            {statusMessage && (
              <div className={`mb-6 p-3 rounded-xl flex items-center gap-3 text-sm font-semibold ${
                statusMessage.type === 'success' 
                  ? 'bg-green-50 text-green-700 border border-green-200' 
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {statusMessage.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                {statusMessage.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-lg">
              
              <PasswordInput
                label="Current Password"
                name="currentPassword"
                placeholder="Enter current password"
                value={formData.currentPassword}
                onChange={handleInputChange}
                error={errors.currentPassword}
              />
              
              <PasswordInput
                label="New Password"
                name="newPassword"
                placeholder="Enter new password"
                value={formData.newPassword}
                onChange={handleInputChange}
                error={errors.newPassword}
              />
              
              <PasswordInput
                label="Confirm New Password"
                name="confirmPassword"
                placeholder="Confirm new password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                error={errors.confirmPassword}
              />

              {/* Action Buttons */}
              <div className="pt-4 border-t border-gray-100 mt-4">
                <ProfileActions 
                  onCancel={handleCancel}
                  onSave={handleSubmit}
                  isSaving={isSaving} 
                  cancelLabel="Cancel"
                  saveLabel="Save Changes"
                />
              </div>
            </form>
          </div>
          
        </div>
      </div>
      <Footer />
    </>
  );
}
