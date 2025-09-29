// import mongoose from "mongoose";

// const ProductSchema = new mongoose.Schema({
//   productName: { type: String, required: true },
//   image:{type:String},
//   price: { type: Number, required: true },
//   categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
//   subCategoryId: { type: mongoose.Schema.Types.ObjectId, ref: "SubCategory", required: true },
//   description: { type: String },
//   isAvailable: { type: Boolean, default: true } 
// }, { timestamps: true });

// export default mongoose.models.Product || mongoose.model("Product", ProductSchema);


// models/Dish.ts

import mongoose, { Schema, Document, Model } from "mongoose";

export interface IDish extends Document {
  _id:string;
  dishName: string;
  description?: string;
  price: number;
  image?: string;
  subCategoryId: mongoose.Types.ObjectId;
  isAvailable: boolean;
}

const DishSchema: Schema = new Schema(
  {
    dishName: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    image: { type: String },
    subCategoryId: { type: mongoose.Schema.Types.ObjectId, ref: "SubCategory", required: true },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Dish: Model<IDish> =
  mongoose.models.Dish || mongoose.model<IDish>("Dish", DishSchema);

export default Dish;
