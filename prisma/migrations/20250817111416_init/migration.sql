-- CreateTable
CREATE TABLE "public"."Website" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "brand_name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Website_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Website_url_key" ON "public"."Website"("url");
