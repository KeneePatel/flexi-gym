import { MongoClient, Db } from 'mongodb';

const url = 'mongodb+srv://root:***REMOVED***@web.jorckuz.mongodb.net/?retryWrites=true&w=majority&appName=Web';
const dbName = 'FlexiGym';

let db: Db;

export const connectDB = async () => {
  try {
    const client = await MongoClient.connect(url);
    db = client.db(dbName);
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

export const getDB = (): Db => {
  if (!db) {
    throw new Error('Database not connected');
  }
  return db;
};
