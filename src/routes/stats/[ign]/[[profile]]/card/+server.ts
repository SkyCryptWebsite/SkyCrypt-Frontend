import { building, dev } from "$app/environment";
import { env } from "$env/dynamic/public";
import appStyles from "$src/app.css?inline";
import { DefaultCard } from "$src/lib/components/cards";
import ErrorCard from "$src/lib/components/cards/default/ErrorCard.svelte";
import { parseSettingsFromParams } from "$src/lib/components/cards/default/schema";
import { getApiUuidUsername, type ModelsPlayerResolve } from "$src/lib/shared/api/orval-generated";
import { getCombined, getNetworth, getProfileStats } from "$src/lib/shared/api/skycrypt-api.remote";
import { html as toReactNode } from "satori-html";
import { render } from "svelte/server";
import type { Font, ImageSource } from "takumi-js";
import { ImageResponse } from "takumi-js/response";
import type { RequestHandler } from "./$types";

const { PUBLIC_ORIGIN: baseUrl } = env;

const { fonts, persistentImages } = await initializeAssets();

export const GET: RequestHandler = async ({ params, request, url }) => {
  const { ign, profile } = params;

  const settings = parseSettingsFromParams(url.searchParams);

  try {
    const user = (await getApiUuidUsername(ign)).data as ModelsPlayerResolve;
    const [
      // prettier-ignore
      profileData,
      networthData,
      combinedData
    ] = await Promise.all([
      // prettier-ignore
      getProfileStats({ uuid: user.uuid ?? ign, profileId: profile ?? "" }),
      getNetworth({ uuid: user.uuid ?? ign, profileId: profile ?? "" }),
      getCombined({ uuid: user.uuid ?? ign, profileId: profile ?? "" })
    ]);

    const { body: renderedHTML } = render(DefaultCard, {
      props: {
        profile: profileData,
        networth: networthData,
        dungeons: combinedData.dungeons,
        settings
      }
    });

    const isSameOrigin = request.headers.get("sec-fetch-site") === "same-origin";

    const imageResponse = new ImageResponse(toReactNode(renderedHTML), {
      width: 1500,
      height: 340,
      quality: 80,
      format: "webp",
      headers: {
        ...request.headers,
        "cache-control": dev || isSameOrigin ? "no-cache, no-store, must-revalidate" : "public, max-age=86400, immutable"
      },
      stylesheets: [appStyles],
      emoji: "twemoji",
      fonts,
      persistentImages
    });

    const response = new Response(await imageResponse.arrayBuffer(), {
      status: imageResponse.status,
      statusText: imageResponse.statusText,
      headers: imageResponse.headers
    });
    return response;
  } catch (error) {
    console.error("Error generating image:", error);
    try {
      const { body: errorHTML } = render(ErrorCard);

      const errorResponse = new ImageResponse(toReactNode(errorHTML), {
        width: 1500,
        height: 340,
        quality: 80,
        format: "webp",
        headers: {
          ...request.headers,
          "cache-control": "no-cache, no-store, must-revalidate"
        },
        stylesheets: [appStyles],
        emoji: "twemoji",
        fonts,
        persistentImages
      });

      return new Response(await errorResponse.arrayBuffer(), {
        status: 200,
        headers: errorResponse.headers
      });
    } catch (error) {
      console.error("Error generating error image:", error);
      return new Response("Internal Server Error", { status: 500 });
    }
  }
};

async function initializeAssets() {
  if (building) return { fonts: [], persistentImages: [] };
  const [
    // prettier-ignore
    montserratNormalBuffer,
    minecraftFontBuffer,
    minecraftUpperFontBuffer,
    skycryptLogo,
    skycryptBackground
  ] = await Promise.all([
    // prettier-ignore
    fetch(`${baseUrl}/fonts/montserrat/montserrat-normal.woff2`).then((res) => res.arrayBuffer()),
    fetch(`${baseUrl}/fonts/minecraft/MinecraftSevenv2-Regular.woff2`).then((res) => res.arrayBuffer()),
    fetch(`${baseUrl}/fonts/minecraft/MinecraftTenv2-Regular.woff2`).then((res) => res.arrayBuffer()),
    fetch(`${baseUrl}/favicon.png`).then((res) => res.arrayBuffer()),
    fetch(`${baseUrl}/img/bg.png`).then((res) => res.arrayBuffer())
  ]);

  const fonts: Font[] = [
    {
      name: "Montserrat",
      data: montserratNormalBuffer
    },
    {
      name: "Minecraft",
      data: minecraftFontBuffer
    },
    {
      name: "Minecraft-Upper",
      data: minecraftUpperFontBuffer
    }
  ];

  const persistentImages: ImageSource[] = [
    {
      src: "skycrypt-logo",
      data: skycryptLogo
    },
    {
      src: "skycrypt-background",
      data: skycryptBackground
    }
  ];

  return { fonts, persistentImages };
}
