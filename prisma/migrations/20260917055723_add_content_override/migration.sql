-- CreateTable
CREATE TABLE "ContentOverride" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "scope" TEXT NOT NULL,
    "entryKey" TEXT NOT NULL,
    "field" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "ContentOverride_scope_entryKey_idx" ON "ContentOverride"("scope", "entryKey");

-- CreateIndex
CREATE UNIQUE INDEX "ContentOverride_scope_entryKey_field_key" ON "ContentOverride"("scope", "entryKey", "field");
