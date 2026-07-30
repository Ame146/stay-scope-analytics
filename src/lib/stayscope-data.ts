export type Neighborhood = {
  id: string;
  name: string;
  city: string;
  x: number; // % position on the map canvas
  y: number;
  price: number;
  occupancy: number;
  revenue: number;
  reviews: number;
  listings: number;
  topHost: string;
  hostListings: number;
  trend: number;
  badge?: "Top Pick" | "Rising" | "Premium";
  summary: string;
  photo: string;
  series: { m: string; price: number; occupancy: number }[];
};

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function series(basePrice: number, baseOcc: number) {
  return months.map((m, i) => ({
    m,
    price: Math.round(basePrice * (1 + 0.16 * Math.sin((i / 12) * Math.PI * 2 - 0.7))),
    occupancy: Math.min(
      98,
      Math.round(baseOcc * (1 + 0.12 * Math.sin((i / 12) * Math.PI * 2 - 0.2)) * 10) / 10,
    ),
  }));
}

export const neighborhoods: Neighborhood[] = [
  {
    id: "sea-cliff",
    name: "Sea Cliff",
    city: "San Francisco",
    x: 22,
    y: 28,
    price: 412,
    occupancy: 91.2,
    revenue: 2840000,
    reviews: 4.94,
    listings: 318,
    topHost: "Marisol Vega",
    hostListings: 24,
    trend: 14.2,
    badge: "Top Pick",
    summary:
      "Highest sustained occupancy in the coastal corridor with premium nightly rates and near-perfect guest sentiment.",
    photo:
      "https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=900&q=70",
    series: series(412, 91.2),
  },
  {
    id: "harbor-point",
    name: "Harbor Point",
    city: "San Francisco",
    x: 46,
    y: 18,
    price: 356,
    occupancy: 84.6,
    revenue: 2110000,
    reviews: 4.81,
    listings: 452,
    topHost: "Idris Kane",
    hostListings: 31,
    trend: 9.4,
    badge: "Rising",
    summary:
      "Waterfront inventory expanding quickly; revenue per listing is climbing faster than the city average.",
    photo:
      "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&w=900&q=70",
    series: series(356, 84.6),
  },
  {
    id: "old-quarter",
    name: "Old Quarter",
    city: "San Francisco",
    x: 64,
    y: 44,
    price: 288,
    occupancy: 78.3,
    revenue: 1580000,
    reviews: 4.72,
    listings: 613,
    topHost: "Nora Adeyemi",
    hostListings: 19,
    trend: 4.1,
    summary:
      "Dense historic core with steady demand. Pricing power is limited but turnover and review volume are strong.",
    photo:
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=900&q=70",
    series: series(288, 78.3),
  },
  {
    id: "lantern-hill",
    name: "Lantern Hill",
    city: "San Francisco",
    x: 34,
    y: 62,
    price: 244,
    occupancy: 64.1,
    revenue: 890000,
    reviews: 4.55,
    listings: 271,
    topHost: "Tomas Lind",
    hostListings: 12,
    trend: -3.6,
    summary:
      "Softening occupancy against rising supply. Consider seasonal pricing before adding inventory here.",
    photo:
      "https://images.unsplash.com/photo-1524230572899-a752b3835840?auto=format&fit=crop&w=900&q=70",
    series: series(244, 64.1),
  },
  {
    id: "vista-park",
    name: "Vista Park",
    city: "San Francisco",
    x: 78,
    y: 66,
    price: 331,
    occupancy: 88.0,
    revenue: 1960000,
    reviews: 4.88,
    listings: 204,
    topHost: "Amara Diaz",
    hostListings: 16,
    trend: 11.7,
    badge: "Premium",
    summary:
      "Boutique supply with the strongest review scores in the dataset and low cancellation rates.",
    photo:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=70",
    series: series(331, 88.0),
  },
  {
    id: "north-mill",
    name: "North Mill",
    city: "San Francisco",
    x: 56,
    y: 80,
    price: 198,
    occupancy: 58.4,
    revenue: 610000,
    reviews: 4.31,
    listings: 189,
    topHost: "Ben Okafor",
    hostListings: 9,
    trend: -7.2,
    summary:
      "Lowest occupancy segment. Value plays exist but require aggressive minimum-stay and pricing changes.",
    photo:
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=70",
    series: series(198, 58.4),
  },
];

