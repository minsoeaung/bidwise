const colorPalette = ["red", "blue", "green", "yellow", "purple", "orange"];

export const pickAvatarColorPalette = (name: string) => {
  const index = name.charCodeAt(0) % colorPalette.length;
  return colorPalette[index];
};
