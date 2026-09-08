import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI ?? "";
const dbName = process.env.MONGODB_DB ?? "bizlink-ai";

let cachedClient: MongoClient | null = null;

export async function getMongoClient() {
  if (!uri) {
    throw new Error("MONGODB_URI environment variable is not set.");
  }

  if (cachedClient) {
    return cachedClient;
  }

  const client = new MongoClient(uri, { connectTimeoutMS: 10000, serverSelectionTimeoutMS: 10000 });
  await client.connect();
  cachedClient = client;
  return client;
}

export async function getDatabase() {
  const client = await getMongoClient();
  return client.db(dbName);
}
