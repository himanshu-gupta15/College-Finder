# Architecture & System Design Document
## College Discovery Platform (Track A)

### 1. System Overview
The College Discovery Platform is an Indian higher education search and comparison web application. It connects aspiring students with comprehensive, verified data on 50+ premier Indian colleges, universities, and institutes across engineering, management, medicine, arts, and design.

The platform is designed around:
- **Server-driven Search & Filtering**: All queries are executed at the database level using indexed PostgreSQL queries, avoiding memory-intensive frontend filtering.
- **Three-Tier Architecture**: Separation of concerns across Presentation (Next.js App Router), Domain Services (Business logic), and Data Access (Prisma ORM & Repositories).
- **Security-First Auth**: Backend-managed JWT authentication with salted bcrypt password hashing and HTTP-only cookie transport.

```
┌─────────────────────────────────────────────────────────────┐
│                   Next.js 15 Client Layer                  │
│   (Search / Filters / Comparison Bar / Protected Profile)   │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTPS / JSON
┌──────────────────────────────▼──────────────────────────────┐
│                    API Route Handlers                       │
│    /api/colleges  │  /api/auth  │  /api/saved-colleges      │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                   Validation Layer (Zod)                    │
│      Validates query params, payloads, limits, slugs        │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                   Domain Services Layer                     │
│  CollegeService  │  AuthService  │  SavedCollegeService     │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                     Repository Layer                        │
│  CollegeRepository │ UserRepository │ SavedCollegeRepository│
└──────────────────────────────┬──────────────────────────────┘
                               │ Prisma ORM
┌──────────────────────────────▼──────────────────────────────┐
│                 PostgreSQL Database Engine                  │
│       Relational Schema + B-Tree / Composite Indexes        │
└─────────────────────────────────────────────────────────────┘
```

---

### 2. Database Entities & Relational Schema

```
┌───────────────┐          ┌──────────────────────┐          ┌─────────────────┐
│     User      │          │     SavedCollege     │          │     College     │
├───────────────┤          ├──────────────────────┤          ├─────────────────┤
│ id (UUID)     │1       * │ id (UUID)            │ *      1 │ id (UUID)       │
│ email (UQ)    ├──────────┤ userId (FK)          ├──────────┤ slug (UQ)       │
│ passwordHash  │          │ collegeId (FK)       │          │ name            │
│ name          │          │ createdAt            │          │ city, state     │
│ role          │          └──────────────────────┘          │ collegeType     │
│ createdAt     │                                            │ ownership       │
└───────────────┘                                            │ rating, minFees │
                                                             │ maxFees         │
                                                             └────────┬────────┘
                                                                      │
                    ┌─────────────────────────┬───────────────────────┼─────────────────────────┐
                    │ 1                       │ 1                     │ 1                       │ 1
                    │ *                       │ *                     │ *                       │ *
           ┌────────▼─────────┐      ┌────────▼─────────┐    ┌────────▼─────────┐      ┌────────▼─────────┐
           │  CollegeCourse   │      │    Placement     │    │      Review      │      │     Facility     │
           ├──────────────────┤      ├──────────────────┤    ├──────────────────┤      ├──────────────────┤
           │ id               │      │ id               │    │ id               │      │ id               │
           │ collegeId (FK)   │      │ collegeId (FK)   │    │ collegeId (FK)   │      │ collegeId (FK)   │
           │ courseId (FK)    │      │ year             │    │ reviewerName     │      │ name             │
           │ annualFees       │      │ highestPackage   │    │ rating           │      │ icon             │
           │ eligibility      │      │ averagePackage   │    │ title, pros, cons│      │ description      │
           └────────┬─────────┘      │ topRecruiters    │    └──────────────────┘      └──────────────────┘
                    │ *              └──────────────────┘
                    │ 1
           ┌────────▼─────────┐
           │      Course      │
           ├──────────────────┤
           │ id               │
           │ name, code       │
           │ degree, stream   │
           └──────────────────┘
```

#### Key Relational Constraints:
1. **Duplicate Prevention**: `SavedCollege` defines `@@unique([userId, collegeId])` ensuring a student can never save the same college twice.
2. **Cascading Deletes**: If a college is deleted, related records (`CollegeCourse`, `Placement`, `Review`, `Facility`, `SavedCollege`) cascade delete cleanly (`onDelete: Cascade`).
3. **Slugs**: College `slug` is marked `@unique` and indexed for constant-time URL route resolution (`/colleges/iit-bombay`).

---

### 3. Search & Indexing Strategy

