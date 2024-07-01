import { MONGO_URL } from '../../config';
import { MongoClient } from 'mongodb';

export async function createMongoClient(): Promise<MongoClient> {
  const client: void | MongoClient = await MongoClient.connect(MONGO_URL).catch(
    (err) => {
      console.log(err);
    },
  );

  if (!client) {
    return;
  }

  try {
    return client;
  } catch (err) {
    console.log(err);
  }
}
