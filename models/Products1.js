import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    rating: Number,
    comment: String,
    date: Date,
    reviewerName: String,
    reviewerEmail: String,
  },
  { _id: false },
);

const product1Schema = new mongoose.Schema(
  {
    productId: Number, // dummyjson ka id
    title: String,
    description: String,
    category: String,
    price: Number,
    discountPercentage: Number,
    rating: Number,
    stock: Number,
    tags: [String],
    brand: String,
    sku: String,
    weight: Number,

    dimensions: {
      width: Number,
      height: Number,
      depth: Number,
    },

    warrantyInformation: String,
    shippingInformation: String,
    availabilityStatus: String,
    reviews: [reviewSchema],
    returnPolicy: String,
    minimumOrderQuantity: Number,

    meta: {
      createdAt: Date,
      updatedAt: Date,
      barcode: String,
      qrCode: String,
    },

    images: [String],
    thumbnail: String,
  },
  { timestamps: true },
);

export default mongoose.model("products1", product1Schema);
