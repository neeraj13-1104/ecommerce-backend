import mongoose from "mongoose";

const carouselSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
      trim: true,
    },

    title: {
      type: String,
      trim: true,
    },

    // Category compulsory
    category: {
      type: String,
      //  default: "ALL",   // 🔥 agar admin category na de

      required: true, // 🔥 mandatory now
      index: true,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true },
);

const Carousel = mongoose.model("Carousel", carouselSchema);
export default Carousel;
