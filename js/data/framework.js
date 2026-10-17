// Content for the interactive 5-step framework explorer (Blueprint tab).
export const frameworkSteps = [
  {
    title: "Step 1: Clarify Requirements & Plan Capacity (5–10 Minutes)",
    badge: "Mandatory First Step",
    summary: "Never jump straight into drawing components. Vague prompts are intentional—your first job is to lock in scope and quantify scale so your database and storage choices are grounded in math.",
    bullets: [
      "<strong>Functional Requirements:</strong> Identify the top 2–3 core use cases (e.g., for Spotify: streaming audio and artist uploads) and explicitly agree on what is <em>out of scope</em>.",
      "<strong>Non-Functional Requirements:</strong> Clarify user scale (DAU/MAU), latency targets, read-to-write ratio, and where you need Strong Consistency vs Eventual Consistency.",
      "<strong>Back-of-the-Envelope Estimations:</strong> Calculate metadata storage (bytes × rows) vs media/blob storage (MB × files + 2–3x replication overhead) to justify SQL vs S3."
    ],
    quote: "Does this scope and these functional and non-functional requirements make sense before I move forward to the data layer and high-level design?"
  },
  {
    title: "Step 2: Data Model, Storage Choice & API Layer (15–20 Minutes)",
    badge: "Flexible Order w/ Step 3",
    summary: "Model what data you are persisting, how entities relate to one another, and the exact API contracts clients use to read and write data.",
    bullets: [
      "<strong>Database & Storage Selection:</strong> Separate structured metadata (PostgreSQL/SQL or Cassandra) from large binary blobs (AWS S3 Object Storage). State <em>why</em> you chose each store.",
      "<strong>Schema & Indexes:</strong> Define primary keys, foreign keys, and lookup indexes (such as the composite <code>playlist_item</code> index in Spotify).",
      "<strong>REST API Contracts:</strong> Define request/response formats, HTTP methods, pagination, versioning, error handling, and rate limiting at the API Gateway."
    ],
    quote: "Here are the core data models, database choices, and REST API contracts. Would you like me to dive deeper into any specific endpoint, or shall we map out the high-level architecture?"
  },
  {
    title: "Step 3: High-Level Architecture & Read/Write Workflows (15–20 Minutes)",
    badge: "Core Whiteboard Phase",
    summary: "Start with a clean, simple architecture for thousands of users—don't prematurely jump into database sharding or Kafka until the baseline flow is solid.",
    bullets: [
      "<strong>The 4 Universal Starting Components:</strong> Client (Mobile/Web/Desktop) → API Gateway / Load Balancer → Stateless API Servers → Primary Database (+ Blob Storage / Cache).",
      "<strong>Trace the Read Flow:</strong> Walk through a user action (e.g., hitting Play on a song) from JWT validation to metadata lookup, Signed URL generation, and direct chunk streaming.",
      "<strong>Trace the Write Flow:</strong> Walk through data creation (e.g., artist uploading a track, user booking a room, or sending a chat message) and explain CAP theorem trade-offs."
    ],
    quote: "This covers the end-to-end read and write flows for our baseline scale. Should we now push the scale to 50 million users and address the bottlenecks?"
  },
  {
    title: "Step 4: Scale, Bottlenecks, Failure Modes & Reliability (5–10 Minutes)",
    badge: "Practical Depth Signal",
    summary: "Once the core system works, stress-test it by multiplying users 10x–100x and asking 'What breaks first?'",
    bullets: [
      "<strong>Scaling Data & Traffic:</strong> Introduce Global CDNs for static/audio blobs, Redis caching (with explicit TTL and invalidation policy), SQL Read Replicas, or horizontal sharding.",
      "<strong>High Availability & Redundancy:</strong> Multi-Availability Zone (Multi-AZ) database failover, stateless API server auto-scaling, and async decoupling via Kafka.",
      "<strong>Observability & Fallbacks:</strong> Define API latency/error thresholds, centralized logging, alerting triggers, and graceful degradation paths."
    ],
    quote: "We've addressed the primary storage and traffic bottlenecks at 50M users. Are there specific failure scenarios you'd like me to drill into?"
  },
  {
    title: "Step 5: Wrap-Up, Trade-Offs & Future Extensions (5 Minutes)",
    badge: "Senior Summary",
    summary: "No 60-minute design is ever 'perfect.' Use the final minutes to demonstrate self-awareness of your trade-offs and how the architecture can evolve.",
    bullets: [
      "<strong>Summarize Key Trade-Offs:</strong> Reiterate why your choices fit the problem (e.g., WebSockets higher RAM cost vs real-time delivery; strong consistency lock overhead on bookings).",
      "<strong>Safe Rollouts & Evolution:</strong> Discuss how new features can be rolled out safely using Feature Flags (e.g., 20% user cohorts and stripping unsupported fields for older app versions).",
      "<strong>Next Horizon:</strong> Mention analytics pipelines, recommendation engines, or multi-region active-active replication if given more time."
    ],
    quote: "To wrap up, here are the core trade-offs we made today and how we'd extend this architecture next. Any final areas you'd like to explore?"
  }
];
