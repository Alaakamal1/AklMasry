// models/User.ts
import mongoose, { Schema, Document, models } from "mongoose";

export interface IUser extends Document {
  _id:string;
  email: string;
  password: string;
  role: "admin" | "user";
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // لازم يتعمله hash
  role: { type: String, enum: ["admin", "user"], default: "user" },
});

export default models.User || mongoose.model<IUser>("User", UserSchema);
