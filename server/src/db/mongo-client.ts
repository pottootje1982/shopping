import { MongoClient } from 'mongodb';

export async function createMongoClient(
  mongoUrl: string,
): Promise<MongoClient> {
  const client: void | MongoClient = await MongoClient.connect(mongoUrl).catch(
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
