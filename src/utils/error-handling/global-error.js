import { deleteCloudDir, deleteFile } from "../index.utils.js";

export const globalError = async (err, req, res, next) => {
  //remove images from cloudinary if there is an error
  //!but any image/images you upload in req.images
  if (req.images?.length) {
    const publicIds = req.images.map((img) => img.public_id);
    await deleteCloudDir({ assetsArray: publicIds });
  } else if (req.images) await deleteFile(req.images.public_id);

  return res.status(err.cause || 500).json({
    message: err.message,
    status: err.cause || 500,
    stack: err.stack,
  });
};
