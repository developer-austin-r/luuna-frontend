"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  Calendar,
  Camera,
  CheckCircle2,
  ChevronLeft,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";

import Footer from "@/components/landing/Footer/Footer";
import LoginOfferBar from "@/components/landing/LoginOfferBar/LoginOfferBar";
import Navbar from "@/components/landing/Navbar/Navbar";
import { AccountMenu } from "@/components/profile/AccountMenu/AccountMenu";
import { ProfileActions } from "@/components/profile/ProfileActions/ProfileActions";
import { ProfileHeader } from "@/components/profile/ProfileHeader/ProfileHeader";
import { ProfileInput } from "@/components/profile/ProfileInput/ProfileInput";
import { ProfileSelect } from "@/components/profile/ProfileSelect/ProfileSelect";
import { logoutApi } from "@/services/auth";
import {
  fetchDistricts,
  fetchStates,
  type LgdDistrict,
  type LgdState,
} from "@/services/location";
import { uploadImage } from "@/services/media-upload";
import { getProfileApi, updateProfileApi } from "@/services/profile";

function splitName(fullName: string | null | undefined): {
  firstName: string;
  lastName: string;
} {
  if (!fullName) return { firstName: "", lastName: "" };
  const parts = fullName.trim().split(/\s+/);
  const first = parts[0] ?? "";
  if (parts.length === 1) return { firstName: first, lastName: "" };
  return { firstName: first, lastName: parts.slice(1).join(" ") };
}

interface ProfileFormData {
  firstName: string;
  lastName: string;
  mobile: string;
  email: string;
  dob: string;
  gender: string;
  address: string;
  district: string;
  state: string;
  pincode: string;
}

const emptyForm: ProfileFormData = {
  firstName: "",
  lastName: "",
  mobile: "",
  email: "",
  dob: "",
  gender: "",
  address: "",
  district: "",
  state: "",
  pincode: "",
};

