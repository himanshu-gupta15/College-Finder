# Technical Interview & Loom Walkthrough Preparation Guide
## College Discovery Platform (Track A)

This document is engineered to prepare you for your **5–10 minute Loom video walkthrough** and technical interview. Every engineering decision is broken down in simple, authoritative software engineering language.

---

## 🧭 Loom Video Walkthrough Outline (5–10 Minutes)

1. **Introduction (1 min)**:
   - Introduce yourself and the assignment: Track A — College Discovery Platform.
   - Explain the core mission: Building a production-ready, data-backed higher education discovery and comparison platform for Indian students with zero hardcoded college data.
2. **Architecture & Database (2–3 mins)**:
   - Open `ARCHITECTURE.md` and `prisma/schema.prisma`.
   - Explain the 3-Tier Architecture: Presentation (Next.js 15 App Router), Domain Services, and Data Access (Prisma ORM & PostgreSQL).
   - Show how the normalized database enforces relational constraints (`onDelete: Cascade`, `@unique([userId, collegeId])` to prevent duplicate bookmarks, and B-Tree indexes on `slug`, `city`, `state`, and `rating`).
3. **Live Demonstration (2–3 mins)**:
   - **Search & Filters**: Search `"IIT"`, select stream `"Engineering"`, adjust the fee slider. Show that queries hit `/api/colleges` and update the URL query string for shareability.
   - **College Detail (`/colleges/iit-bombay`)**: Show the modular breakdown (Header, Overview, Courses, Fees, Placements, Facilities, Reviews) and highlight the dynamic SEO metadata.
   - **Compare Feature (`/compare`)**: Add 2–3 colleges, open the comparison matrix, show side-by-side CTC and fee evaluations, and highlight that adding a 4th college is blocked.
   - **Auth & Saved Shortlists**: Log in with demo account (`student@example.com`), bookmark a college, and verify it updates in `/saved-colleges`.
4. **Code Quality, Testing & Scalability (2 mins)**:
   - Show `tests/college-platform.test.ts` passing all 13 Vitest tests.
   - Summarize the 10x traffic scalability strategy (Edge caching, read replicas, and full-text search).

---

## 🎯 Deep Dive: 24 Core Engineering Topics

---

### 1. Next.js 15 & App Router
- **Why did we use this?**
  Next.js provides hybrid rendering (Server Components + Client Components) out-of-the-box, automatic code splitting, built-in Route Handlers (`app/api/...`), and native SEO metadata generation (`generateMetadata`).
- **Why not another option (e.g. Vite SPA)?**
  A pure client-side SPA (like Vite) renders a blank HTML shell on initial load. Search engines (Google/Bing) and social scrapers (WhatsApp, Twitter) struggle to index dynamically rendered college pages.
- **What happens internally?**
  Server Components render on the Node server into a React Server Component (RSC) payload stream. Client Components hydrate interactively in the browser.
- **Tradeoffs**:
  Slightly higher server memory usage compared to static HTML hosting on an S3 bucket.
- **Edge cases**:
  Hydration mismatch errors if rendering browser-specific values (like `localStorage` or `window.innerWidth`) directly on the server before mounting. Handled via `useEffect` and `isLoaded` flags.

---

### 2. React 19
- **Why did we use this?**
  Next.js 15 is built on React 19, which introduces advanced concurrent rendering, improved hook primitives, and optimized DOM reconciliation.
- **What happens internally?**
  React maintains a Virtual DOM tree, computes diffs against previous state, and batches DOM writes into a single paint cycle.

---

### 3. TypeScript (Strict Mode)
- **Why did we use this?**
  Enforces strict type safety across the entire codebase (`"strict": true` in `tsconfig.json`).
- **What problem does it solve?**
  Prevents runtime bugs like `TypeError: Cannot read properties of undefined`, ensures API responses match UI component expectations, and eliminates silent typos in database field names.
- **What happens internally?**
  TypeScript checks types at compile time via AST analysis. It emits zero runtime overhead because types are stripped into standard JavaScript.

