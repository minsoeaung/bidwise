export const getFileFromSrc = async (src: string, fileName: string) => {
  const res = await fetch(src);
  const blob = await res.blob();
  return new File([blob], fileName, blob);
};
