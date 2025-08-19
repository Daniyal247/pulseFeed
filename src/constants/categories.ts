export const ALL_CATEGORIES = [
  "Global News",
  "Local News",
  "Sports",
  "Technology",
  "Crypto",
  "Currency Markets",
  "Business",
  "Entertainment",
  "Science",
  "Health",
  "Politics",
  "Weather",
  "Travel",
  "Energy",
] as const;

export type Category = typeof ALL_CATEGORIES[number];
