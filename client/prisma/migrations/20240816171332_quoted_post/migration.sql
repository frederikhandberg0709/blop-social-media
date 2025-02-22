-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "quoteCount" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "QuotedPost" (
    "id" TEXT NOT NULL,
    "quotedPostId" TEXT NOT NULL,
    "quotingPostId" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuotedPost_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "QuotedPost_quotedPostId_quotingPostId_key" ON "QuotedPost"("quotedPostId", "quotingPostId");

-- AddForeignKey
ALTER TABLE "QuotedPost" ADD CONSTRAINT "QuotedPost_quotedPostId_fkey" FOREIGN KEY ("quotedPostId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuotedPost" ADD CONSTRAINT "QuotedPost_quotingPostId_fkey" FOREIGN KEY ("quotingPostId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
