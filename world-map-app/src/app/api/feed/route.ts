const MOCK_POINTS = [
  { lat: 40.7128, lng: -74.006, value: 482000 },
  { lat: 51.5074, lng: -0.1278, value: 125300 },
  { lat: 35.6762, lng: 139.6503, value: 947500 },
  { lat: -33.8688, lng: 151.2093, value: 310000 },
  { lat: -23.5505, lng: -46.6333, value: 67200 },
  { lat: 30.0444, lng: 31.2357, value: 890100 },
  { lat: 19.076, lng: 72.8777, value: 553000 },
  { lat: 48.8566, lng: 2.3522, value: 720400 },
  { lat: -33.9249, lng: 18.4241, value: 198700 },
  { lat: 19.4326, lng: -99.1332, value: 415600 },
  { lat: 55.7558, lng: 37.6173, value: 332000 },
  { lat: 1.3521, lng: 103.8198, value: 999000 },
  { lat: 37.5665, lng: 126.978, value: 610300 },
  { lat: -1.2921, lng: 36.8219, value: 145800 },
  { lat: 41.9028, lng: 12.4964, value: 278900 },
  { lat: 39.9042, lng: 116.4074, value: 850200 },
  { lat: -34.6037, lng: -58.3816, value: 203400 },
  { lat: 52.52, lng: 13.405, value: 467000 },
  { lat: 13.7563, lng: 100.5018, value: 189500 },
  { lat: 25.2048, lng: 55.2708, value: 780000 },
];

function randomValue(): number {
  return Math.round(Math.random() * 999900 + 100);
}

export async function GET() {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      // Send initial batch with slow delays to simulate real-time
      for (const point of MOCK_POINTS) {
        const data = JSON.stringify(point);
        controller.enqueue(encoder.encode(`data: ${data}\n\n`));
        await new Promise((r) => setTimeout(r, 2000 + Math.random() * 2000));
      }

      // Then keep sending new random points
      const generatePoint = () => {
        const base = MOCK_POINTS[Math.floor(Math.random() * MOCK_POINTS.length)];
        return {
          lat: base.lat + (Math.random() - 0.5) * 10,
          lng: base.lng + (Math.random() - 0.5) * 10,
          value: randomValue(),
        };
      };

      // eslint-disable-next-line no-constant-condition
      while (true) {
        await new Promise((r) => setTimeout(r, 4000 + Math.random() * 6000));
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
