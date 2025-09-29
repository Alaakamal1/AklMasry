// models/SubCategory.ts
import mongoose, { Schema, Document, Model } from "mongoose";

// 1️⃣ تعريف الـ Interface (الخصائص اللي جوه الـ SubCategory)
export interface ISubCategory extends Document {
  _id:string;
  subCategoryName: string;
  image?: string;
  categoryId: mongoose.Types.ObjectId | null;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// 2️⃣ السكيمة
const SubCategorySchema: Schema = new Schema(
  {
    subCategoryName: { type: String, required: true },
    image: { type: String },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// 3️⃣ الموديل
const SubCategory: Model<ISubCategory> =
  mongoose.models.SubCategory ||
  mongoose.model<ISubCategory>("SubCategory", SubCategorySchema);

export default SubCategory;
