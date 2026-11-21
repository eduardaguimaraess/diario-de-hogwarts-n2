import 'dotenv/config';
import { MongoClient, type Db } from 'mongodb';

let mongoClient: MongoClient | null = null;
let mongoDatabase: Db | null = null;
let connectionPromise: Promise<Db> | null = null;

export function connectMongo(): Promise<Db> {
  if (mongoDatabase) {
    return Promise.resolve(mongoDatabase);
  }

  if (connectionPromise) {
    return connectionPromise;
  }

  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('A variável MONGODB_URI não foi configurada.');
  }

  const databaseName = process.env.MONGODB_DB_NAME || 'diario_hogwarts';
  const client = new MongoClient(uri);

  connectionPromise = client
    .connect()
    .then((connectedClient) => {
      mongoClient = connectedClient;
      mongoDatabase = connectedClient.db(databaseName);

      return mongoDatabase;
    })
    .catch((error: unknown) => {
      connectionPromise = null;
      throw error;
    });

  return connectionPromise;
}

export async function closeMongoConnection(): Promise<void> {
  if (!mongoClient) {
    return;
  }

  await mongoClient.close();

  mongoClient = null;
  mongoDatabase = null;
  connectionPromise = null;
}