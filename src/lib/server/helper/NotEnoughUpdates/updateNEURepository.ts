import { building } from "$app/environment";
import fs from "node:fs";
import { simpleGit } from "simple-git";

let gitSubmodule: ReturnType<typeof simpleGit>;
if (!building) {
  fs.mkdirSync("NotEnoughUpdates-REPO", { recursive: true });
  gitSubmodule = simpleGit("NotEnoughUpdates-REPO");
}

export async function updateNotEnoughUpdatesRepository() {
  if (building) return;

  try {
    console.info(`[NOT-ENOUGH-UPDATES] Checking for updates...`);

    const diffSummary = await gitSubmodule.diffSummary(["origin/master"]);

    if (diffSummary.files.length > 0) {
      console.info(`[NOT-ENOUGH-UPDATES] Updating submodule...`);

      await gitSubmodule.pull();

      console.info(`[NOT-ENOUGH-UPDATES] Updated submodule!`);
    } else {
      console.info(`[NOT-ENOUGH-UPDATES] No updates found.`);
    }
  } catch (error) {
    console.error("Error updating repository:", error);
  }
}

setInterval(updateNotEnoughUpdatesRepository, 1000 * 60 * 60 * 12);
