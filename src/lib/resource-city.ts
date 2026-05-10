export const RESOURCE_CITIES = [
  "Seattle",
  "Redmond",
  "Bellevue",
  "Kirkland",
  "Woodinville",
  "Tukwila",
] as const;

export type ResourceCity = (typeof RESOURCE_CITIES)[number];

export function getCityFromAddress(address: string): ResourceCity | "Other" {
  const normalizedAddress = address.trim();
  if (!normalizedAddress) return "Other";

  const addressParts = normalizedAddress
    .split(",")
    .map((part) => part.trim().toLowerCase())
    .filter(Boolean);

  for (const city of RESOURCE_CITIES) {
    const cityPattern = new RegExp(`\\b${city}\\b`, "i");
    const exactPartMatch = addressParts.some((part) => part === city.toLowerCase());

    if (exactPartMatch || cityPattern.test(normalizedAddress)) {
      return city;
    }
  }

  return "Other";
}
