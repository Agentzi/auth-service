import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { Readable } from "stream";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads an image stream to Cloudinary
 * @param fileBuffer The buffer of the image file
 * @param folder The folder path in Cloudinary (e.g., 'agentzi_users/user_id')
 * @param publicId Optional public ID for the image (without extension)
 */
export const uploadImage = (
  fileBuffer: Buffer,
  folder: string,
  publicId?: string,
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: publicId,
        overwrite: true,
        resource_type: "image",
      },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      },
    );

    Readable.from(fileBuffer).pipe(uploadStream);
  });
};

/**
 * Deletes an image from Cloudinary by its public ID
 * @param publicId The public ID of the image to delete
 */
export const deleteImage = async (publicId: string): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error(`Failed to delete image with public ID: ${publicId}`, error);
  }
};

/**
 * Extracts the public ID from a Cloudinary URL
 * Example URL: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/folder_name/image_name.jpg
 * @param url The Cloudinary URL
 * @returns The extracted public ID
 */
export const extractPublicId = (url: string): string | null => {
  try {
    const splitUrl = url.split("/");
    const uploadIndex = splitUrl.findIndex((segment) => segment === "upload");
    if (uploadIndex === -1) return null;

    let publicIdPart = splitUrl.slice(uploadIndex + 1).join("/");
    if (
      publicIdPart.startsWith("v") &&
      /\d+/.test(publicIdPart.split("/")[0])
    ) {
      publicIdPart = publicIdPart.split("/").slice(1).join("/");
    }

    const lastDotIndex = publicIdPart.lastIndexOf(".");
    if (lastDotIndex !== -1) {
      return publicIdPart.substring(0, lastDotIndex);
    }

    return publicIdPart;
  } catch (error) {
    console.error("Error extracting public ID from URL", error);
    return null;
  }
};
