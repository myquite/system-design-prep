// Case Studies tab: Spotify, Booking.com and WhatsApp architecture simulators.
import { spotifyNodeDetails } from './data/content.js';

export function selectCaseStudy(caseId) {
  ['spotify', 'booking', 'whatsapp'].forEach(id => {
    document.getElementById('case-panel-' + id).style.display = (id === caseId) ? 'block' : 'none';
    const btn = document.getElementById('case-btn-' + id);
    btn.className = 'case-btn';
    if (id === caseId) {
      btn.classList.add('active-' + id);
    }
  });
}

// Spotify Interactive Flows & Scale Toggle
let spotifyScaled = false;
export function toggleSpotifyScale() {
  spotifyScaled = !spotifyScaled;
  const btn = document.getElementById('spotify-scale-btn');
  const cdn = document.getElementById('sp-node-cdn');
  const redis = document.getElementById('sp-node-redis');
  const sqlTitle = document.getElementById('sp-sql-title');
  const s3Title = document.getElementById('sp-s3-title');
  const log = document.getElementById('spotify-flow-log');

  if (spotifyScaled) {
    btn.textContent = "Scale Mode: 50M Users / 200M Songs (600TB)";
    btn.className = "btn btn-emerald";
    cdn.style.display = "block";
    redis.style.display = "block";
    sqlTitle.textContent = "SQL Primary + Read Replicas";
    s3Title.textContent = "Multi-Region S3 (600TB+)";
    log.innerHTML = `<strong>Scaled to 50M Users & 200M Songs ([00:34:00+ in course]):</strong><br>
    • <strong>Song Metadata:</strong> 200M × 100B = <strong>20 GB</strong> | <strong>User Metadata:</strong> 50M × 1KB = <strong>50 GB</strong> → Added <strong>Redis Cache</strong> + <strong>SQL Read Replicas</strong> to offload heavy read QPS.<br>
    • <strong>Audio Storage:</strong> 200M × 3MB = <strong>600 TB</strong> (1.2–1.8 PB with replicas) → Added <strong>Global CDN</strong> in front of S3 to stream popular songs from edge POPs close to users.`;
  } else {
    btn.textContent = "Scale Mode: Baseline (500K Users / 90TB)";
    btn.className = "btn btn-secondary";
    cdn.style.display = "none";
    redis.style.display = "none";
    sqlTitle.textContent = "SQL Database";
    s3Title.textContent = "AWS S3 Blob Store";
    log.innerHTML = `<strong>Baseline Architecture (500K Users, 30M Songs):</strong><br>
    • Simple, clean starting architecture: Mobile App → Load Balancer → Stateless API Servers → SQL DB (3GB song metadata, 500MB user metadata) + S3 Blob Storage (90TB audio files).`;
  }
}

export function simulateSpotifyFlow(mode) {
  document.querySelectorAll('#spotify-nodes .arch-node').forEach(n => n.classList.remove('active-step'));
  const log = document.getElementById('spotify-flow-log');
  if (mode === 'read') {
    ['sp-node-client', 'sp-node-lb', 'sp-node-api', 'sp-node-sql', 'sp-node-s3'].forEach(id => {
      document.getElementById(id).classList.add('active-step');
    });
    if (spotifyScaled) {
      document.getElementById('sp-node-cdn').classList.add('active-step');
      document.getElementById('sp-node-redis').classList.add('active-step');
    }
    log.innerHTML = `<strong>▶ Read Flow — User Plays a Song ([00:31:20 in course]):</strong><br>
    1. <strong>Client App</strong> sends <code>GET /v1/songs/{id}</code> with bearer JWT token.<br>
    2. <strong>Load Balancer</strong> routes request to a healthy <strong>API Server</strong>, which validates the JWT token (returns 401 if invalid).<br>
    3. <strong>API Server</strong> fetches song metadata from ${spotifyScaled ? '<strong>Redis Cache / SQL Read Replica</strong>' : '<strong>SQL Database</strong>'} and generates a temporary, expiring <strong>Signed URL</strong>.<br>
    4. <strong>Client App</strong> receives metadata + Signed URL and issues <strong>HTTP Range Requests</strong> (chunked audio streaming) directly to ${spotifyScaled ? '<strong>Global CDN / AWS S3</strong>' : '<strong>AWS S3 Blob Storage</strong>'}.`;
  } else {
    ['sp-node-client', 'sp-node-lb', 'sp-node-api', 'sp-node-sql', 'sp-node-s3'].forEach(id => {
      document.getElementById(id).classList.add('active-step');
    });
    log.innerHTML = `<strong>▲ Write Flow — Artist Uploads a Song ([00:33:01 in course]):</strong><br>
    1. <strong>Artist App</strong> sends <code>POST /v1/songs</code> with track metadata and audio payload.<br>
    2. <strong>Load Balancer & API Server</strong> authenticate the artist's JWT and authorize upload permissions.<br>
    3. Raw OGG audio file (~3MB) is stored in <strong>AWS S3 Blob Storage</strong> (accounting for 2–3x versioning overhead if artists re-upload tracks), while song metadata (100B) and S3 object URL are persisted in <strong>SQL Database</strong>.`;
  }
}

export function inspectNode(system, node) {
  document.getElementById('spotify-flow-log').innerHTML = spotifyNodeDetails[node] || '';
}

