import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Offer from "../models/Offer.js";

/* ================= HELPER ================= */
const calculateFinalPrice = async (product, categoryTotals) => {
  let originalPrice = product.price;
  let finalPrice = product.price;
  let discount = 0;
  let appliedOffer = null;

  const offers = await Offer.find({
    isActive: true,
    startDate: { $lte: new Date() },
    endDate: { $gte: new Date() },
  });

  for (let offer of offers) {
    if (
      offer.type === "CATEGORY" &&
      offer.categories.includes(product.category)
    ) {
      const categoryTotal = categoryTotals[product.category] || 0;

      // ✅ MIN CART VALUE CHECK
      if (categoryTotal < offer.minCartValue) {
        continue; // ❌ offer apply nahi hoga
      }

      appliedOffer = offer;

      if (offer.discountType === "PERCENT") {
        discount = (originalPrice * offer.discountValue) / 100;
      } else if (offer.discountType === "FLAT") {
        discount = offer.discountValue;
      }

      finalPrice = Math.max(originalPrice - discount, 0);
      break; // ek hi offer apply
    }
  }

  return {
    originalPrice,
    finalPrice,
    discount,
    offerApplied: appliedOffer,
  };
};

/* ================= USER : CREATE ORDER ================= */
export const createOrder = async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items in order" });
    }

    let originalAmount = 0;
    let discountAmount = 0;
    let totalAmount = 0;

    const orderItems = [];
    const appliedOffers = [];

    /* ================= CATEGORY TOTALS ================= */
    const categoryTotals = {};

    for (let item of items) {
      const product = await Product.findById(item.productId);
      if (!product) continue;

      if (!categoryTotals[product.category]) {
        categoryTotals[product.category] = 0;
      }

      categoryTotals[product.category] += product.price * item.quantity;
    }

    /* ================= PRICE CALCULATION ================= */
    for (let item of items) {
      const product = await Product.findById(item.productId);
      if (!product) continue;

      const priceData = await calculateFinalPrice(product, categoryTotals);

      originalAmount += priceData.originalPrice * item.quantity;
      discountAmount += priceData.discount * item.quantity;
      totalAmount += priceData.finalPrice * item.quantity;

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: priceData.finalPrice,
      });

      if (priceData.offerApplied) {
        appliedOffers.push({
          title: priceData.offerApplied.title,
          discountType: priceData.offerApplied.discountType,
          discountValue: priceData.offerApplied.discountValue,
          category: priceData.offerApplied.categories,
        });
      }
    }

    /* ================= CREATE ORDER ================= */
    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      originalAmount,
      discountAmount,
      totalAmount,
      appliedOffers,
      status: "Pending",
    });

    res.status(201).json({
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.error("Create Order Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= USER : GET OWN ORDERS ================= */
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("items.product", "title price category")
      .sort({ createdAt: -1 });

    res.json({ orders });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= ADMIN : GET ALL ORDERS ================= */
export const getAllOrdersForAdmin = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product", "title price")
      .sort({ createdAt: -1 });

    res.json({ orders });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= ADMIN : UPDATE STATUS ================= */
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    await order.save();

    res.json({
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
