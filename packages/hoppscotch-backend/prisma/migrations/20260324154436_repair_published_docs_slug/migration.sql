-- Repair migration: ensure slug column exists in PublishedDocs
-- This fixes databases where the 20251207122817_add_slug_to_published_docs migration was not applied

-- Step 1: Add slug column if it does not exist yet (no-op when already present)
ALTER TABLE "PublishedDocs" ADD COLUMN IF NOT EXISTS "slug" TEXT;

-- Step 2: Backfill slug using the record id for any rows that still have a NULL slug
UPDATE "PublishedDocs" SET "slug" = "id" WHERE "slug" IS NULL;

-- Step 3: Enforce NOT NULL on slug (idempotent: already NOT NULL on up-to-date databases)
ALTER TABLE "PublishedDocs" ALTER COLUMN "slug" SET NOT NULL;

-- Step 4: Create unique index on (slug, version) if it does not exist
CREATE UNIQUE INDEX IF NOT EXISTS "PublishedDocs_slug_version_key" ON "PublishedDocs"("slug", "version");

-- Step 5: Create index on collectionID if it does not exist
CREATE INDEX IF NOT EXISTS "PublishedDocs_collectionID_idx" ON "PublishedDocs"("collectionID");
