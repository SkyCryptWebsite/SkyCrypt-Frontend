import { building } from "$app/environment";
import { env } from "$env/dynamic/private";
import { MongoClient, type Db } from "mongodb";
import { updateCollections } from "./mongo/update-collections";
import { updateItems } from "./mongo/update-items";

const { MONGO_DATABASE, MONGO_HOST, MONGO_PORT } = env;

const client = !building ? new MongoClient(`mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DATABASE}`) : null;

export async function startMongo() {
  if (building) return;

  await updateItems();
  await updateCollections();

  return client?.connect() as Promise<MongoClient>;
}

export default client?.db() as Db;
