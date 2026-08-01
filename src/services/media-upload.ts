import { apiClient } from "@/services/api-client";

type UploadResponse = { data: { url: string } };

/** Uploads binary image data; the API returns an S3 URL for use in JSON forms. */
export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiClient<UploadResponse>("/products/uploads", {
    method: "POST",
    body: formData,
  });
  return response.data.url;
}