const FALLBACK_STATES = [
  "Andaman And Nicobar Islands",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu And Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Lakshadweep",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "The Dadra And Nagar Haveli And Daman And Diu",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

export default function ProfilePage() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Form State
  const [formData, setFormData] = useState<ProfileFormData>(emptyForm);
  const [savedData, setSavedData] = useState<ProfileFormData>(emptyForm);

  // Avatar State
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [savedAvatar, setSavedAvatar] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  // Location Hierarchy State (India LGD API)
  const [states, setStates] = useState<LgdState[]>([]);
  const [districts, setDistricts] = useState<LgdDistrict[]>([]);
  const [isLoadingStates, setIsLoadingStates] = useState(false);
  const [isLoadingDistricts, setIsLoadingDistricts] = useState(false);

  // Fetch logged in user profile on mount
  useEffect(() => {
    let isMounted = true;

    async function loadUserProfile() {
      try {
        setIsLoading(true);
        const data = await getProfileApi();
        if (!isMounted) return;

        const { firstName, lastName } = splitName(data.name);
        const initialForm: ProfileFormData = {
          firstName,
          lastName,
          mobile: data.profile?.mobileNumber || "",
          email: data.email || "",
          dob: data.profile?.dateOfBirth
            ? (data.profile.dateOfBirth.split("T")[0] ?? "")
            : "",
          gender: data.profile?.gender || "",
          address: data.profile?.address || "",
          district: data.profile?.district || "",
          state: data.profile?.state || "",
          pincode: data.profile?.pincode || "",
        };

        setFormData(initialForm);
        setSavedData(initialForm);

        if (data.profile?.profileImageUrl) {
          setAvatarPreview(data.profile.profileImageUrl);
          setSavedAvatar(data.profile.profileImageUrl);
        }
      } catch (err: any) {
        if (!isMounted) return;
        const msg = err?.message || "";
        if (
          msg.includes("401") ||
          msg.toLowerCase().includes("unauthorized") ||
          msg.includes("403")
        ) {
          router.replace("/login");
          return;
        }
        setStatusMessage({
          type: "error",
          text: msg || "Failed to load profile. Please try refreshing.",
        });
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadUserProfile();

    return () => {
      isMounted = false;
    };
  }, [router]);

  // Fetch all Indian states from India LGD API on mount
  useEffect(() => {
    let isMounted = true;
    async function loadStatesData() {
      try {
        setIsLoadingStates(true);
        const data = await fetchStates();
        if (!isMounted) return;
        if (data && data.length > 0) {
          setStates(data.sort((a, b) => a.name.localeCompare(b.name)));
        }
      } catch (err) {
        console.error("Failed to load states from API:", err);
      } finally {
        if (isMounted) setIsLoadingStates(false);
      }
    }
    loadStatesData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch districts when state is selected or changed
  useEffect(() => {
    let isMounted = true;
    if (!formData.state) {
      setDistricts([]);
      return;
    }

    const matchedState = states.find(
      (s) =>
        s.name.toLowerCase() === formData.state.toLowerCase() ||
        s.code === formData.state,
    );

    async function loadDistrictsData() {
      try {
        setIsLoadingDistricts(true);
        const data = await fetchDistricts(matchedState?.code);
        if (!isMounted) return;
        setDistricts(data.sort((a, b) => a.name.localeCompare(b.name)));
      } catch (err) {
        console.error("Failed to load districts from API:", err);
      } finally {
        if (isMounted) setIsLoadingDistricts(false);
      }
    }

    loadDistrictsData();
    return () => {
      isMounted = false;
    };
  }, [formData.state, states]);

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newState = e.target.value;
    setFormData((prev) => ({
      ...prev,
      state: newState,
      district: "", // Reset district when state changes
    }));
    if (statusMessage) setStatusMessage(null);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (statusMessage) setStatusMessage(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setStatusMessage({
          type: "error",
          text: "Please select a valid image file.",
        });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setStatusMessage({
          type: "error",
          text: "Profile image size should not exceed 5MB.",
        });
        return;
      }
      setAvatarFile(file);
      const imageUrl = URL.createObjectURL(file);
      setAvatarPreview(imageUrl);
      if (statusMessage) setStatusMessage(null);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!formData.firstName.trim()) {
      setStatusMessage({
        type: "error",
        text: "First Name is required.",
      });
      return;
    }

    if (!formData.lastName.trim()) {
      setStatusMessage({
        type: "error",
        text: "Last Name is required.",
      });
      return;
    }

    setIsSaving(true);
    setStatusMessage(null);

    try {
      let finalAvatarUrl = savedAvatar;

      // Upload image if a new file was chosen
      if (avatarFile) {
        try {
          const uploadRes = await uploadImage(avatarFile);
          finalAvatarUrl = uploadRes.displayUrl || uploadRes.originalUrl;
        } catch (uploadErr) {
          console.warn("Avatar upload failed:", uploadErr);
        }
      }

      const updated = await updateProfileApi({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        mobileNumber: formData.mobile.trim() || undefined,
        dateOfBirth: formData.dob || undefined,
        gender: formData.gender || undefined,
        address: formData.address.trim() || undefined,
        district: formData.district.trim() || undefined,
        state: formData.state.trim() || undefined,
        pincode: formData.pincode.trim() || undefined,
        profileImageUrl: finalAvatarUrl || undefined,
      });

      const { firstName, lastName } = splitName(updated.name);
      const syncedForm: ProfileFormData = {
        firstName,
        lastName,
        mobile: updated.profile?.mobileNumber || "",
        email: updated.email || formData.email,
        dob: updated.profile?.dateOfBirth
          ? (updated.profile.dateOfBirth.split("T")[0] ?? "")
          : "",
        gender: updated.profile?.gender || "",
        address: updated.profile?.address || "",
        district: updated.profile?.district || "",
        state: updated.profile?.state || "",
        pincode: updated.profile?.pincode || "",
      };

      setFormData(syncedForm);
      setSavedData(syncedForm);
      setAvatarFile(null);

      if (updated.profile?.profileImageUrl) {
        setAvatarPreview(updated.profile.profileImageUrl);
        setSavedAvatar(updated.profile.profileImageUrl);
      }

      setStatusMessage({
        type: "success",
        text: "Profile updated successfully!",
      });
    } catch (err: any) {
      setStatusMessage({
        type: "error",
        text: err?.message || "Failed to update profile. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({ ...savedData });
    setAvatarPreview(savedAvatar);
    setAvatarFile(null);
    setStatusMessage(null);
  };

  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch {
      // Ignore network errors
    } finally {
      window.location.href = "/";
    }
  };

  const displayFullName = [formData.firstName, formData.lastName]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <LoginOfferBar />
      <Navbar />

      <div className="min-h-screen bg-gradient-to-b from-[#2a1740] via-[#755494] to-[#E9D5FF] pb-16 pt-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-semibold text-white hover:text-[#E9D5FF] transition-colors"
          >
            <ChevronLeft size={16} className="mr-1" />
            Back to Home
          </Link>
        </div>

        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6">
          {/* Left Sidebar Navigation */}
          <div className="w-full md:w-72 shrink-0">
            <h2 className="text-xl font-bold text-white mb-4 px-1 tracking-tight">
              Manage My Account
            </h2>
            <AccountMenu onLogout={handleLogout} />
          </div>

          {/* Right Main Content area */}
          <div className="flex-1 bg-white rounded-3xl shadow-2xl p-6 sm:p-8">
            <div className="flex justify-between items-start mb-6">
              <ProfileHeader
                title={
                  displayFullName
                    ? `Hello, ${displayFullName}`
                    : "Edit Your Profile"
                }
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
              <div
                className={`mb-6 p-3 rounded-xl flex items-center gap-3 text-sm font-semibold ${
                  statusMessage.type === "success"
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {statusMessage.type === "success" ? (
                  <CheckCircle2 size={16} />
                ) : (
                  <AlertCircle size={16} />
                )}
                {statusMessage.text}
              </div>
            )}

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-24 gap-3">
                <Loader2 size={32} className="animate-spin text-[#6B21A8]" />
                <p className="text-sm font-medium text-gray-500">
                  Loading profile information...
                </p>
              </div>
            ) : (
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
                  />
                  <div className="relative">
                    <ProfileInput
                      label="Email"
                      name="email"
                      type="email"
                      placeholder="john.doe@example.com"
                      value={formData.email}
                      readOnly
                      title="Email is tied to your account credentials and cannot be edited directly."
                      icon={<Mail size={16} />}
                      className="bg-gray-50 cursor-not-allowed text-gray-500"
                    />
                    <div className="absolute right-3 top-9 text-gray-400 pointer-events-none">
                      <Lock size={14} />
                    </div>
                  </div>
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
                      { value: "other", label: "Other" },
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

                {/* Row 5: State | District */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <ProfileSelect
                    label="State"
                    name="state"
                    placeholder={
                      isLoadingStates ? "Loading states..." : "Select state"
                    }
                    value={formData.state}
                    onChange={handleStateChange}
                    options={
                      states.length > 0
                        ? states.map((s) => ({ value: s.name, label: s.name }))
                        : FALLBACK_STATES.map((s) => ({ value: s, label: s }))
                    }
                  />
                  <ProfileSelect
                    label="District"
                    name="district"
                    placeholder={
                      !formData.state
                        ? "Select state first"
                        : isLoadingDistricts
                          ? "Loading districts..."
                          : "Select district"
                    }
                    value={formData.district}
                    onChange={handleInputChange}
                    disabled={!formData.state || isLoadingDistricts}
                    options={
                      districts.length > 0
                        ? districts.map((d) => ({
                            value: d.name,
                            label: d.name,
                          }))
                        : formData.district
                          ? [
                              {
                                value: formData.district,
                                label: formData.district,
                              },
                            ]
                          : []
                    }
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
                    onSave={handleSubmit}
                    isSaving={isSaving}
                    cancelLabel="Cancel"
                    saveLabel="Save Changes"
                  />
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
