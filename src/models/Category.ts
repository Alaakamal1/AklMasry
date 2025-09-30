import mongoose, { Schema, Document, Model } from "mongoose";


export interface ICategory extends Document {
  _id:string;
  categoryName: string;
  image?: string;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema: Schema = new Schema(
  {
    categoryName: { type: String, required: true },
    image: { type: String },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Category: Model<ICategory> =
  mongoose.models.Category || mongoose.model<ICategory>("Category", CategorySchema);

export default Category;
