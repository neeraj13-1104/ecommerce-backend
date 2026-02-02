import Carousel from "../models/Carousel.js";

// 🔹 GET carousel images (FRONTEND)
export const getCarousel = async (req, res) => {
  try {
    const { category } = req.query; // frontend se ?category=electronics

    let images = [];

    // 1️⃣ Agar category provide ki gayi
    if (category) {
      images = await Carousel.find({
        category: category,
        isActive: true,
      });
    }

    // 2️⃣ Agar category images nahi mile, fallback
    if (!images || images.length === 0) {
      images = await Carousel.find({ isActive: true }); // pure active carousel
    }

    res.status(200).json(images);
  } catch (err) {
    console.error("❌ Error in getCarousel:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// 🔹 ADD carousel image (ADMIN)
export const addCarousel = async (req, res) => {
  try {
    const { title, category } = req.body;

    if (!category || category.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Category is required for carousel image",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Carousel image is required",
      });
    }

    const carousel = new Carousel({
      image: req.file.path.replace(/\\/g, "/"), // windows fix
      title,
      category,
    });

    await carousel.save();

    res.status(201).json({
      success: true,
      carousel,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 🔹 DELETE carousel image
export const deleteCarousel = async (req, res) => {
  const { id } = req.params;

  if (!id)
    return res.status(400).json({ success: false, message: "ID is required" });

  try {
    const deleted = await Carousel.findByIdAndDelete(id);

    if (!deleted)
      return res
        .status(404)
        .json({ success: false, message: "Carousel image not found" });

    console.log("🗑 Carousel image deleted:", id);

    res.json({
      success: true,
      message: "Carousel image deleted successfully",
    });
  } catch (err) {
    console.error("❌ Error in deleteCarousel:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