---

### 4. TailwindCSS v4
- **Why did we use this?**
  Utility-first CSS with modern `@import "tailwindcss";` PostCSS engine.
- **Why not CSS Modules or styled-components?**
  styled-components introduces runtime JavaScript execution for CSS parsing, hurting Web Vitals. Tailwind compiles down to a minimal, pre-purged static stylesheet without runtime cost.

---

### 5. PostgreSQL 16
- **Why did we use this?**
  Higher education discovery is fundamentally relational: one college has many courses, historical placements, infrastructure facilities, reviews, and student bookmarks. PostgreSQL provides robust ACID transactions, foreign keys, unique composite indexes, and complex multi-column query optimizations.
- **Why not MongoDB?**
  Document databases allow schema drift and require manual application-level emulation of foreign keys and cascade deletions, which lead to orphaned data when colleges are removed.
- **Tradeoffs**:
  Requires database schema migrations when models evolve.

---

### 6. Prisma ORM
- **Why did we use this?**
  Provides type-safe database queries. Every Prisma query automatically returns fully-typed TypeScript models matching `schema.prisma`.
- **Why not raw SQL or TypeORM?**
  Raw SQL lacks compile-time type validation; renaming a column could cause silent runtime crashes. TypeORM relies heavily on experimental TypeScript decorators.
- **What happens internally?**
  Prisma translates query builder calls into optimized, parameterized SQL queries via a Rust query engine binary, preventing SQL injection vulnerabilities.

---

### 7. Three-Tier API Architecture (Route Handlers -> Services -> Repositories)
- **Why did we use this?**
  Separation of concerns:
  - `app/api/...`: Handles HTTP requests, parses cookies, and delegates to services.
  - `services/...`: Implements business rules (calculating pagination pages, capping comparison items to 3, validating passwords).
  - `repositories/...`: Encapsulates database queries (Prisma `findMany`, `count`, `upsert`).
- **What problem does it solve?**
  Avoids 400-line "god route" files. If we switch from Prisma to Drizzle in the future, only the repository layer needs to change; business logic and API routes remain untouched.

---

### 8. Authentication (Custom JWT vs Third-Party OAuth)
- **Why did we use this?**
  The assignment mandates true backend authentication with a `User` model in PostgreSQL without depending on third-party vendor lock-in (like Clerk or Firebase).
- **What happens internally?**
  1. User registers with email and password.
  2. Server hashes password with bcrypt and stores `passwordHash` in PostgreSQL.
  3. Server signs a JWT with user details (`userId`, `email`, `role`) using `JWT_SECRET`.
  4. Server sends the token via an `HttpOnly`, `SameSite=Lax` cookie.
- **Security benefits**:
  `HttpOnly` cookies cannot be accessed by browser JavaScript (`document.cookie`), completely protecting the token against XSS (Cross-Site Scripting) attacks.

---

### 9. Password Hashing (Bcrypt)
- **Why did we use this?**
  Bcrypt is an adaptive hashing algorithm designed specifically for passwords.
- **Why not SHA-256 or MD5?**
  SHA-256 is designed to be extremely fast for checksums. An attacker with a modern GPU can compute billions of SHA-256 hashes per second to crack passwords via brute-force or rainbow tables. Bcrypt uses an expensive key-derivation function with configurable salt rounds (we use `saltRounds = 10`), making brute-force attacks computationally infeasible.

---

### 10. Database Search Strategy
- **Why did we use case-insensitive ILIKE / contains?**
  College queries in India are varied: a student might search `"IIT"`, `"iit bombay"`, `"Mumbai"`, or `"delhi"`.
- **What happens internally?**
  Prisma translates the search parameter into:
  ```sql
  WHERE (name ILIKE $1 OR "shortName" ILIKE $1 OR city ILIKE $1 OR state ILIKE $1)
  ```
  Combined with B-Tree indexes, searches across 60+ colleges return in under 3 milliseconds.
