import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import Offer from "../models/Offer.js";

// PLACE ORDER (FROM CART)
// controllers/order.controller.js

// controllers/order.controller.js

export const placeOrder = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ user: userId }).populate("items.product");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    let cartTotal = 0;
    let totalDiscount = 0;
    const orderItems = [];

    // ✅ STEP 1: validation
    for (const item of cart.items) {
      if (!item.product) {
        return res.status(400).json({ message: "Invalid product in cart" });
      }

      if (item.product.stock < item.quantity) {
        return res
          .status(400)
          .json({ message: `${item.product.title} out of stock` });
      }
    }

    // ✅ STEP 2: calculations
    for (const item of cart.items) {
      const price = item.product.price * item.quantity;
      const discount = item.discountAmount || 0;
      const finalPrice = price - discount;

      cartTotal += price;
      totalDiscount += discount;

      orderItems.push({
        product: item.product._id,
        quantity: item.quantity,
        price,
        discountAmount: discount,
        finalPrice,
      });
    }

    const finalAmount = cartTotal - totalDiscount;

    // ✅ STEP 3: create order (MATCHING SCHEMA)
    const order = await Order.create({
      user: userId,
      items: orderItems,
      cartTotal,
      totalDiscount,
      finalAmount,
      status: "PLACED",
    });

    // ✅ STEP 4: reduce stock
    for (const item of cart.items) {
      item.product.stock -= item.quantity;
      await item.product.save();
    }

    // ✅ STEP 5: clear cart
    cart.items = [];
    await cart.save();

    res.status(201).json({
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.error("Order error:", error);
    res.status(500).json({ message: "Order failed" });
  }
};

// GET USER ORDERS
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    // console.log("User ID:", userId);

    const orders = await Order.find({ user: userId })
      .populate("items.product", "title price thumbnail")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get user orders error:", error);
    res.status(500).json({ message: "Failed to fetch user orders" });
  }
};



// ADMIN: GET ALL ORDERS
export const getAllOrdersAdmin = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Admin get orders error:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};



// ADMIN: UPDATE ORDER STATUS
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

    res.status(200).json({
      success: true,
      message: "Order status updated",
      order,
    });
  } catch (error) {
    console.error("Update order status error:", error);
    res.status(500).json({ message: "Failed to update order status" });
  }
};


// USER: CANCEL ORDER
export const cancelOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { orderId } = req.params;

    const order = await Order.findOne({ _id: orderId, user: userId });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status === "DELIVERED") {
      return res
        .status(400)
        .json({ message: "Delivered order cannot be cancelled" });
    }

    order.status = "CANCELLED";
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      order,
    });
  } catch (error) {
    console.error("Cancel order error:", error);
    res.status(500).json({ message: "Failed to cancel order" });
  }
};
