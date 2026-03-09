-- CreateTable
CREATE TABLE "page_events" (
    "id" TEXT NOT NULL,
    "page" TEXT NOT NULL,
    "event" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "page_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "page_events_page_event_idx" ON "page_events"("page", "event");

-- CreateIndex
CREATE INDEX "page_events_created_at_idx" ON "page_events"("created_at");
