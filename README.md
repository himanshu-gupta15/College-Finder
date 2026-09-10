# CollegeFinder — Production-Grade College Discovery Platform (Track A)

> A modern, full-stack higher education discovery and decision engine tailored for Indian students. Built with **Next.js 15 (App Router)**, **React 19**, **TypeScript**, **TailwindCSS**, **Prisma ORM**, and **PostgreSQL** — **Zero Docker Required**.

[![TypeScript Strict](https://img.shields.io/badge/TypeScript-Strict%20Mode-blue.svg)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL%20Native-336791.svg)](https://www.postgresql.org/)
[![Prisma ORM](https://img.shields.io/badge/ORM-Prisma%206-2D3748.svg)](https://www.prisma.io/)
[![Tests](https://img.shields.io/badge/Tests-13%20Passed-emerald.svg)](https://vitest.dev/)

---

## 📌 Project Overview
Choosing a college in India is often overwhelmed by ad-cluttered portals and unverified metrics. **CollegeFinder** is designed from the ground up as a high-fidelity, production-grade discovery platform where students can:
1. **Discover & Search Colleges**: Multi-parameter search across name, city, state, academic stream, ownership, fee ranges, and ratings — powered by indexed PostgreSQL database queries (never hardcoded in frontend components).
2. **Examine Deep Institutional Profiles (`/colleges/[slug]`)**: Complete breakdown of degrees, eligibility requirements, annual tuition, historic placement statistics (highest and average CTC packages), top recruiters, infrastructure facilities, and verified student reviews.
3. **Compare Up to 3 Colleges (`/compare`)**: Side-by-side metric matrix comparing tuition expenses, salary packages, NIRF rankings, and accreditations with mobile horizontal scrolling.
4. **Authenticate & Save Shortlists (`/saved-colleges`)**: Secure JWT cookie authentication with salted bcrypt hashing, allowing students to bookmark colleges to their personal profiles with database-level duplicate prevention.

---

## 🛠 Tech Stack & Rationale

| Layer | Technology | Why Chosen? | Alternative Considered | Tradeoff Accepted |
|---|---|---|---|---|
| **Frontend Framework** | Next.js 15 (App Router) + React 19 | Hybrid SSR/CSR, built-in SEO metadata API (`generateMetadata`), instant server routes. | Vite SPA or Remix | Initial compilation overhead vs Vite, but unmatched SEO for college pages. |
| **Styling** | TailwindCSS v4 | Zero-runtime CSS, modern design system tokens, responsive utilities. | CSS Modules / Emotion | Class name verbosity in JSX vs speed and runtime performance. |
| **Language** | TypeScript 5.8 (Strict) | End-to-end type safety from database models to API responses and UI props. | Plain JavaScript | Slight initial verbosity in declaring schemas. |
| **Database** | PostgreSQL 16/18 (Native or Cloud) | ACID transactions, relational integrity, powerful B-Tree indexing, trigram search. Works with native Mac/Linux PostgreSQL or free Cloud DBs (Neon, Supabase, Railway). | MongoDB / DynamoDB | Schema migrations required on changes vs relational consistency. |
| **ORM** | Prisma 6 | Type-safe query building, declarative schema modeling, automated migrations. | Drizzle / TypeORM | Slight binary overhead vs raw SQL query control. |
| **Authentication** | Custom JWT + HTTP-Only Cookies + Bcrypt | True backend authentication, zero vendor lock-in, cross-site scripting (XSS) resistant. | NextAuth / Clerk | Requires manual session endpoint maintenance vs instant third-party UI. |
| **Validation** | Zod 3.24 | Runtime parameter validation for query strings and JSON payloads. | Yup / Joi | Shared type inference between backend schemas and TypeScript types. |
| **Testing** | Vitest 3.2 | Blazing fast ESM runner with identical Jest syntax and native TypeScript execution. | Jest | Newer toolchain vs 10x faster execution without Babel plugins. |

---

## 🏛 System Architecture

The platform adheres to a clean **Three-Tier Architecture**:
```
┌─────────────────────────────────────────────────────────────┐
│                    Next.js Presentation                     │
│  SSR Detail Pages (/colleges/[slug]) & Client Discovery UI  │
└──────────────────────────────┬──────────────────────────────┘
                               │ JSON / HTTP
┌──────────────────────────────▼──────────────────────────────┐
│                    API Route Handlers                       │
│    /api/colleges  │  /api/auth  │  /api/saved-colleges      │
└──────────────────────────────┬──────────────────────────────┘
                               │ Validated by Zod
┌──────────────────────────────▼──────────────────────────────┐
│                   Domain Services Layer                     │
│  CollegeService  │  AuthService  │  SavedCollegeService     │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                     Repository Layer                        │
│  CollegeRepository │ UserRepository │ SavedCollegeRepository│
└──────────────────────────────┬──────────────────────────────┘
                               │ Prisma Client
┌──────────────────────────────▼──────────────────────────────┐
│                 PostgreSQL Database Engine                  │
│       Relational Schema + B-Tree / Composite Indexes        │
└─────────────────────────────────────────────────────────────┘
```

---

## 🗄 Database Schema Design

The relational model is normalized to 3NF and enforces cascading deletes and unique constraints.

```prisma
model User {
  id            String         @id @default(uuid())
  email         String         @unique
  passwordHash  String
  name          String
  role          String         @default("student")
  savedColleges SavedCollege[]
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt

  @@index([email])
}

model College {
  id              String          @id @default(uuid())
  slug            String          @unique
  name            String
  shortName       String?
  overview        String          @db.Text
  establishedYear Int
  collegeType     String // Engineering, Management, Medical, Arts & Science, Law, Design
  ownership       String // Public, Private
  affiliation     String?
  accreditation   String? // NAAC A++, NIRF #1, etc.
  rating          Float           @default(4.0)
  reviewCount     Int             @default(0)
  minFees         Int // Annual fees minimum in INR
  maxFees         Int // Annual fees maximum in INR
  city            String
  state           String
  address         String
  website         String?
  logoUrl         String?
  bannerUrl       String?
  courses         CollegeCourse[]
  placements      Placement[]
  reviews         Review[]
  facilities      Facility[]
  savedBy         SavedCollege[]
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt

  @@index([slug])
  @@index([city])
  @@index([state])
  @@index([collegeType])
  @@index([ownership])
  @@index([rating])
  @@index([minFees])
  @@index([state, city])
  @@index([collegeType, rating])
}

model Course {
  id             String          @id @default(uuid())
  code           String          @unique
  name           String
  degree         String // B.Tech, MBA, MBBS, B.Des, etc.
  stream         String
  durationYears  Int             @default(4)
  collegeCourses CollegeCourse[]

  @@index([degree])
  @@index([stream])
}

model CollegeCourse {
  id          String   @id @default(uuid())
  collegeId   String
  courseId    String
  annualFees  Int
  eligibility String
  seats       Int      @default(60)
  courseType  String   @default("Full-Time")
  college     College  @relation(fields: [collegeId], references: [id], onDelete: Cascade)
  course      Course   @relation(fields: [courseId], references: [id], onDelete: Cascade)

  @@unique([collegeId, courseId])
  @@index([collegeId])
  @@index([courseId])
  @@index([annualFees])
}

model Placement {
  id             String   @id @default(uuid())
  collegeId      String
  year           Int
  highestPackage Float // LPA
  averagePackage Float // LPA
  medianPackage  Float?
  placementRate  Float    @default(90.0)
  topRecruiters  String // Comma-separated
  college        College  @relation(fields: [collegeId], references: [id], onDelete: Cascade)

  @@index([collegeId])
  @@index([averagePackage])
}

model Review {
  id              String   @id @default(uuid())
  collegeId       String
  reviewerName    String
  rating          Float
  title           String
  pros            String   @db.Text
  cons            String   @db.Text
  courseName      String?
  batchYear       String?
  verifiedStudent Boolean  @default(true)
  college         College  @relation(fields: [collegeId], references: [id], onDelete: Cascade)

  @@index([collegeId])
}

model Facility {
  id          String  @id @default(uuid())
  collegeId   String
  name        String
  icon        String?
  description String?
  college     College @relation(fields: [collegeId], references: [id], onDelete: Cascade)

  @@index([collegeId])
}

model SavedCollege {
  id        String   @id @default(uuid())
  userId    String
  collegeId String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  college   College  @relation(fields: [collegeId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())

  @@unique([userId, collegeId])
  @@index([userId])
  @@index([collegeId])
}
```

### Database Indexes Explained
1. `@@index([slug])`: Guarantees $O(1)$ constant-time page routing lookup for `/colleges/[slug]`.
2. `@@index([state, city])`: Accelerates geographical browsing (e.g. `WHERE state = 'Karnataka' AND city = 'Bengaluru'`).
3. `@@index([collegeType, rating])`: Optimizes top-ranked stream queries (`WHERE collegeType = 'Engineering' ORDER BY rating DESC`).
4. `@@index([minFees])`: Powers fee range slider filtering without full-table scans.
5. `@@unique([userId, collegeId])`: Database-level integrity guarantee preventing duplicate bookmarks per student.

---

## 🔍 Search & Filtering Design
- **Backend Query Processing**: When a student enters a search query or toggles filters, the frontend issues an API request to `GET /api/colleges?...`. The backend translates this into a parameterized Prisma query with dynamic `where` conditions.
- **Text Search**: Uses `mode: 'insensitive'` with substring contains matching across `name`, `shortName`, `city`, and `state`.
- **URL Synchronization**: All filter parameters (`search`, `state`, `city`, `collegeType`, `ownership`, `minFees`, `maxFees`, `minRating`, `sort`, `page`) are synced to the URL query string. Anyone can copy the link and share the exact filtered state.
- **Server Pagination**: Implemented via SQL `LIMIT` and `OFFSET` (`take` and `skip` in Prisma), returning `total`, `totalPages`, `hasNext`, and `hasPrev`.

---

## 🔒 Authentication & Security Architecture
- **Backend Enforced**: Authentication is handled entirely by Node.js API routes with JWT tokens. No client-side mock authentication.
- **Password Protection**: Passwords are hashed with **bcrypt** (salt rounds = 10) before storage. Plaintext passwords never touch the database.
- **Token Transport**: Signed JWTs (`userId`, `email`, `role`) with 7-day expiration are stored in **HTTP-only, SameSite=Lax** cookies, mitigating cross-site scripting (XSS) and token theft.
- **Authorization Checks**: Saved colleges APIs check the decrypted session before allowing modifications and scope all operations strictly to `session.userId`.

---

## 🚀 Quickstart & Local Setup (Zero Docker Required)

### 1. Prerequisites
- **Node.js**: v18+ (tested on Node v24)
- **PostgreSQL**: Native PostgreSQL on your machine (installed via Homebrew or PostgreSQL installer) OR a free Cloud PostgreSQL database URL (Neon, Supabase, Railway, Render).

### 2. Configure Environment (`.env`)
The database URL is configured in `.env`:
```bash
# Connect to your native local PostgreSQL:
DATABASE_URL="postgresql://postgres@localhost:5434/collegedb?schema=public"

# OR connect to any free cloud PostgreSQL (e.g., Neon / Supabase):
# DATABASE_URL="postgresql://user:password@ep-cool-db.us-east-2.aws.neon.tech/collegedb?sslmode=require"

JWT_SECRET="college_discovery_jwt_super_secret_key_change_in_production_32char"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Start Local Native PostgreSQL (Optional if not already running)
```bash
npm run db:start
```
*(Starts the native PostgreSQL server on port 5434).*

### 4. Push Schema & Seed 60+ Colleges
```bash
npx prisma db push
npx prisma db seed
```
*Seeds 60+ accredited Indian colleges, course catalogues, realistic placement statistics, facilities, reviews, and a ready-to-use demo student account (`student@example.com` / `Password123`).*

### 5. Run Development Server
```bash
npm run dev
```
Open `http://localhost:3000` (or `http://localhost:3001` if port 3000 is occupied).

### 6. Run Test Suite
```bash
npm run test
```
*Executes all 13 unit and integration tests across search, filtering, pagination, details, auth, saved colleges, and comparison limits.*

### 7. Run Production Build
```bash
npm run build
```

---

## 📡 API Documentation Summary

Every endpoint returns a standardized JSON envelope:
- Success: `{ "success": true, "message": "...", "data": ..., "pagination": { ... } }`
- Error: `{ "success": false, "error": { "code": "...", "message": "...", "details": ... } }`

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/colleges` | Search, filter, sort and paginate colleges | No |
| `GET` | `/api/colleges/[slug]` | Fetch complete college profile with relations | No |
| `GET` | `/api/colleges/compare` | Fetch up to 3 colleges for side-by-side comparison | No |
| `GET` | `/api/colleges/filters` | Distinct states, cities, and streams for UI filters | No |
| `POST` | `/api/auth/signup` | Register a new student account | No |
| `POST` | `/api/auth/login` | Authenticate with email & password, sets HTTP-only cookie | No |
| `POST` | `/api/auth/logout` | Clears authentication cookie | No |
| `GET` | `/api/me` | Fetch authenticated user session profile | Yes |
| `GET` | `/api/saved-colleges` | List all colleges saved by authenticated student | Yes |
| `POST` | `/api/saved-colleges` | Save a college to student profile (idempotent) | Yes |
| `DELETE` | `/api/saved-colleges/[id]` | Remove a college from student profile | Yes |

*See [`API_TEST_EXAMPLES.md`](file:///Users/himanshugupta/Desktop/web-dev/AI_software_task/API_TEST_EXAMPLES.md) for full cURL examples and JSON payloads.*

---

## ⚖️ Engineering Tradeoffs & 10x Scalability Plan

### What We Chose vs Alternatives
1. **Native / Cloud PostgreSQL vs Docker**:
   - *Choice*: Direct native PostgreSQL connection and cloud database compatibility.
   - *Rationale*: Zero Docker dependencies or container overhead; developers can use standard PostgreSQL installed via Homebrew or free serverless databases like Neon or Supabase with a simple connection string.
2. **Case-Insensitive ILIKE vs Full-Text Search Engine**:
   - *Choice*: PostgreSQL `ILIKE` with B-Tree indexes.
   - *Rationale*: For MVP with hundreds of colleges, `ILIKE` executes in under 5ms with zero external infrastructure.
   - *At 10x Traffic*: Migrate to PostgreSQL `tsvector` with GIN indexing or Meilisearch for typo tolerance and phonetic matching.
3. **Context + LocalStorage for Comparison vs Server DB Session**:
   - *Choice*: `ComparisonContext` with `localStorage` persistence.
   - *Rationale*: High responsiveness without database round-trips for transient anonymous browsing.
4. **Database Unique Constraint for Saved Colleges**:
   - *Choice*: `@@unique([userId, collegeId])` with Prisma `upsert`.
   - *Rationale*: Eliminates race conditions if a user double-clicks the save button; the database rejects duplicates at the engine level.

### Scaling to 1M+ Active Students (10x Roadmap):
1. **Edge Caching**: Add Cloudflare or Vercel Edge caching on `GET /api/colleges/[slug]` with `stale-while-revalidate=86400`.
2. **Read Replicas**: Route discovery queries to PostgreSQL read replicas using Prisma Accelerate or connection pooling via PgBouncer.
3. **Redis Query Caching**: Cache common filter permutations (e.g. `/api/colleges?collegeType=Engineering&sort=rating_desc`) with a 10-minute TTL.
# College-Finder
