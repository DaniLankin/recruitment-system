-- DropIndex
DROP INDEX "Application_candidateId_jobId_key";

-- AlterTable
ALTER TABLE "Application" ADD COLUMN     "resume" TEXT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
