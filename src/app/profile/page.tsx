"use client";

import React, { useState } from "react";
import Link from "next/link";
import { User, Mail, Phone, MapPin, Calendar, Camera, CheckCircle2, AlertCircle, ChevronLeft } from "lucide-react";
import { AccountMenu } from "@/components/profile/AccountMenu/AccountMenu";
import { ProfileHeader } from "@/components/profile/ProfileHeader/ProfileHeader";
import { ProfileInput } from "@/components/profile/ProfileInput/ProfileInput";
import { ProfileSelect } from "@/components/profile/ProfileSelect/ProfileSelect";
import { ProfileActions } from "@/components/profile/ProfileActions/ProfileActions";
import Navbar from "@/components/landing/Navbar/Navbar";
import Footer from "@/components/landing/Footer/Footer";
import LoginOfferBar from "@/components/landing/LoginOfferBar/LoginOfferBar";

export default function ProfilePage() {
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Define initial data state to support reverting changes on Cancel
  const initialData = {
    firstName: "John",
    lastName: "Doe",
    mobile: "+1 234 567 890",
    email: "john.doe@example.com",
    dob: "1990-01-01",
    gender: "male",
    address: "123 Main Street, Apt 4B",
    district: "Manhattan",
    pincode: "10001",
    state: "NY"
  };

  // Profile Data State
  const [formData, setFormData] = useState({ ...initialData });

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (statusMessage) setStatusMessage(null); // Clear messages on edit
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAvatarPreview(imageUrl);
      if (statusMessage) setStatusMessage(null);
    }
  };

  // Form submission handler (placeholder for now, ready for API integration)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusMessage(null);
    
    // Simulate API call to user profile endpoint (Endpoint missing, identified as needed)
    setTimeout(() => {
      // Basic client-side validation simulation
      if (!formData.firstName || !formData.lastName || !formData.email) {
        setIsSaving(false);
        setStatusMessage({ type: 'error', text: "Please fill in all required fields." });
        return;
      }

      setIsSaving(false);
      setStatusMessage({ type: 'success', text: "Profile updated successfully!" });
    }, 1500);
  };

  const handleCancel = () => {
    // Reset to initial values and clear UI states
    setFormData({ ...initialData });
    setStatusMessage(null);
    setAvatarPreview(null);
  };

  const handleLogout = () => {
    // Placeholder for actual logout logic (Auth API)
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
            <div className="flex justify-between items-start mb-6">
              <ProfileHeader 
                title="Edit Your Profile" 
                subtitle="Update your personal information and account details" 
              />
              
              {/* Avatar Section at Top Right */}
              <div className="relative shrink-0 ml-4">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gray-50 flex items-center justify-center overflow-hidden border-2 border-white shadow-md">
                  <img 
                    src={avatarPreview || "/images/recommendation-toy.png"} 
                    alt="Profile preview" 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <label 
                  htmlFor="avatar-upload" 
                  className="absolute bottom-1 right-1 p-1.5 bg-[#6B21A8] rounded-full text-white cursor-pointer hover:bg-[#4C1D95] transition-colors shadow-lg border-2 border-white"
                >
                  <Camera size={14} />
                  <input 
                    id="avatar-upload" 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleImageChange}
                  />
                </label>
              </div>
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

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              
              {/* Row 1: First Name | Last Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ProfileInput 
                  label="First Name" 
                  name="firstName"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  icon={<User size={16} />}
                  required
                />
                <ProfileInput 
                  label="Last Name" 
                  name="lastName"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  icon={<User size={16} />}
                  required
                />
              </div>

              {/* Row 2: Mobile Number | Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ProfileInput 
                  label="Mobile Number" 
                  name="mobile"
                  type="tel"
                  placeholder="+1 234 567 890"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  icon={<Phone size={16} />}
                  required
                />
                <ProfileInput 
                  label="Email" 
                  name="email"
                  type="email"
                  placeholder="john.doe@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  icon={<Mail size={16} />}
                  required
                />
              </div>

              {/* Row 3: Date of birth | Gender */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ProfileInput 
                  label="Date of birth" 
                  name="dob"
                  type="date"
                  value={formData.dob}
                  onChange={handleInputChange}
                  icon={<Calendar size={16} />}
                />
                <ProfileSelect 
                  label="Gender" 
                  name="gender"
                  placeholder="Select gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  options={[
                    { value: "male", label: "Male" },
                    { value: "female", label: "Female" },
                    { value: "other", label: "Other" }
                  ]}
                />
              </div>

              {/* Row 4: Address full width */}
              <div className="grid grid-cols-1 gap-4">
                <ProfileInput 
                  label="Address" 
                  name="address"
                  placeholder="123 Main Street, Apt 4B"
                  value={formData.address}
                  onChange={handleInputChange}
                  icon={<MapPin size={16} />}
                />
              </div>

              {/* Row 5: District | State */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ProfileInput 
                  label="District" 
                  name="district"
                  placeholder="E.g. Manhattan"
                  value={formData.district}
                  onChange={handleInputChange}
                />
                <ProfileSelect 
                  label="State" 
                  name="state"
                  placeholder="Select state"
                  value={formData.state}
                  onChange={handleInputChange}
                  options={[
                    { value: "Andhra Pradesh", label: "Andhra Pradesh" },
                    { value: "Arunachal Pradesh", label: "Arunachal Pradesh" },
                    { value: "Assam", label: "Assam" },
                    { value: "Bihar", label: "Bihar" },
                    { value: "Chhattisgarh", label: "Chhattisgarh" },
                    { value: "Goa", label: "Goa" },
                    { value: "Gujarat", label: "Gujarat" },
                    { value: "Haryana", label: "Haryana" },
                    { value: "Himachal Pradesh", label: "Himachal Pradesh" },
                    { value: "Jharkhand", label: "Jharkhand" },
                    { value: "Karnataka", label: "Karnataka" },
                    { value: "Kerala", label: "Kerala" },
                    { value: "Madhya Pradesh", label: "Madhya Pradesh" },
                    { value: "Maharashtra", label: "Maharashtra" },
                    { value: "Manipur", label: "Manipur" },
                    { value: "Meghalaya", label: "Meghalaya" },
                    { value: "Mizoram", label: "Mizoram" },
                    { value: "Nagaland", label: "Nagaland" },
                    { value: "Odisha", label: "Odisha" },
                    { value: "Punjab", label: "Punjab" },
                    { value: "Rajasthan", label: "Rajasthan" },
                    { value: "Sikkim", label: "Sikkim" },
                    { value: "Tamil Nadu", label: "Tamil Nadu" },
                    { value: "Telangana", label: "Telangana" },
                    { value: "Tripura", label: "Tripura" },
                    { value: "Uttar Pradesh", label: "Uttar Pradesh" },
                    { value: "Uttarakhand", label: "Uttarakhand" },
                    { value: "West Bengal", label: "West Bengal" }
                  ]}
                />
              </div>

              {/* Row 6: Pincode */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ProfileInput 
                  label="Pincode" 
                  name="pincode"
                  placeholder="10001"
                  value={formData.pincode}
                  onChange={handleInputChange}
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-gray-100 mt-2">
                <ProfileActions 
                  onCancel={handleCancel}
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
