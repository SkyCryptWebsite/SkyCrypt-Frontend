import { NEU_CONSTANTS } from "$lib/server/helper/NotEnoughUpdates/parseNEURepository";
import type { BestiaryCategory, Member, Mob, NEUBestiaryConstant } from "$types/global";

function getBestiaryMobs(bestiary: Record<string, number>, mobList: Mob[]) {
  const output = [];
  for (const mob of mobList) {
    const mobBracket = NEU_CONSTANTS.get("bestiary").brackets[mob.bracket];

    const totalKills = mob.mobs.reduce((acc, mob) => acc + (bestiary[mob] || 0), 0);
    const maxKills = mob.cap;
    const nextTierKills = mobBracket.find((tier: number) => totalKills < tier && tier <= maxKills);
    const tier = nextTierKills ? mobBracket.indexOf(nextTierKills) : mobBracket.indexOf(maxKills) + 1;

    output.push({
      name: mob.name,
      texture: mob.texture,
      kills: totalKills,
      nextTierKills: nextTierKills ?? null,
      maxKills: maxKills,
      tier: tier,
      maxTier: mobBracket.indexOf(maxKills) + 1
    });
  }

  return output;
}

export function getBestiaryFamily(userProfile: Member, mobName: string) {
  const bestiary = userProfile.bestiary?.kills ?? {};
  const bestiaryConstants = NEU_CONSTANTS.get("bestiary") as NEUBestiaryConstant;
  const family = Object.values(bestiaryConstants.islands)
    .flatMap((category) => category.mobs)
    .find((mob) => mob.name === mobName);

  if (family === undefined) {
    return null;
  }

  const output = getBestiaryMobs(bestiary, [family]);
  if (!output.length) {
    return null;
  }

  return output[0];
}

export function getBestiary(userProfile: Member) {
  const bestiary = userProfile.bestiary?.kills || {};

  const categories = {} as Record<string, BestiaryCategory>;
  const bestiaryConstants = NEU_CONSTANTS.get("bestiary") as NEUBestiaryConstant;
  for (const [category, categoryData] of Object.entries(bestiaryConstants.islands)) {
    categories[category] = {
      name: categoryData.name,
      texture: categoryData.texture,
      mobs: getBestiaryMobs(bestiary, categoryData.mobs),
      mobsUnlocked: 0,
      mobsMaxed: 0
    };

    categories[category].mobsUnlocked = categories[category].mobs.reduce((acc, mob) => acc + (mob.kills > 0 ? 1 : 0), 0);
    categories[category].mobsMaxed = categories[category].mobs.reduce((acc, mob) => acc + (mob.kills >= mob.maxKills ? 1 : 0), 0);
  }

  const mobs = Object.values(categories).flatMap((category) => Object.values(category.mobs));
  const maxMilestone = mobs.map((mob) => mob.maxTier).reduce((acc, cur) => acc + cur, 0);
  const milestone = mobs.map((mob) => mob.tier).reduce((acc, cur) => acc + cur, 0);
  const familiesMaxed = mobs.filter((mob) => mob.tier === mob.maxTier).length;
  const familiesUnlocked = mobs.filter((mob) => mob.kills > 0).length;
  const totalFamilies = mobs.length;

  return {
    level: milestone / 10,
    maxLevel: maxMilestone / 10,
    familiesUnlocked: familiesUnlocked,
    familiesCompleted: familiesMaxed,
    totalFamilies: totalFamilies,
    familyTiers: milestone,
    maxFamilyTiers: maxMilestone,
    categories: categories
  };
}
