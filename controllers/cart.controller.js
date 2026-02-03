import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import Offer from "../models/Offer.js";

// Add product to cart
export const addToCart = async (req, res) => {
  try {
    const userId = req.user.id; // authMiddleware se mil raha hai
    const { productId } = req.body;

    // 1️⃣ check if product exists
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // 2️⃣ find cart of user
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      // 🟢 Cart nahi hai → create new cart
      cart = new Cart({
        user: userId,
        items: [{ product: productId, quantity: 1 }],
      });
    } else {
      // 🟡 Product already in cart?
      const productIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId,
      );

      if (productIndex > -1) {
        // ✅ Already in cart → increase quantity
        cart.items[productIndex].quantity += 1;
      } else {
        // ✅ Not in cart → add new product
        cart.items.push({ product: productId, quantity: 1 });
      }
    }

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Product added to cart",
      cart,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get user's cart
export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart) return res.status(404).json({ message: "Cart is empty" });

    res.status(200).json({ success: true, cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Remove product from cart
export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    let cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId,
    );

    await cart.save();

    res.status(200).json({ success: true, message: "Product removed", cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Update quantity
export const updateQuantity = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;
    console.log(req.user);
    let cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const productIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId,
    );
    if (productIndex === -1)
      return res.status(404).json({ message: "Product not in cart" });

    cart.items[productIndex].quantity = quantity;

    await cart.save();

    res.status(200).json({ success: true, cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};




// Apply category offer on cart
// controllers/cart.controller.js


export const applyOfferToProduct = async (req, res) => {
  const { offerId, productId } = req.body;

  const userId = req.user.id;
 console.log(req.user)
  const cart = await Cart.findOne({ user: userId }).populate("items.product");
  if (!cart) return res.status(404).json({ message: "Cart not found" });

  const item = cart.items.find(
    (i) => i.product._id.toString() === productId
  );
  if (!item) return res.status(404).json({ message: "Product not in cart" });

  const offer = await Offer.findById(offerId);
  if (!offer) return res.status(404).json({ message: "Offer not found" });

  // ✅ CATEGORY CHECK
  if (!offer.categories.includes(item.product.category)) {
    return res.status(400).json({ message: "Offer not applicable" });
  }

  // ✅ DISCOUNT CALCULATION
  let discount = 0;
  const price = item.product.price * item.quantity;

  if (offer.discountType === "PERCENT") {
    discount = (price * offer.discountValue) / 100;
  } else {
    discount = offer.discountValue;
  }

  item.appliedOffer = offer._id;
  item.discountAmount = discount;

  await cart.save();

  res.json({ message: "Offer applied successfully", cart });
};
