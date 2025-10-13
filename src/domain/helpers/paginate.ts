export function getLimitAndSkip(pageNo: number) {
  const limit = 10;
  const skip = (pageNo - 1) * limit;
  return { limit, skip };
}
