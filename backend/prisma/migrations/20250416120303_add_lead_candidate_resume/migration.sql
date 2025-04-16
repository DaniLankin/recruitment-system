-- CreateTable
CREATE TABLE "LeadCandidate" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "desiredRole" TEXT,
    "gender" TEXT,
    "age" INTEGER,
    "experience" INTEGER,
    "notes" TEXT,
    "resume" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LeadCandidate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LeadCandidate_email_key" ON "LeadCandidate"("email");
