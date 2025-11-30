const logos = import.meta.glob('/src/assets/logos/*.png', {
  eager: true,
}) as Record<string, { default: string }>;

export const getLogo = (name: string | undefined): string | undefined => {
  const fallback = logos['/src/assets/logos/any.png']?.default;

  if (!name) return fallback;

  return logos[`/src/assets/logos/${name}.cc.png`]?.default ?? fallback;
};
