import Product from "../models/Product.js";

export const importProductsFromDummyJson = async (req, res) => {
  try {
    const response = await axios.get(
      "https://dummyjson.com/products?limit=194",
    );

    const products = response.data.products;

    if (!products || products.length === 0) {
      return res.status(400).json({ message: "No products found from API" });
    }

    let inserted = 0;
    let skipped = 0;

    for (const item of products) {
      // 🔹 prevent duplicate (by id or title)
      const exists = await Product.findOne({ id: item.id });
      if (exists) {
        skipped++;
        continue;
      }

      await Product.create({
        id: item.id,
        title: item.title,
        description: item.description,
        category: item.category,
        price: item.price,
        discountPercentage: item.discountPercentage,
        rating: item.rating,
        stock: item.stock,
        tags: item.tags,
        brand: item.brand,
        sku: item.sku,
        weight: item.weight,

        dimensions: item.dimensions,
        warrantyInformation: item.warrantyInformation,
        shippingInformation: item.shippingInformation,
        availabilityStatus: item.availabilityStatus,
        reviews: item.reviews,
        returnPolicy: item.returnPolicy,
        minimumOrderQuantity: item.minimumOrderQuantity,

        meta: item.meta,
        images: item.images,
        thumbnail: item.thumbnail,
      });

      inserted++;
    }

    res.status(201).json({
      message: "Products imported successfully",
      totalFromAPI: products.length,
      inserted,
      skipped,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to import products",
      error: error.message,
    });
  }
};

// GET /api/products/cart
// GET /api/products/cart?page=1&limit=8
export const getProductsForCart = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const skip = (page - 1) * limit;

    // 🔥 NEW: category from query
    const { category } = req.query;

    // 🔥 NEW: filter object
    let filter = {};

    if (category && category !== "all") {
      filter.category = category;
    }

    // 🔥 CHANGED: total products count (with filter)
    const totalProducts = await Product.countDocuments(filter);

    // 🔥 CHANGED: Product.find with filter
    const products = await Product.find(filter, {
      title: 1,
      price: 1,
      thumbnail: 1,
      stock: 1,
    })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      totalProducts,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
      data: products.map((p) => ({
        _id: p._id,
        title: p.title,
        price: p.price,
        thumbnail: p.thumbnail,
        stock: p.stock,
        quantity: 1, // UI ke liye
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load products" });
  }
};

// GET /api/products/categories
export const getCategories = async (req, res) => {
  try {
    // 🔹 Only get unique categories
    const categories = await Product.distinct("category");

    res.json({
      success: true,
      data: categories, // array of strings
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
    });
  }
};

// GET /api/products/:id
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product); // poora product data return
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch product" });
  }
};

// DELETE /api/products/:id
export const deleteProductById = async (req, res) => {
  try {
    const { id } = req.params;

    // product exist check
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await Product.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to delete product",
    });
  }
};
// GET /api/products/detail/:id
export const getProductDetail = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.json({
      success: true,
      data: product, // poora product detail for frontend
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to fetch product" });
  }
};




