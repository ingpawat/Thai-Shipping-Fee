export const REMOTE_AREAS = new Set<string>([
  "58000",
  "58110",
  "58120", // Mae Hong Son
  "84280",
  "84360", // Surat Thani (Islands)
  "82000",
  "82160", // Phang Nga (Islands)
  "94000",
  "95000",
  "96000", // Deep South
]);

export function isRemoteArea(postalCode: string | number): boolean {
  return REMOTE_AREAS.has(postalCode.toString());
}
