CREATE TABLE sites_sync_entries (
  owner_id TEXT NOT NULL,
  storage_key TEXT NOT NULL,
  value TEXT,
  revision INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY (owner_id, storage_key)
);
