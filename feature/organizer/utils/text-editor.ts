export const findLineStart = (text: string, index: number): number => {
  const prevBreak = text.lastIndexOf("\n", Math.max(index - 1, 0));
  return prevBreak === -1 ? 0 : prevBreak + 1;
};

export const findLineEnd = (text: string, index: number): number => {
  const nextBreak = text.indexOf("\n", index);
  return nextBreak === -1 ? text.length : nextBreak;
};
