// Weighted city list — G10 nations and major financial centers dominate,
// with a sprinkling of other global cities.
// weight controls relative probability of being picked.
const CITIES: { lat: number; lng: number; spread: number; weight: number }[] = [
  // --- G10 / major financial hubs (high weight) ---
  // US
  { lat: 40.7128, lng: -74.006, spread: 1.5, weight: 12 },   // New York
  { lat: 41.8781, lng: -87.6298, spread: 1, weight: 6 },      // Chicago
  { lat: 37.7749, lng: -122.4194, spread: 1, weight: 6 },     // San Francisco
  { lat: 34.0522, lng: -118.2437, spread: 1.2, weight: 4 },   // Los Angeles
  { lat: 30.2672, lng: -97.7431, spread: 0.8, weight: 3 },    // Austin
  // UK
  { lat: 51.5074, lng: -0.1278, spread: 0.8, weight: 12 },    // London
  { lat: 53.4808, lng: -2.2426, spread: 0.5, weight: 2 },     // Manchester
  // Japan
  { lat: 35.6762, lng: 139.6503, spread: 1, weight: 10 },     // Tokyo
  { lat: 34.6937, lng: 135.5023, spread: 0.8, weight: 3 },    // Osaka
  // Germany
  { lat: 50.1109, lng: 8.6821, spread: 0.6, weight: 8 },      // Frankfurt
  { lat: 52.52, lng: 13.405, spread: 0.8, weight: 4 },         // Berlin
  { lat: 48.1351, lng: 11.582, spread: 0.5, weight: 3 },       // Munich
  // France
  { lat: 48.8566, lng: 2.3522, spread: 0.8, weight: 8 },      // Paris
  // Canada
  { lat: 43.6532, lng: -79.3832, spread: 1, weight: 6 },      // Toronto
  { lat: 49.2827, lng: -123.1207, spread: 0.8, weight: 3 },   // Vancouver
  // Italy
  { lat: 45.4642, lng: 9.19, spread: 0.6, weight: 5 },        // Milan
  { lat: 41.9028, lng: 12.4964, spread: 0.5, weight: 2 },     // Rome
  // Netherlands
  { lat: 52.3676, lng: 4.9041, spread: 0.5, weight: 5 },      // Amsterdam
  // Belgium
  { lat: 50.8503, lng: 4.3517, spread: 0.4, weight: 3 },      // Brussels
  // Sweden
  { lat: 59.3293, lng: 18.0686, spread: 0.5, weight: 3 },     // Stockholm
  // Switzerland
  { lat: 47.3769, lng: 8.5417, spread: 0.4, weight: 5 },      // Zurich
  // Australia
  { lat: -33.8688, lng: 151.2093, spread: 1, weight: 5 },     // Sydney
  { lat: -37.8136, lng: 144.9631, spread: 0.8, weight: 3 },   // Melbourne

  // --- Other global cities (lower weight) ---
  { lat: 1.3521, lng: 103.8198, spread: 0.4, weight: 3 },     // Singapore
  { lat: 22.3193, lng: 114.1694, spread: 0.5, weight: 3 },    // Hong Kong
  { lat: 25.2048, lng: 55.2708, spread: 0.8, weight: 2 },     // Dubai
  { lat: 19.076, lng: 72.8777, spread: 1, weight: 2 },         // Mumbai
  { lat: 37.5665, lng: 126.978, spread: 0.6, weight: 2 },     // Seoul
  { lat: -23.5505, lng: -46.6333, spread: 1.2, weight: 2 },   // São Paulo
  { lat: 19.4326, lng: -99.1332, spread: 1, weight: 1 },      // Mexico City
  { lat: 30.0444, lng: 31.2357, spread: 0.8, weight: 1 },     // Cairo
  { lat: -33.9249, lng: 18.4241, spread: 0.8, weight: 1 },    // Cape Town
  { lat: -1.2921, lng: 36.8219, spread: 0.8, weight: 1 },     // Nairobi
  { lat: 13.7563, lng: 100.5018, spread: 0.6, weight: 1 },    // Bangkok
  { lat: -34.6037, lng: -58.3816, spread: 0.8, weight: 1 },   // Buenos Aires
  { lat: 55.7558, lng: 37.6173, spread: 0.8, weight: 1 },     // Moscow
  { lat: 39.9042, lng: 116.4074, spread: 1, weight: 2 },      // Beijing
  { lat: 31.2304, lng: 121.4737, spread: 0.8, weight: 2 },    // Shanghai
];

// Pre-compute cumulative weights for weighted random selection
const TOTAL_WEIGHT = CITIES.reduce((s, c) => s + c.weight, 0);

function pickCity() {
  let r = Math.random() * TOTAL_WEIGHT;
  for (const city of CITIES) {
    r -= city.weight;
    if (r <= 0) return city;
  }
  return CITIES[CITIES.length - 1];
}

function randomValue(): number {
  return Math.round(Math.random() * 999900 + 100);
}

function generatePoint() {
  const city = pickCity();
  return {
    lat: city.lat + (Math.random() - 0.5) * city.spread * 2,
    lng: city.lng + (Math.random() - 0.5) * city.spread * 2,
    value: randomValue(),
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const speed = Math.max(1, Number(searchParams.get("speed")) || 1);
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      // eslint-disable-next-line no-constant-condition
      while (true) {
        await new Promise((r) => setTimeout(r, (2000 + Math.random() * 4000) / speed));
        try {
          const data = JSON.stringify(generatePoint());
          controller.enqueue(encoder.encode(`data: ${data}\n\n`));
        } catch {
          break;
        }
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
