-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('CEO', 'PC', 'LEAD', 'STAFF');

-- CreateEnum
CREATE TYPE "UserSegment" AS ENUM ('Language', 'International', 'Whole');

-- CreateEnum
CREATE TYPE "EomCycleStatus" AS ENUM ('DRAFT', 'NOMINATING', 'VERIFYING', 'VOTING', 'CLOSED');

-- CreateEnum
CREATE TYPE "MreCycleStatus" AS ENUM ('DRAFT', 'OPEN', 'CLOSED');

-- CreateEnum
CREATE TYPE "MreTargetGroup" AS ENUM ('ADMIN', 'ACADEMIC');

-- CreateEnum
CREATE TYPE "MreAssignmentStatus" AS ENUM ('PENDING', 'SUBMITTED');

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_tokens" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'STAFF',
    "segment" "UserSegment" NOT NULL DEFAULT 'Whole',
    "title" TEXT,
    "department" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eom_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "eom_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eom_cycles" (
    "id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "term" TEXT NOT NULL,
    "status" "EomCycleStatus" NOT NULL DEFAULT 'DRAFT',
    "openedAt" TIMESTAMP(3),
    "closedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "eom_cycles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eom_nominations" (
    "id" TEXT NOT NULL,
    "cycleId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "nomineeId" TEXT NOT NULL,
    "nominatorId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "verifiedByPC" BOOLEAN NOT NULL DEFAULT false,
    "verifiedAt" TIMESTAMP(3),
    "verifiedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "eom_nominations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eom_votes" (
    "id" TEXT NOT NULL,
    "cycleId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "voterId" TEXT NOT NULL,
    "nomineeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "eom_votes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eom_winners" (
    "id" TEXT NOT NULL,
    "cycleId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "winnerId" TEXT NOT NULL,
    "approvedByCeo" BOOLEAN NOT NULL DEFAULT false,
    "approvedAt" TIMESTAMP(3),
    "announcedOn" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "eom_winners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mre_cycles" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "opensAt" TIMESTAMP(3) NOT NULL,
    "closesAt" TIMESTAMP(3) NOT NULL,
    "status" "MreCycleStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mre_cycles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mre_rater_contexts" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "mre_rater_contexts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mre_weight_matrices" (
    "id" TEXT NOT NULL,
    "cycleId" TEXT NOT NULL,
    "targetGroup" "MreTargetGroup" NOT NULL,
    "raterContextId" TEXT NOT NULL,
    "weight" INTEGER NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT true,
    "min" INTEGER NOT NULL DEFAULT 1,
    "max" INTEGER,

    CONSTRAINT "mre_weight_matrices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mre_domains" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "mre_domains_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mre_domain_weights" (
    "id" TEXT NOT NULL,
    "cycleId" TEXT NOT NULL,
    "targetGroup" "MreTargetGroup" NOT NULL,
    "raterContextId" TEXT NOT NULL,
    "domainId" TEXT NOT NULL,
    "weight" INTEGER NOT NULL,

    CONSTRAINT "mre_domain_weights_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mre_assignments" (
    "id" TEXT NOT NULL,
    "cycleId" TEXT NOT NULL,
    "raterId" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "raterContextId" TEXT NOT NULL,
    "status" "MreAssignmentStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mre_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mre_evaluations" (
    "id" TEXT NOT NULL,
    "assignmentId" TEXT NOT NULL,
    "composite" DECIMAL(5,2) NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mre_evaluations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mre_domain_scores" (
    "id" TEXT NOT NULL,
    "evaluationId" TEXT NOT NULL,
    "domainId" TEXT NOT NULL,
    "score" INTEGER NOT NULL,

    CONSTRAINT "mre_domain_scores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activity_logs" (
    "id" TEXT NOT NULL,
    "actorId" TEXT,
    "action" TEXT NOT NULL,
    "meta" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activity_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "settings" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "valueJson" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "readAt" TIMESTAMP(3),

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_providerAccountId_key" ON "accounts"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_sessionToken_key" ON "sessions"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_token_key" ON "verification_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_identifier_token_key" ON "verification_tokens"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "eom_categories_name_key" ON "eom_categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "eom_cycles_year_month_key" ON "eom_cycles"("year", "month");

-- CreateIndex
CREATE UNIQUE INDEX "eom_nominations_cycleId_categoryId_nomineeId_key" ON "eom_nominations"("cycleId", "categoryId", "nomineeId");

-- CreateIndex
CREATE UNIQUE INDEX "eom_votes_voterId_cycleId_categoryId_key" ON "eom_votes"("voterId", "cycleId", "categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "eom_winners_cycleId_categoryId_key" ON "eom_winners"("cycleId", "categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "mre_cycles_code_key" ON "mre_cycles"("code");

-- CreateIndex
CREATE UNIQUE INDEX "mre_rater_contexts_code_key" ON "mre_rater_contexts"("code");

-- CreateIndex
CREATE UNIQUE INDEX "mre_weight_matrices_cycleId_targetGroup_raterContextId_key" ON "mre_weight_matrices"("cycleId", "targetGroup", "raterContextId");

-- CreateIndex
CREATE UNIQUE INDEX "mre_domains_code_key" ON "mre_domains"("code");

-- CreateIndex
CREATE UNIQUE INDEX "mre_domain_weights_cycleId_targetGroup_raterContextId_domai_key" ON "mre_domain_weights"("cycleId", "targetGroup", "raterContextId", "domainId");

-- CreateIndex
CREATE UNIQUE INDEX "mre_assignments_cycleId_raterId_targetId_raterContextId_key" ON "mre_assignments"("cycleId", "raterId", "targetId", "raterContextId");

-- CreateIndex
CREATE UNIQUE INDEX "mre_evaluations_assignmentId_key" ON "mre_evaluations"("assignmentId");

-- CreateIndex
CREATE UNIQUE INDEX "mre_domain_scores_evaluationId_domainId_key" ON "mre_domain_scores"("evaluationId", "domainId");

-- CreateIndex
CREATE UNIQUE INDEX "settings_key_key" ON "settings"("key");

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eom_nominations" ADD CONSTRAINT "eom_nominations_cycleId_fkey" FOREIGN KEY ("cycleId") REFERENCES "eom_cycles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eom_nominations" ADD CONSTRAINT "eom_nominations_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "eom_categories"("id") ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eom_nominations" ADD CONSTRAINT "eom_nominations_nomineeId_fkey" FOREIGN KEY ("nomineeId") REFERENCES "users"("id") ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eom_nominations" ADD CONSTRAINT "eom_nominations_nominatorId_fkey" FOREIGN KEY ("nominatorId") REFERENCES "users"("id") ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eom_votes" ADD CONSTRAINT "eom_votes_cycleId_fkey" FOREIGN KEY ("cycleId") REFERENCES "eom_cycles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eom_votes" ADD CONSTRAINT "eom_votes_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "eom_categories"("id") ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eom_votes" ADD CONSTRAINT "eom_votes_voterId_fkey" FOREIGN KEY ("voterId") REFERENCES "users"("id") ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eom_winners" ADD CONSTRAINT "eom_winners_cycleId_fkey" FOREIGN KEY ("cycleId") REFERENCES "eom_cycles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eom_winners" ADD CONSTRAINT "eom_winners_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "eom_categories"("id") ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eom_winners" ADD CONSTRAINT "eom_winners_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "users"("id") ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mre_weight_matrices" ADD CONSTRAINT "mre_weight_matrices_cycleId_fkey" FOREIGN KEY ("cycleId") REFERENCES "mre_cycles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mre_weight_matrices" ADD CONSTRAINT "mre_weight_matrices_raterContextId_fkey" FOREIGN KEY ("raterContextId") REFERENCES "mre_rater_contexts"("id") ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mre_domain_weights" ADD CONSTRAINT "mre_domain_weights_cycleId_fkey" FOREIGN KEY ("cycleId") REFERENCES "mre_cycles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mre_domain_weights" ADD CONSTRAINT "mre_domain_weights_raterContextId_fkey" FOREIGN KEY ("raterContextId") REFERENCES "mre_rater_contexts"("id") ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mre_domain_weights" ADD CONSTRAINT "mre_domain_weights_domainId_fkey" FOREIGN KEY ("domainId") REFERENCES "mre_domains"("id") ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mre_assignments" ADD CONSTRAINT "mre_assignments_cycleId_fkey" FOREIGN KEY ("cycleId") REFERENCES "mre_cycles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mre_assignments" ADD CONSTRAINT "mre_assignments_raterId_fkey" FOREIGN KEY ("raterId") REFERENCES "users"("id") ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mre_assignments" ADD CONSTRAINT "mre_assignments_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "users"("id") ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mre_assignments" ADD CONSTRAINT "mre_assignments_raterContextId_fkey" FOREIGN KEY ("raterContextId") REFERENCES "mre_rater_contexts"("id") ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mre_evaluations" ADD CONSTRAINT "mre_evaluations_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "mre_assignments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mre_domain_scores" ADD CONSTRAINT "mre_domain_scores_evaluationId_fkey" FOREIGN KEY ("evaluationId") REFERENCES "mre_evaluations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mre_domain_scores" ADD CONSTRAINT "mre_domain_scores_domainId_fkey" FOREIGN KEY ("domainId") REFERENCES "mre_domains"("id") ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
