import { MongoClient, Db } from 'mongodb'

const uri = process.env.MONGODB_URI!
if (!uri) throw new Error('MONGODB_URI is not defined in env')

let cached: { client: MongoClient; db: Db } | null = null

export async function connectToDatabase() {
  if (cached) return cached

  const client = new MongoClient(uri)
  await client.connect()

  const dbName = process.env.MONGODB_DB || 'myDatabase'
  const db = client.db(dbName)

  cached = { client, db }
  return cached
}
