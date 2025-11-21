const logos = import.meta.glob('/src/assets/logos/*.png', {
  eager: true,
}) as Record<string, { default: string }>;

export const getLogo = (name: string | undefined): string | undefined => {
  if (!name) return undefined;
  return logos[`/src/assets/logos/${name}.cc.png`]?.default;
};
