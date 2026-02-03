import Product from "../models/Product.js";

export const addProduct = async (req, res) => {
  try {
    const { title, category, price, stock } = req.body;

    const thumbnail = req.file ? `/uploads/${req.file.filename}` : "";

    const product = await Product.create({
      title,
      category,
      price,
      stock,
      thumbnail,
    });

    res.status(201).json({
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, price, stock } = req.body;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // 🔹 update fields
    product.title = title ?? product.title;
    product.category = category ?? product.category;
    product.price = price ?? product.price;
    product.stock = stock ?? product.stock;

    // 🔹 image optional
    if (req.file) {
      product.thumbnail = `/uploads/${req.file.filename}`;
    }

    await product.save();

    res.json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
