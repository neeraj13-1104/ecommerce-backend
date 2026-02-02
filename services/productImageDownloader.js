import axios from "axios";
import fs from "fs";
import path from "path";

// 🔹 title → safe filename (no spaces)
const sanitizeTitle = (title) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const downloadImage = async (imageUrl, title, suffix = "") => {
  try {
    const assetDir = path.join("product-assets");

    if (!fs.existsSync(assetDir)) {
      fs.mkdirSync(assetDir, { recursive: true });
    }

    const baseName = sanitizeTitle(title);
    const fileName = suffix
      ? `${baseName}_${suffix}.jpg`
      : `${baseName}.jpg`;

    const filePath = path.join(assetDir, fileName);

    if (fs.existsSync(filePath)) {
      return {
        status: "already-exists",
        localPath: `/product-assets/${fileName}`,
      };
    }

    const response = await axios({
      url: imageUrl,
      method: "GET",
      responseType: "stream",
    });

    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on("finish", () =>
        resolve({
          status: "downloaded",
          localPath: `/product-assets/${fileName}`,
        })
      );
      writer.on("error", reject);
    });
  } catch (error) {
    console.error("Image download error:", error.message);
    throw error;
  }
};
