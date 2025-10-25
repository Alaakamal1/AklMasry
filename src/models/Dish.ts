import mongoose, { Schema, Document, Model } from "mongoose";
export interface IDish extends Document {
  _id:string;
  dishName: string;
  description?: string;
  price: number;
  subCategoryId: string;
  isAvailable: boolean;
}

const DishSchema: Schema = new Schema(
  {
    dishName: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    subCategoryId: { type: mongoose.Schema.Types.ObjectId, ref: "SubCategory", required: true },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Dish: Model<IDish> =
  mongoose.models.Dish || mongoose.model<IDish>("Dish", DishSchema);

export default Dish;
