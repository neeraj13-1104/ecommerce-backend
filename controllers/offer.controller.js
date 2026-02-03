import Offer from "../models/Offer.js";
import Product from "../models/Product.js"; // 🔥 ADD THIS LINE

/* ======================================================
   CREATE CATEGORY OFFER (SUPER ADMIN ONLY)
====================================================== */
export const createCategoryOffer = async (req, res) => {
  try {
    const {
      title,
      discountType,
      discountValue,
      minCartValue,
      categories, // ✅ ARRAY of category names
      startDate,
      endDate,
    } = req.body;
   console.log(req.body);
    /* ===== REQUIRED FIELDS CHECK ===== */
    if (
      !title ||
      !discountType ||
      !discountValue ||
      !Array.isArray(categories) ||
      categories.length === 0 || // ✅ FIX
      !startDate ||
      !endDate
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    /* ===== IMAGE CHECK ===== */
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Banner image is required",
      });
    }

    const bannerImage = `/uploads/${req.file.filename}`;

    /* ===== DISCOUNT VALIDATION ===== */
    if (discountType === "PERCENT" && discountValue > 90) {
      return res.status(400).json({
        success: false,
        message: "Percent discount cannot exceed 90%",
      });
    }

    if (discountValue <= 0) {
      return res.status(400).json({
        success: false,
        message: "Discount value must be greater than 0",
      });
    }

    /* ===== DATE VALIDATION ===== */
    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({
        success: false,
        message: "End date must be after start date",
      });
    }

    /* ===== CHECK EXISTING ACTIVE OFFER (ARRAY FIX) ===== */
    const existingOffer = await Offer.findOne({
      type: "CATEGORY",
      categories: { $in: categories }, // ✅ FIX
      isActive: true,
      endDate: { $gte: new Date() },
    });

    if (existingOffer) {
      return res.status(409).json({
        success: false,
        message: "An active offer already exists for one of these categories",
      });
    }

    /* ===== CREATE OFFER ===== */
    const offer = await Offer.create({
      title,
      type: "CATEGORY",
      discountType,
      discountValue,
      minCartValue: minCartValue || 0,
      categories, // ✅ ARRAY saved
      bannerImage,
      startDate,
      endDate,
      isActive: true,
    });
   console.log(offer);
    res.status(201).json({
      success: true,
      message: "Category offer created successfully",
      offer,
    });
  } catch (error) {
    console.error("Create category offer error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create category offer",
    });
  }
};

/* ======================================================
   GET ACTIVE CATEGORY OFFERS (FRONTEND)
====================================================== */
export const getActiveCategoryOffers = async (req, res) => {
  try {
    const now = new Date();

    const offers = await Offer.find({
      type: "CATEGORY",
      isActive: true,
      // startDate: { $lte: now },
      // endDate: { $gte: now },
    });

    res.json({
      success: true,
      offers,
    });
  } catch (error) {
    console.error("Fetch category offers error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch category offers",
    });
  }
};

/* ======================================================
   GET ACTIVE CATEGORY OFFER COUNT
====================================================== */
export const getCategoryOfferCount = async (req, res) => {
  try {
    const now = new Date();
    console.log("Date is : ", now);

    const count = await Offer.countDocuments({
      type: "CATEGORY",
      isActive: true,
      // startDate: { $lte: now },
      // endDate: { $gte: now },
    });

    res.json({
      success: true,
      count,
    });
  } catch (error) {
    console.error("Category offer count error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get category offer count",
    });
  }
};

/* ======================================================
   DELETE CATEGORY OFFER (SUPER ADMIN)
====================================================== */
export const deleteCategoryOffer = async (req, res) => {
  try {
    const { id } = req.params;

    /* ===== CHECK OFFER ===== */
    const offer = await Offer.findById(id);

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Offer not found",
      });
    }

    if (!offer.isActive) {
      return res.status(400).json({
        success: false,
        message: "Offer already deleted or inactive",
      });
    }

    /* ===== SOFT DELETE ===== */
    offer.isActive = false;
    await offer.save();

    res.json({
      success: true,
      message: "Category offer deleted successfully",
    });
  } catch (error) {
    console.error("Delete category offer error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete category offer",
    });
  }
};


export const getProductsByCategoryOffer = async (req, res) => {
  try {
    // 🔹 Disable cache (304 fix)
    res.set({
      "Cache-Control": "no-store",
      "Pragma": "no-cache",
      "Expires": "0",
    });

    const { offerId } = req.params;
    // console.log(offerId);

    /* ===== 1. FETCH OFFER ===== */
    const offer = await Offer.findOne({
      _id: offerId,
      type: "CATEGORY",
      isActive: true,
    });
    // console.log(offer);

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Offer not found or inactive",
      });
    }

    /* ===== 2. FETCH PRODUCTS USING CATEGORY SLUG ===== */
    const products = await Product.find({
      category: { $in: offer.categories }, // ✅ STRING ↔ STRING
      // isActive: true,
    });
  console.log(products);
    /* ===== 3. RESPONSE ===== */
    res.status(200).json({
      success: true,
      offerTitle: offer.title,
      categories: offer.categories,
      totalProducts: products.length,
      products,
    });
  } catch (error) {
    console.error("Get products by category offer error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch offer products",
    });
  }
};