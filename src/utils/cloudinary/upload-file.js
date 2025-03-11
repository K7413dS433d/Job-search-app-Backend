import { cloudinaryConfig } from "./index.cloudinary.js";

// uploadFile docs
/**
 * Uploads an image file to Cloudinary with optional folder and custom filename.
 *
 * @param {Object} params - The upload parameters.
 * @param {Object} params.req - The Express request object containing the file.
 * @param {Object} params.options - Cloudinary upload options.
 * @param {string} params.options.folder - The Cloudinary folder where the file will be stored.
 * @param {string} [params.options.fileName] - Optional custom name for the uploaded file.
 * @returns {Promise<{ secure_url: string, public_id: string }>} A promise that resolves to an object containing the secure URL and public ID of the uploaded file.
 *
 * @note This function also stores `secure_url` and `public_id` in `req.images` for error handling.
 */
export const uploadFile = async ({ req, options: { folder, fileName } }) => {
  //upload image
  const uploadOptions = {
    folder,
  };

  if (fileName) {
    uploadOptions.public_id = fileName;
  }

  const { secure_url, public_id } = await cloudinaryConfig().uploader.upload(
    req.file.path,
    uploadOptions
  );

  //save in req for error handling
  req.images = { secure_url, public_id };

  return { secure_url, public_id };
};