export const kpis = [
  {
    key: "price",
    label: "Average Price",
    value: 314.42,
    prefix: "$",
    delta: 6.8,
    caption: "Compared to last month",
    tone: "sky" as const,
    spark: [268, 274, 281, 292, 288, 301, 309, 314],
  },
  {
    key: "occupancy",
    label: "Occupancy",
    value: 82.4,
    suffix: "%",
    delta: 3.1,
    caption: "Portfolio-weighted average",
    tone: "primary" as const,
    spark: [71, 74, 73, 78, 80, 79, 81, 82],
  },
  {
    key: "revenue",
    label: "Revenue",
    value: 2.84,
    prefix: "$",
    suffix: "M",
    delta: 14.0,
    caption: "Trailing 30 days",
    tone: "gold" as const,
    spark: [1.9, 2.0, 2.15, 2.3, 2.42, 2.55, 2.71, 2.84],
  },
  {
    key: "reviews",
    label: "Review Score",
    value: 4.78,
    delta: 0.9,
    caption: "Across 12,480 reviews",
    tone: "accent" as const,
    spark: [4.55, 4.6, 4.62, 4.66, 4.7, 4.72, 4.75, 4.78],
  },
];

export const revenueTrend = [
  { m: "Jan", revenue: 1.62, occupancy: 63 },
  { m: "Feb", revenue: 1.74, occupancy: 66 },
  { m: "Mar", revenue: 1.98, occupancy: 72 },
  { m: "Apr", revenue: 2.14, occupancy: 76 },
  { m: "May", revenue: 2.29, occupancy: 79 },
  { m: "Jun", revenue: 2.52, occupancy: 84 },
  { m: "Jul", revenue: 2.78, occupancy: 89 },
  { m: "Aug", revenue: 2.84, occupancy: 91 },
  { m: "Sep", revenue: 2.61, occupancy: 86 },
  { m: "Oct", revenue: 2.38, occupancy: 81 },
  { m: "Nov", revenue: 2.11, occupancy: 74 },
  { m: "Dec", revenue: 2.46, occupancy: 83 },
];

export const priceTrend = revenueTrend.map((d, i) => ({
  m: d.m,
  price: Math.round(268 + i * 5 + 34 * Math.sin(i / 2)),
  market: Math.round(255 + i * 4 + 22 * Math.sin(i / 2 + 0.6)),
}));

export const hosts = [
  { name: "Marisol Vega", area: "Sea Cliff", listings: 24, revenue: 486000, score: 4.96 },
  { name: "Idris Kane", area: "Harbor Point", listings: 31, revenue: 441000, score: 4.88 },
  { name: "Amara Diaz", area: "Vista Park", listings: 16, revenue: 372000, score: 4.93 },
  { name: "Nora Adeyemi", area: "Old Quarter", listings: 19, revenue: 318000, score: 4.79 },
  { name: "Tomas Lind", area: "Lantern Hill", listings: 12, revenue: 214000, score: 4.61 },
];

export const reviews = [
  {
    guest: "Priya N.",
    area: "Sea Cliff",
    score: 5,
    text: "Ocean view suite was immaculate. Check-in took under a minute and the host left local recommendations.",
  },
  {
    guest: "Daniel R.",
    area: "Vista Park",
    score: 5,
    text: "Best value in the city for a two-bedroom. Quiet street, fast wifi, spotless kitchen.",
  },
  {
    guest: "Hannah W.",
    area: "Old Quarter",
    score: 4,
    text: "Great location for walking everywhere. Street noise at night was the only downside.",
  },
];

export const seasonality = [
  { q: "Winter", demand: 58 },
  { q: "Spring", demand: 76 },
  { q: "Summer", demand: 94 },
  { q: "Fall", demand: 81 },
];

export const availability = [
  { label: "Booked", value: 68 },
  { label: "Blocked", value: 11 },
  { label: "Open", value: 21 },
];

export const insights = [
  {
    tone: "primary" as const,
    title: "Raise Sea Cliff weekend rates 8%",
    body: "Occupancy has held above 90% for 9 straight weeks while nightly price lags comparable coastal inventory.",
  },
  {
    tone: "gold" as const,
    title: "Harbor Point is the best entry point",
    body: "Revenue per listing is growing 2.4x faster than the city average with supply still below saturation.",
  },
  {
    tone: "coral" as const,
    title: "Reprice North Mill before Q4",
    body: "Occupancy fell 7.2% year over year. A 3-night minimum plus a 6% cut should recover demand.",
  },
];

export const currency = (n: number) =>
  n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(2)}M` : `$${(n / 1000).toFixed(0)}K`;
