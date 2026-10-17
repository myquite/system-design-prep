// Starter notes for each mock-interview prompt (Workbench tab).
export const workbenchPrompts = {
  spotify: {
    s1: "• In Scope: Audio streaming (play song), Artist song upload, Playlists.\n• Out of Scope: Podcast video, live concerts, social feed.\n• Scale: 500K users (30M songs) -> scaling to 50M users (200M songs).\n• Math: 200M * 3MB OGG = 600TB audio (1.5PB w/ replicas); 200M * 100B = 20GB song metadata; 50M * 1KB = 50GB user metadata.",
    s2: "• Storage: PostgreSQL for structured relational metadata (Users, Songs, Playlists, Playlist_Items w/ composite index) + AWS S3 for raw 3MB OGG audio blobs.\n• Endpoints:\n  GET /v1/songs/{id} -> returns metadata + expiring Signed URL\n  POST /v1/songs -> artist uploads track metadata + presigned S3 upload",
    s3: "• Baseline Architecture: Mobile App -> API Gateway/LB -> Stateless API Servers -> SQL DB + S3 Blob Store.\n• Read Flow: Client GET /songs/{id} -> JWT verified -> Query SQL metadata -> Generate Signed URL -> Client streams audio chunks via HTTP Range Requests from S3/CDN.",
    s4: "• Scaling to 50M users: Add Global CDN for hot tracks, Redis cache for metadata/playlists, SQL Read Replicas.\n• Reliability: Multi-AZ failover, API Gateway rate limiting, latency & 5xx error rate alerts."
  },
  booking: {
    s1: "• In Scope: Hotel/room search, viewing availability, booking a room & payment.\n• Non-Functional: Eventual consistency OK for search/discovery; Strict Strong Consistency required for booking write path (zero double bookings).",
    s2: "• Storage: PostgreSQL (ACID) for Reservations & Room Inventory; Elasticsearch for fast geo/filter hotel search; Redis for caching.\n• Concurrency Control: Optimistic locking (version column) or Pessimistic locking (SELECT FOR UPDATE) + 10-min checkout hold TTL.",
    s3: "• Search Flow: Client -> API Gateway -> Search Service -> Elasticsearch.\n• Booking Flow: Client -> API Gateway -> Booking Service -> Atomic conditional update in PostgreSQL -> Payment Gateway with Idempotency Key.",
    s4: "• Scaling & Failures: Async CDC (Kafka) from PostgreSQL to Elasticsearch; background expiration worker to release unpaid 10-min holds; multi-AZ DB replicas."
  },
  whatsapp: {
    s1: "• In Scope: 1:1 and group real-time chat, online/offline presence, push notifications, safe feature rollouts.\n• Non-Functional: Sub-100ms real-time delivery, high write throughput, backward compatibility across client versions.",
    s2: "• Protocol: Stateful WebSockets between Client and Chat Servers (worth higher RAM overhead vs HTTP polling for real-time bidirectional latency).\n• Database: Wide-column NoSQL (Cassandra) for massive message write volume + Redis for session routing & presence heartbeats.",
    s3: "• Online Flow: Sender -> WebSocket -> Chat Server -> Cassandra + Redis lookup -> Recipient Chat Server -> Recipient WebSocket.\n• Offline Flow: Chat Server -> Kafka Broker -> Push Notification Service (APNs/FCM).",
    s4: "• Feature Flag Rollout: Gradual 20% user cohort enablement via Feature Flag Store; Chat Server strips unsupported fields for clients below v2.2."
  },
  custom: { s1: "", s2: "", s3: "", s4: "" }
};