// Booking.com Simulator
export function runBookingSim(mode) {
  const log = document.getElementById('booking-flow-log');
  ['bk-node-users', 'bk-node-gw', 'bk-node-search', 'bk-node-book', 'bk-node-db', 'bk-node-pay'].forEach(id => {
    document.getElementById(id).classList.remove('active-step');
  });
  if (mode === 'naive') {
    ['bk-node-users', 'bk-node-book', 'bk-node-db'].forEach(id => document.getElementById(id).classList.add('active-step'));
    log.innerHTML = `<span style="color:var(--accent-rose); font-weight:700;">✗ FAILURE — Naive Select-Then-Insert Race Condition:</span><br>
    • <strong>t = 0ms:</strong> User A and User B both execute <code>SELECT available FROM rooms WHERE id=101</code> → Both read <code>available = 1</code>.<br>
    • <strong>t = 5ms:</strong> Both applications see 1 room left and execute <code>INSERT INTO reservations</code>.<br>
    • <strong>Result:</strong> The same last room is double-booked! The platform must cancel one reservation, issue refunds, and lose customer trust.`;
  } else if (mode === 'pessimistic') {
    ['bk-node-users', 'bk-node-gw', 'bk-node-book', 'bk-node-db', 'bk-node-pay'].forEach(id => document.getElementById(id).classList.add('active-step'));
    log.innerHTML = `<span style="color:var(--accent-amber); font-weight:700;">✓ SAFE (Higher Lock Contention) — Pessimistic Locking (SELECT ... FOR UPDATE):</span><br>
    • <strong>t = 0ms:</strong> User A starts a transaction with <code>SELECT ... FOR UPDATE</code>, locking the inventory row for Room 101.<br>
    • <strong>t = 2ms:</strong> User B's transaction blocks waiting for the lock to release.<br>
    • <strong>Trade-off:</strong> Guarantees strong consistency and zero double-bookings, but holds database locks under high traffic spikes.`;
  } else {
    ['bk-node-users', 'bk-node-gw', 'bk-node-book', 'bk-node-db', 'bk-node-pay'].forEach(id => document.getElementById(id).classList.add('active-step'));
    log.innerHTML = `<span style="color:var(--accent-emerald); font-weight:700;">✓ SENIOR PATTERN — Optimistic Concurrency Control + 10-Min Reservation Hold + Idempotency Key:</span><br>
    • <strong>Step 1 (Atomic Conditional Update):</strong> <code>UPDATE room_inventory SET available = available - 1, version = version + 1 WHERE id=101 AND version=7 AND available > 0</code>.<br>
    • <strong>Step 2 (Checkout Hold):</strong> User A wins the atomic update (1 row affected) and gets a 10-minute TTL hold while paying via Payment Service with an <strong>Idempotency Key</strong>.<br>
    • <strong>Step 3:</strong> User B's query affects 0 rows and immediately returns a clean "Room just sold out" message without locking the database!`;
  }
}

// WhatsApp Simulator
export function runWhatsappSim(mode) {
  const log = document.getElementById('whatsapp-flow-log');
  ['wa-node-sender', 'wa-node-chat', 'wa-node-flags', 'wa-node-kafka', 'wa-node-db', 'wa-node-recipient'].forEach(id => {
    document.getElementById(id).classList.remove('active-step');
  });
  if (mode === 'online') {
    ['wa-node-sender', 'wa-node-chat', 'wa-node-db', 'wa-node-recipient'].forEach(id => document.getElementById(id).classList.add('active-step'));
    log.innerHTML = `<span style="color:var(--accent-emerald); font-weight:700;">▶ Online Real-Time Delivery via Stateful WebSockets:</span><br>
    1. <strong>Sender App</strong> pushes an encrypted message over its persistent <strong>WebSocket</strong> connection to <strong>Chat Server 1</strong>.<br>
    2. <strong>Chat Server 1</strong> persists the message to <strong>Cassandra</strong> (partitioned by <code>chat_id</code>) and checks the Redis session registry to find which Chat Server holds Recipient B's WebSocket.<br>
    3. The message is routed immediately over Recipient B's open WebSocket connection in <50ms, and delivery receipts (sent/delivered/read) flow back.`;
  } else if (mode === 'offline') {
    ['wa-node-sender', 'wa-node-chat', 'wa-node-kafka', 'wa-node-db', 'wa-node-recipient'].forEach(id => document.getElementById(id).classList.add('active-step'));
    log.innerHTML = `<span style="color:var(--accent-blue); font-weight:700;">▶ Offline Recipient & Group Fan-Out via Kafka:</span><br>
    1. <strong>Chat Server</strong> writes the message to durable storage and publishes an event to the <strong>Kafka Broker</strong>.<br>
    2. Because Presence Service shows Recipient B is offline (no active WebSocket heartbeat), the Push Notification worker consumes the Kafka event and triggers an APNs/FCM mobile push notification.<br>
    3. When Recipient B reconnects, undelivered messages are synced in order.`;
  } else {
    ['wa-node-sender', 'wa-node-chat', 'wa-node-flags', 'wa-node-recipient'].forEach(id => document.getElementById(id).classList.add('active-step'));
    log.innerHTML = `<span style="color:var(--accent-purple); font-weight:700;">⚙ Gradual Feature Rollout & Client Version Stripping ([03:12:57 in course]):</span><br>
    1. Engineers roll out a new chat feature to <strong>20% of users</strong> via the <strong>Feature Flag Store</strong> (e.g., LaunchDarkly or cloud-native provider).<br>
    2. <strong>Chat Server</strong> queries enabled flags and inspects each connected client's app version.<br>
    3. Clients on <strong>v2.2+</strong> receive the full enriched message payload, while clients on <strong>&lt; v2.2</strong> automatically have unsupported fields stripped by the Chat Server so older apps never crash!`;
  }
}