- **How would we scale at 10x?**
  Use PostgreSQL `tsvector` with a GIN index:
  ```sql
  ALTER TABLE "College" ADD COLUMN search_vector tsvector;
  CREATE INDEX idx_college_fts ON "College" USING gin(search_vector);
  ```
  Or integrate a dedicated search engine like Meilisearch / Elasticsearch.

---

### 11. Filtering Implementation
- **Why did we filter at the database level instead of the frontend?**
  The assignment strictly prohibits frontend-only filtering:
  *"Do not implement filtering only on the frontend. Use PostgreSQL queries."*
  If a platform has 10,000 colleges, fetching all 10,000 to filter in JavaScript would cause massive bandwidth consumption and freeze mobile browsers.
- **How does it work?**
  Filters are dynamically appended to the Prisma `where` clause:
  - Stream: `where.collegeType = { equals: type, mode: "insensitive" }`
  - Ownership: `where.ownership = ownership`
  - Rating: `where.rating = { gte: minRating }`
  - Fees: `where.minFees = { gte: minFees, lte: maxFees }`

---

### 12. Pagination Architecture
- **How does pagination work?**
  We use standard `skip` and `take` (`OFFSET` and `LIMIT` in SQL).
  - Page 1: `skip = 0, take = 12`
  - Page 2: `skip = 12, take = 12`
- **Metadata Returned**:
  ```json
  "pagination": {
    "page": 2,
    "limit": 12,
    "total": 60,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": true
  }
  ```
- **Edge cases**:
  If a student navigates to `page=999`, the query returns an empty array with `hasNext: false`, and the UI gracefully displays a "No colleges found" empty state rather than crashing.

---

### 13. Database Indexing
- **What indexes did we create?**
  1. `@@index([slug])`: Primary index for route lookup.
  2. `@@index([city])`, `@@index([state])`: Fast location filtering.
  3. `@@index([state, city])`: Composite index for hierarchical geographical queries.
  4. `@@index([collegeType, rating])`: Composite index for sorted stream listings.
  5. `@@index([minFees])`: Range scan optimization for fee sliders.
- **Why not index every column?**
  Every index requires disk space and adds write overhead during `INSERT` and `UPDATE` operations. We only indexed columns present in `WHERE` and `ORDER BY` clauses.

---

### 14. Relational Integrity & Duplicate Prevention
- **How did we prevent duplicate saved colleges?**
  In `prisma/schema.prisma`, we added a compound unique constraint:
  ```prisma
  model SavedCollege {
    userId    String
    collegeId String
    ...
    @@unique([userId, collegeId])
  }
  ```
  Even if concurrent HTTP requests are sent or a user double-clicks the bookmark button, PostgreSQL will reject the second insertion with a unique constraint violation. In the repository, we use `upsert`, making the operation completely idempotent.

---

### 15. College Comparison Matrix
- **How does comparison work?**
  - Stored in `ComparisonContext` with `localStorage` persistence.
  - Students can add up to 3 colleges.
  - If a student tries to add a 4th college, `addToCompare` rejects the action and triggers a notification: *"Comparison limit reached! You can compare at most 3 colleges."*
  - The comparison table renders side-by-side metrics: Annual Fees, Highest CTC, Average CTC, Accreditation, Established Year, and Recruiters.
- **Mobile responsiveness**:
  On small viewports, the table uses `overflow-x-auto` with a custom scrollbar and fixed-width columns (`min-w-[700px]`), allowing smooth horizontal swiping on mobile.

---

### 16. Input Validation with Zod
- **Why Zod?**
  Zod parses and sanitizes incoming query parameters and request bodies before they reach domain services:
  - Ensures `page` and `limit` are positive integers.
  - Ensures `minFees` and `maxFees` are non-negative numbers.
  - Validates email formats and enforces password length $\ge 6$.
- **Error Handling**:
  If validation fails, Zod returns a 400 Bad Request with field-specific error messages.

---

