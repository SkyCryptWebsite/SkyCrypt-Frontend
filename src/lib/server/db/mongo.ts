import { building } from "$app/environment";
import { updateItemsConstants } from "$constants/update-items";
import { MONGO_DATABASE, MONGO_HOST, MONGO_PORT } from "$env/static/private";
import { MongoClient, type Db } from "mongodb";
import { updateCollections } from "./mongo/update-collections";
import { updateItems } from "./mongo/update-items";

const client = !building ? new MongoClient(`mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DATABASE}`) : null;

export async function startMongo() {
  if (building) return;
  console.log("[MONGO] Starting mongo...");

  await updateItems();
  await updateItemsConstants();
  await updateCollections();

  return client?.connect() as Promise<MongoClient>;
}

export default client?.db() as Db;