#### The Problem:
College discovery requires simultaneous querying across:
1. Text fields (`name`, `city`, `state`)
2. Categorical filters (`collegeType`, `ownership`, `course.stream`)
3. Numeric ranges (`minFees <= target`, `rating >= minRating`)
4. Sorting (`rating DESC`, `fees ASC`, `package DESC`)

#### Database Indexes Applied:
- `CREATE INDEX idx_college_search ON "College"(name, city, state);`
- `CREATE INDEX idx_college_state_city ON "College"(state, city);`
- `CREATE INDEX idx_college_type_rating ON "College"("collegeType", rating DESC);`
- `CREATE INDEX idx_college_fees ON "College"("minFees", "maxFees");`

#### Query Execution:
Prisma translates the search request into parameterized SQL:
```sql
SELECT c.*, 
       (SELECT json_agg(cc.*) FROM "CollegeCourse" cc WHERE cc."collegeId" = c.id) AS courses,
       (SELECT json_agg(p.*) FROM "Placement" p WHERE p."collegeId" = c.id) AS placements
FROM "College" c
WHERE (c.name ILIKE $1 OR c.city ILIKE $1 OR c.state ILIKE $1)
  AND ($2::text IS NULL OR c.city = $2)
  AND ($3::text IS NULL OR c.state = $3)
  AND ($4::int IS NULL OR c."minFees" >= $4)
  AND ($5::int IS NULL OR c."maxFees" <= $5)
  AND ($6::float IS NULL OR c.rating >= $6)
ORDER BY c.rating DESC
LIMIT $7 OFFSET $8;
```

---

### 4. API Design & Standardized Response Format

Every API response follows an industry-standard envelope pattern:

#### Success Response:
```json
{
  "success": true,
  "data": [ /* Payload */ ],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 56,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  },
  "message": "Colleges fetched successfully"
}
```

#### Error Response:
```json
{
  "success": false,
  "error": {
    "code": "COLLEGE_NOT_FOUND",
    "message": "The requested college slug was not found",
    "details": null
  }
}
```

---

### 5. Frontend Architecture & State Management

#### State Distribution Principle:
1. **URL State (Single Source of Truth for Discovery)**:
   - Search text, filter values, active category, sort order, and page number are serialized into URL search parameters (`?search=IIT&state=Delhi&sort=rating_desc&page=1`).
   - *Advantage*: Any filtered discovery view can be copied, bookmarked, and shared directly.
2. **Comparison State (`ComparisonContext` + `localStorage`)**:
   - Stores up to 3 selected colleges (`id`, `name`, `slug`, `logoUrl`, `city`).
   - Synchronized across browser tabs via `storage` events.
   - Enforces a hard cap of 3 colleges with toast notification if an attempt is made to exceed it.
3. **User Authentication State (`AuthContext`)**:
   - Manages active user profile (`id`, `name`, `email`, `role`).
   - Populated via `/api/me` on mount and updated on `/api/auth/login` or `/api/auth/logout`.

---

### 6. Authentication Flow

```mermaid
sequenceDiagram
    autonumber
    actor User as Student
    participant UI as Next.js Client
    participant API as Next.js /api/auth/login
    participant DB as PostgreSQL

    User->>UI: Enters Email & Password
    UI->>API: POST /api/auth/login { email, password }
    API->>DB: Find user by email
    DB-->>API: Returns user record with passwordHash
    API->>API: bcrypt.compare(password, passwordHash)
    alt Password Invalid
        API-->>UI: 401 Unauthorized { code: "INVALID_CREDENTIALS" }
    else Password Valid
        API->>API: Sign JWT with user { id, email, role } (7d expiry)
        API-->>UI: Set-Cookie: token=...; HttpOnly; SameSite=Lax; Path=/
        API-->>UI: 200 OK { success: true, data: { user } }
        UI->>UI: Redirect to /saved-colleges or /profile
    end
```

---

### 7. Scalability & 10x Traffic Roadmap
If traffic scales 10x (1M+ active students):
1. **Edge Caching**: Add Cloudflare or Vercel Edge caching on `GET /api/colleges/[slug]` with `stale-while-revalidate=86400`.
2. **Read Replicas**: Distribute discovery searches to PostgreSQL read replicas using Prisma Accelerate or connection pooling via PgBouncer.
3. **Full-Text Search Engine**: Upgrade search from PostgreSQL trigram/ILIKE to PostgreSQL `tsvector` with GIN indexing or Meilisearch.
4. **Redis Cache**: Cache popular filter query combinations (`/api/colleges?type=Engineering&sort=rating_desc`) in Redis with 10-minute TTL.
