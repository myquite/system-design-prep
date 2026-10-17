// Component descriptions shown when a Spotify architecture node is clicked.
export const spotifyNodeDetails = {
  client: "<strong>Client (Mobile/Desktop App):</strong> Requests song metadata via REST API, then uses the returned Signed URL to stream audio chunks via HTTP Range headers so playback starts immediately without downloading the full 3MB file.",
  cdn: "<strong>Global CDN (Edge Cache):</strong> Caches hot audio tracks at edge locations worldwide so 50M users stream from a nearby server rather than hitting origin S3 buckets.",
  lb: "<strong>API Gateway & Load Balancer:</strong> Acts as the front door—enforces rate limiting (returning remaining quota & reset timestamps), terminates TLS, and distributes traffic across stateless API servers.",
  api: "<strong>Stateless API Servers:</strong> Validates JWT authentication, queries relational metadata, and generates time-limited cryptographic Signed URLs for S3/CDN access.",
  redis: "<strong>Redis Cache Layer:</strong> Stores frequently accessed song metadata and popular playlists in memory with a TTL to keep read latency under 10ms at 50M user scale.",
  sql: "<strong>SQL Database (PostgreSQL):</strong> Stores structured relational tables (Users, Songs, Playlists, Playlist_Items) with a composite <code>playlist_item</code> index for fast joins.",
  s3: "<strong>AWS S3 Object Storage:</strong> Purpose-built for large binary blobs (90TB to 600TB+ of 3MB OGG files) with 99.999999999% durability and cost efficiency."
};

// Calculator presets, in the same units as the slider inputs.
export const calcPresets = {
  spotify_mvp: { users: 500000, userBytes: 1000, items: 30000000, itemMeta: 100, blobMb: 3.0, rep: 2.5 },
  spotify_50m: { users: 50000000, userBytes: 1000, items: 200000000, itemMeta: 100, blobMb: 3.0, rep: 2.5 },
  booking: { users: 25000000, userBytes: 1500, items: 15000000, itemMeta: 500, blobMb: 0.5, rep: 2.0 },
  whatsapp: { users: 100000000, userBytes: 500, items: 500000000, itemMeta: 200, blobMb: 0.0, rep: 3.0 },
};

export const pyramidTiers = {
  3: '<strong>Tier 3 — Senior / Staff Differentiator:</strong> Every architectural decision has a cost. Senior engineers proactively discuss trade-offs (e.g., WebSockets memory overhead vs HTTP polling latency), failure modes (what happens when Kafka or Redis goes down), gradual feature flag rollouts, and observability alerts.',
  2: '<strong>Tier 2 — Architecture & End-to-End Flows:</strong> Translating functional & non-functional requirements into capacity estimates, starting with a simple baseline design, tracing read/write journeys end-to-end, and evolving the design as user load scales 100x.',
  1: '<strong>Tier 1 — Core Building Blocks:</strong> Mastering the fundamentals: Load Balancers, API Gateways (rate limiting, JWT auth), SQL vs NoSQL databases, composite indexing, Object/Blob Storage (S3), CDNs, Redis caching, and async message queues.',
};
