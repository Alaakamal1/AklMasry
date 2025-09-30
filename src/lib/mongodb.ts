// import mongoose from "mongoose";

// const MONGODB_URI = process.env.MONGODB_URI;

// if (!MONGODB_URI) {
//   throw new Error("⚠️ Please add MONGODB_URI in .env.local");
// }

// let cached = global.mongoose;
// if (!cached) {
//   cached = global.mongoose = { conn: null, promise: null };
// }

// async function dbConnect() {
//   if (cached.conn) return cached.conn;

//   if (!cached.promise) {
//     cached.promise = mongoose.connect(MONGODB_URI, {
//       bufferCommands: false,
//     }).then((mongoose) => mongoose);
//   }
//   cached.conn = await cached.promise;
//   return cached.conn;
// }

// export default dbConnect;


// src/lib/mongodb.ts
import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI!
if (!uri) throw new Error('MONGODB_URI is not defined in env')

let cached: { client: MongoClient; db: any } | null = null

export async function connectToDatabase() {
  if (cached) return cached

  const client = new MongoClient(uri)
  await client.connect()
  const db = client.db() // تستخدم اسم القاعدة الموجود في URI أو تضيفي db name هنا
  cached = { client, db }
  return cached
}
