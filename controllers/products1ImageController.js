import Products from "../models/Product.js";
import { downloadImage } from "../services/productImageDownloader.js";

export const downloadProductImages = async (req, res) => {
  try {
    const products = await Products.find();

    let totalImages = 0;
    let downloaded = 0;

    for (const product of products) {
      const updatedImages = [];

      // 🔹 images
      if (product.images?.length) {
        for (let i = 0; i < product.images.length; i++) {
          totalImages++;

          const suffix = i === 0 ? "" : i;
          const result = await downloadImage(
            product.images[i],
            product.title,
            suffix,
          );

          if (result.status === "downloaded") downloaded++;

          updatedImages.push(result.localPath);
        }
      }

      // 🔹 thumbnail
      if (product.thumbnail) {
        const thumbResult = await downloadImage(
          product.thumbnail,
          product.title,
          "thumbnail",
        );
        product.thumbnail = thumbResult.localPath;
      }

      // 🔹 save DB
      if (updatedImages.length) {
        product.images = updatedImages;
      }

      await product.save();
    }

    res.status(200).json({
      message: "Images saved without spaces & DB updated",
      totalProducts: products.length,
      totalImages,
      downloaded,
    });
  } catch (error) {
    res.status(500).json({
      message: "Image processing failed",
      error: error.message,
    });
  }
};
