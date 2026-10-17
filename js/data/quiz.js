// Scenario quiz questions (Trade-Off Arena tab). `answer` is the index of the correct option.
export const quizData = [
  {
    q: "1. Where should the Rate Limiter component live in your overall system architecture?",
    options: [
      "Deep inside the backend next to the primary SQL database",
      "At the front door of the system inside the API Gateway before requests hit internal services",
      "Inside the asynchronous Kafka consumer worker nodes",
      "Only inside the client-side mobile application UI"
    ],
    answer: 1,
    explanation: "Because a rate limiter rejects excess API requests, it should sit as early as possible at the front door (the API Gateway) and return headers showing remaining quota and reset time so downstream services and databases are protected."
  },
  {
    q: "2. In the Spotify case study (200M songs, 50M users), why do we store audio files in Blob Storage (S3) and metadata in SQL?",
    options: [
      "Because SQL databases cannot store strings longer than 50 characters",
      "Because 200M songs × 3MB = 600TB of binary audio blobs (1.2–1.8PB w/ replicas), whereas song metadata (20GB) and user metadata (50GB) are small, structured, and require relational queries/indexes",
      "Because S3 automatically writes SQL JOIN queries for playlists",
      "Because audio files require strong ACID serializable transactions on every byte"
    ],
    answer: 1,
    explanation: "At 50M users and 200M songs, song metadata is only ~20GB and user metadata is ~50GB—ideal for SQL with composite indexes like playlist_item. Meanwhile, 600TB+ of 3MB OGG files belong in S3 object storage served via Signed URLs and CDN."
  },
  {
    q: "3. How does the Spotify architecture safely allow a mobile client to stream a song from S3/CDN without making the entire bucket public?",
    options: [
      "By hardcoding AWS root credentials inside the mobile app",
      "By streaming the entire 3MB audio file through the SQL database connection",
      "The API server validates the user's JWT, fetches metadata, and returns a temporary expiring Signed URL that the client uses with HTTP Range Requests",
      "By emailing the user an MP3 attachment"
    ],
    answer: 2,
    explanation: "The API server authenticates the user's JWT, queries SQL for metadata, and generates a time-limited Signed URL. The client then makes direct HTTP Range Requests to S3/CDN for audio chunks."
  },
  {
    q: "4. Why does a simple SELECT-then-INSERT approach fail when designing Booking.com's hotel reservation flow?",
    options: [
      "Because SQL databases do not support INSERT statements",
      "Two concurrent users can SELECT the same last available room at the exact same millisecond before either INSERT completes, causing a double booking",
      "Because Elasticsearch blocks SQL queries",
      "Because hotel rooms change physical locations every hour"
    ],
    answer: 1,
    explanation: "Under concurrency, two users reading available_count = 1 simultaneously will both proceed to insert a reservation. Preventing double bookings requires strong consistency on the write path (e.g., optimistic concurrency version checks or pessimistic locking + reservation hold TTL)."
  },
  {
    q: "5. In Booking.com, how should you apply the CAP theorem across the Search/Discovery path vs the Booking/Checkout path?",
    options: [
      "Use Eventual Consistency for Booking/Checkout and Strong Consistency for Search",
      "Use Eventual Consistency (high availability & low latency via Elasticsearch/Redis) for Search, and Strong Consistency (ACID SQL) for the Booking write path",
      "Drop both consistency and availability for all endpoints",
      "Run every search query as a serializable lock across all users"
    ],
    answer: 1,
    explanation: "Search and discovery tolerate a few seconds of eventual consistency in exchange for fast geo/filter queries in Elasticsearch, whereas reserving a room requires strict strong consistency so the same room is never sold twice."
  },
  {
    q: "6. When designing WhatsApp, what is the primary trade-off of choosing WebSockets over HTTP Polling?",
    options: [
      "WebSockets cannot send text data",
      "WebSockets use more server memory to maintain stateful open connections, but provide ultra-low-latency bidirectional real-time delivery",
      "WebSockets are slower than HTTP short polling for chat apps",
      "WebSockets automatically shard SQL databases"
    ],
    answer: 1,
    explanation: "As highlighted in the course (03:14:49), every decision has costs: WebSockets require stateful servers and more memory than stateless HTTP requests, but for a real-time messaging app that trade-off is well worth it."
  },
  {
    q: "7. In the WhatsApp architecture (03:12:57), how do you safely roll out a new message feature when some users are still on older client app versions (e.g., below v2.2)?",
    options: [
      "Force-delete accounts of users on older app versions",
      "Use a Feature Flag Store for gradual rollout (e.g., 20% of users) and have the Chat Server strip unsupported payload fields for clients below v2.2",
      "Create a separate company for every app version",
      "Wait 5 years until 100% of phones update before deploying backend code"
    ],
    answer: 1,
    explanation: "The Chat Server queries the Feature Flag Store (for gradual cohort rollout) and checks the recipient client version, stripping unsupported fields for client apps below v2.2 to maintain backward compatibility."
  },
  {
    q: "8. What is the biggest red flag candidates make in the first 5 minutes of a system design interview?",
    options: [
      "Asking clarifying questions about functional and non-functional requirements",
      "Jumping straight into drawing load balancers, Kafka, and database sharding before clarifying the scope and estimating capacity",
      "Checking in with the interviewer to align on scope",
      "Starting with a simple high-level design before optimizing bottlenecks"
    ],
    answer: 1,
    explanation: "Jumping into solutions or complex distributed tools (like Kafka or sharding) before clarifying requirements and scale is an immediate red flag across Communication, Structured Thinking, and Technical Judgment."
  }
];
