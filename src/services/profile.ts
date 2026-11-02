import { apiClient } from "./api-client";

export interface UserProfileDetails {
  id: string;
  mobileNumber: string | null;
  dateOfBirth: string | null;
  gender: string | null;
  address: string | null;
  district: string | null;
  state: string | null;
  pincode: string | null;
  profileImageUrl: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserProfileResponse {
  id: string;
  email: string;
  name: string | null;
  roleId?: string | null;
  roleName?: string;
  status?: string;
  emailVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
  profile: UserProfileDetails | null;
}

export interface UpdateProfilePayload {
  firstName?: string | undefined;
  lastName?: string | undefined;
  mobileNumber?: string | undefined;
  dateOfBirth?: string | undefined;
  gender?: string | undefined;
  address?: string | undefined;
  district?: string | undefined;
  state?: string | undefined;
  pincode?: string | undefined;
  profileImageUrl?: string | undefined;
}

interface ApiResponse<T> {
  data: T;
  statusCode: number;
  timestamp: string;
  path: string;
}

/**
 * Fetches the currently authenticated user's profile information.
 */
export async function getProfileApi(): Promise<UserProfileResponse> {
  const res = await apiClient<ApiResponse<UserProfileResponse>>(
    "/users/profile",
    {
      method: "GET",
    },
  );
  return res.data;
}

/**
 * Updates the currently authenticated user's profile and user record.
 */
export async function updateProfileApi(
  payload: UpdateProfilePayload,
): Promise<UserProfileResponse> {
  const res = await apiClient<ApiResponse<UserProfileResponse>>(
    "/users/profile",
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
  );
  return res.data;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordResponse {
  message: string;
}

/**
 * Changes password for the currently authenticated user.
 */
export async function changePasswordApi(
  payload: ChangePasswordPayload,
): Promise<ChangePasswordResponse> {
  const res = await apiClient<ApiResponse<ChangePasswordResponse>>(
    "/users/change-password",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );
  return res.data;
}
