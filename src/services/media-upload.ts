import { apiClient } from "@/services/api-client";

type UploadResponse = {
  data: { url: string; originalUrl: string; displayUrl: string };
};

/** Uploads binary image data; the API returns S3 URLs for use in JSON forms. */
export async function uploadImage(
  file: File,
): Promise<{ originalUrl: string; displayUrl: string }> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiClient<UploadResponse>("/products/uploads", {
    method: "POST",
    body: formData,
  });
  return {
    originalUrl: response.data.originalUrl || response.data.url,
    displayUrl: response.data.displayUrl || response.data.url,
  };
}
