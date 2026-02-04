import express from "express";
import dotenv from "dotenv";
import cors from "cors"; // ✅ ADD
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import axios from "axios";
import Product from "./models/Product.js"; // ✅ apna Product model import
import productroutes from "./routes/product.routes.js";
import userRoutes from "./routes/user.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import carouselRoutes from "./routes/carousel.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import wishlistRoutes from "./routes/wishlist.routes.js";
import offerRoutes from "./routes/offer.routes.js";
import orderRoutes from "./routes/order.routes.js";
import products1ImageRoutes from "./routes/products1ImageRoutes.js";
import { importProductsFromDummyJson } from "./controllers/product.controller.js";
import adminProductRoutes from "./routes/admin.product.routes.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000; // ✅ 5000 use karo

// 🔥 CORS (MUST BE FIRST)
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://ecommerce-frontend-psi-mocha.vercel.app", // admin panel
      "https://ecommerce-frontend-mzry.vercel.app",     // user frontend
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// middleware
app.use(express.json());


// ✅ OPTIONS preflight
app.options("*", cors());
// db connect
connectDB();

// test route
app.get("/test", (req, res) => {
  res.send("Server running ✅ MongoDB connected");
});

app.post("/save", importProductsFromDummyJson);

app.use("/uploads", express.static("uploads"));

// routes
app.use("/api/auth", authRoutes);

// API route
app.use("/api/products", productroutes);

app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/carousel", carouselRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/offers", offerRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/products1", products1ImageRoutes);
app.use("/api/admin/products", adminProductRoutes);

app.use("/product-assets", express.static("product-assets"));

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
