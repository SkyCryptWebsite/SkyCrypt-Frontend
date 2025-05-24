import { building } from "$app/environment";
import MONGO from "$lib/server/db/mongo";

export async function indexCollectons() {
  if (building) return;

  const emojisCollection = await MONGO.collection("emojis").findOne({});
  if (!emojisCollection) {
    await MONGO.collection("emojis").insertOne({ uuid: "4855c53ee4fb4100997600a92fc50984", emoji: "🦆" });
  }

  if ((await MONGO.collection("emojis").indexExists("uuid_1")) === true) {
    return;
  }

  await MONGO.collection("emojis").createIndex({ uuid: 1 }, { unique: true });
  console.log("[MONGO] Collections indexed");
}
