import Product from "../models/Product.js";

export const addProduct = async (req, res) => {
  try {
    const { title, category, price, stock } = req.body;
    console.log("this is request body:", req.body);

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
