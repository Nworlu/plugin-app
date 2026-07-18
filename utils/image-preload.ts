import {
  currentlyHappeningEvents,
  resourcesList,
  upcomingEvents,
  venuesList,
} from "@/feature/organizer/constants/home";
import { ONBOARDING_IMAGE_SOURCES } from "@/constants/onboarding-slides";
import { Asset } from "expo-asset";
import { Image } from "expo-image";

const AUTH_IMAGE_SOURCES = [
  require("@/assets/images/event-login.webp"),
  require("@/assets/images/event-register.jpg"),
  require("@/assets/images/event-verify.jpg"),
] as const;

const HOME_IMAGE_SOURCES = [
  ...venuesList.map((venue) => venue.image as number),
  ...resourcesList.map((resource) => resource.image as number),
  ...upcomingEvents.map((event) => event.image as number),
  ...currentlyHappeningEvents.map((event) => event.image as number),
  require("@/assets/images/home/publish-1.png"),
  require("@/assets/images/home/publish-2.png"),
  require("@/assets/images/calender-empty.png"),
] as const;

async function preloadBundledImages(images: readonly number[]) {
  if (images.length === 0) return;

  const assets = await Asset.loadAsync(images as number[]);
  await Promise.all(
    assets.map((asset) =>
      Image.prefetch(asset.localUri ?? asset.uri).catch(() => {}),
    ),
  );
}

export async function preloadOnboardingImages() {
  await preloadBundledImages(ONBOARDING_IMAGE_SOURCES);
}

export async function preloadAuthImages() {
  await preloadBundledImages(AUTH_IMAGE_SOURCES);
}

export async function preloadHomeImages() {
  await preloadBundledImages(HOME_IMAGE_SOURCES);
}

export async function preloadRemoteImages(urls: (string | null | undefined)[]) {
  const uniqueUrls = [...new Set(urls.filter((url): url is string => !!url))];
  if (uniqueUrls.length === 0) return;

  await Promise.all(
    uniqueUrls.map((url) => Image.prefetch(url).catch(() => {})),
  );
}
