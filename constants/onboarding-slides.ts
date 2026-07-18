export const ONBOARDING_SLIDES = [
  {
    id: "1",
    image: require("@/assets/images/event-image.avif"),
  },
  {
    id: "2",
    image: require("@/assets/images/event-image-2.webp"),
  },
  {
    id: "3",
    image: require("@/assets/images/event-image-3.avif"),
  },
] as const;

export const ONBOARDING_IMAGE_SOURCES = ONBOARDING_SLIDES.map(
  (slide) => slide.image,
);
