// Capacity Calculator tab: back-of-the-envelope storage estimates + recommendations.
import { calcPresets } from './data/content.js';
import { load, save } from './storage.js';

// Maps each calculator field to its slider input id.
const INPUTS = {
  users: 'inp-users',
  userBytes: 'inp-user-bytes',
  items: 'inp-items',
  itemMeta: 'inp-item-meta',
  blobMb: 'inp-blob-mb',
  rep: 'inp-rep',
};

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const tb = bytes / 1e12;
  if (tb >= 1000) return (tb / 1000).toFixed(2) + ' PB';
  if (tb >= 1) return tb.toFixed(1) + ' TB';
  const gb = bytes / 1e9;
  if (gb >= 1) return gb.toFixed(1) + ' GB';
  const mb = bytes / 1e6;
  return mb.toFixed(1) + ' MB';
}

function readInputs() {
  return Object.fromEntries(
    Object.entries(INPUTS).map(([key, id]) => [key, parseFloat(document.getElementById(id).value)])
  );
}

function writeInputs(values) {
  Object.entries(INPUTS).forEach(([key, id]) => {
    if (values[key] !== undefined) document.getElementById(id).value = values[key];
  });
}

function updateCalculator() {
  const { users, userBytes, items, itemMeta, blobMb, rep } = readInputs();
  save('calculator', { users, userBytes, items, itemMeta, blobMb, rep });

  document.getElementById('lbl-users').textContent = users.toLocaleString();
  document.getElementById('lbl-user-bytes').textContent = userBytes.toLocaleString() + ' B';
  document.getElementById('lbl-items').textContent = items.toLocaleString();
  document.getElementById('lbl-item-meta').textContent = itemMeta.toLocaleString() + ' B';
  document.getElementById('lbl-blob-mb').textContent = blobMb.toFixed(1) + ' MB';
  document.getElementById('lbl-rep').textContent = rep.toFixed(1) + 'x';

  const userStorage = users * userBytes;
  const itemStorage = items * itemMeta;
  const rawBlobStorage = items * blobMb * 1e6;
  const totalBlobStorage = rawBlobStorage * rep;

  document.getElementById('out-user-storage').textContent = formatBytes(userStorage);
  document.getElementById('out-item-storage').textContent = formatBytes(itemStorage);
  document.getElementById('out-blob-raw').textContent = formatBytes(rawBlobStorage);
  document.getElementById('out-blob-total').textContent = formatBytes(totalBlobStorage);

  const recs = [];
  const totalMetaGb = (userStorage + itemStorage) / 1e9;
  if (totalMetaGb < 100) {
    recs.push(`• <strong>Metadata Storage (${totalMetaGb.toFixed(1)} GB):</strong> Easily fits on a single relational SQL primary database (e.g., PostgreSQL) without horizontal sharding. Use composite indexes (like <code>playlist_item</code>) for fast lookups.`);
  } else {
    recs.push(`• <strong>Metadata Storage (${totalMetaGb.toFixed(1)} GB):</strong> High metadata volume—introduce read replicas, Redis caching for hot records, and partition/shard large tables by user or entity ID.`);
  }

  if (rawBlobStorage > 0) {
    recs.push(`• <strong>Media / Blob Storage (${formatBytes(rawBlobStorage)} raw → ${formatBytes(totalBlobStorage)} w/ ${rep}x replication):</strong> Never store binary files in SQL. Offload to <strong>AWS S3 Object Storage</strong> accessed via expiring <strong>Signed URLs</strong> and chunked HTTP Range Requests.`);
  } else {
    recs.push(`• <strong>Text-Only Workload (0 MB blobs):</strong> Focus optimization on low-latency database writes, connection pooling, and in-memory caching.`);
  }

  if (users >= 10000000) {
    recs.push(`• <strong>High User Scale (${(users / 1e6).toFixed(1)}M Users):</strong> Add a <strong>Global CDN</strong> for static/media delivery, <strong>Redis Cache</strong> in front of the database, and multiple stateless API servers behind Load Balancers across Availability Zones.`);
  } else {
    recs.push(`• <strong>Baseline Scale (${(users / 1e6).toFixed(2)}M Users):</strong> Keep the initial architecture simple! Start with Load Balancer → Stateless API Servers → Primary DB + S3 before adding unnecessary distributed complexity.`);
  }

  document.getElementById('calc-recommendations').innerHTML = recs.join('<br>');
}

export function loadCalcPreset(preset) {
  writeInputs(calcPresets[preset]);
  updateCalculator();
}

export function initCalculator() {
  writeInputs(load('calculator', {}));
  Object.values(INPUTS).forEach(id => {
    document.getElementById(id).addEventListener('input', updateCalculator);
  });
  updateCalculator();
}