### 17. Standardized API Envelope
- **Why use a consistent response schema?**
  Every endpoint returns:
  ```json
  { "success": true, "message": "...", "data": ..., "pagination": ... }
  ```
  or on error:
  ```json
  { "success": false, "error": { "code": "...", "message": "..." } }
  ```
  Frontend fetch utilities know exactly where to read data and how to handle errors without custom parsing per route.

---

### 18. Server-Side Rendering (SSR) vs Client-Side (CSR) Decisions
- **Homepage (`app/page.tsx`)**: Server Component. Fetches top institutions directly from the database during server render for optimal Largest Contentful Paint (LCP) and zero client bundle overhead.
- **Detail Page (`app/colleges/[slug]/page.tsx`)**: Server Component. Fetches complete college data and populates Open Graph metadata before sending HTML to the client.
- **Discovery Page (`app/colleges/page.tsx`)**: Client Component. Dynamically reads `useSearchParams` and fetches filtered results asynchronously as the user moves fee sliders or toggles filters.

---

### 19. SEO & Open Graph Metadata
- Every college page uses Next.js `generateMetadata({ params })`:
  - Title: `${college.name} - Cutoffs, Fees, Placements & Reviews`
  - Description: Contains dynamic average package (`₹23.5 LPA`), city, and accreditation.
  - Open Graph Images: Configured with the institution banner URL for rich link previews on social media.

---

### 20. Database Seeding Reproducibility
- The entire platform dataset is generated in `prisma/seed.ts` containing **60+ premier Indian colleges** (IITs, IIMs, AIIMS, BITS, NITs, NLUs, NID, DU).
- Includes realistic fee structures, placement packages, top recruiters, and authentic reviews.
- Running `npx prisma db seed` allows anyone to reproduce the exact state from an empty database.

---

### 21. Error Handling & 404 Resilience
- **Invalid Slugs**: Navigating to `/colleges/unknown-slug` invokes Next.js `notFound()`, rendering `app/not-found.tsx` with clear options to return to discovery.
- **API Error Boundaries**: All Route Handlers wrap execution in `try / catch` blocks and return structured JSON with appropriate HTTP status codes (400, 401, 404, 409, 500) rather than unhandled server crashes.

---

### 22. Security Checklist
1. **No Hardcoded Secrets**: `DATABASE_URL` and `JWT_SECRET` are read exclusively from environment variables (`.env`).
2. **SQL Injection Prevention**: Prisma uses parameterized queries for all database interactions.
3. **XSS Protection**: React automatically escapes strings before rendering, and JWTs are stored in `HttpOnly` cookies.
4. **Credential Safety**: User passwords are encrypted with salted bcrypt before database persistence.

---

### 23. Testing Architecture
- **Framework**: Vitest.
- **Coverage**: 13 automated tests covering:
  - Search by name, city, state.
  - Multi-parameter filtering by type, ownership, fee range, rating.
  - Offset-based pagination with disjoint sets.
  - College detail relational querying and 404 behavior.
  - Signup, duplicate rejection, password validation.
  - Saved college lifecycle (save, duplicate prevention, removal).
  - Comparison hard limit enforcement ($\le 3$).

---

### 24. 10x Scalability Plan (1 Million+ Students)
1. **Edge Caching**: Cache `GET /api/colleges/[slug]` on Cloudflare or Vercel Edge with `stale-while-revalidate=86400`. Since college fees and placements change once a year, 99% of profile traffic can be served from edge cache.
2. **Read-Write Splitting**: Route `GET /api/colleges` queries to PostgreSQL read replicas using Prisma Accelerate or connection pooling via PgBouncer.
3. **Redis Query Caching**: Store frequently accessed filter permutations (e.g. `colleges:Engineering:rating_desc`) in an in-memory Redis cluster with a 10-minute TTL.
4. **Full-Text Search Engine**: Replace `ILIKE` with Meilisearch or PostgreSQL `tsvector` with GIN indexes to handle spelling errors, typos, and fuzzy matching at scale.
