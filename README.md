# CollegeFinder — Tech Stack & Workflow Guide

A production-grade college discovery and decision platform designed for Indian higher education. This document provides an in-depth breakdown of the **Tech Stack** used across every layer of the system and the **Workflows** that govern data flow, user interactions, security, and developer operations.

---

## 🛠 Tech Stack

The platform is constructed with a modern, type-safe full-stack JavaScript/TypeScript ecosystem with zero container dependencies.

```
┌────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND                                  │
│  Next.js 15 (App Router) • React 19 • TypeScript 5.8 • TailwindCSS v4  │
│          Lucide React Icons • URL Search Params State Sync             │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │ HTTPS / JSON API
┌──────────────────────────────────▼─────────────────────────────────────┐
│                              BACKEND                                   │
│    Next.js Route Handlers • Zod Validation • Service-Repository Layer  │
│       Custom JWT (JSONWebToken) • BcryptJS • HTTP-Only Cookies         │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │ Prisma Client
┌──────────────────────────────────▼─────────────────────────────────────┐
│                          DATABASE & ORM                                │
│        PostgreSQL (Native / Cloud) • Prisma ORM 6 (3NF Normalized)     │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │ Quality Assurance
┌──────────────────────────────────▼─────────────────────────────────────┐
│                           TESTING & TOOLING                            │
│                 Vitest 3 • ESLint 9 • TSX • PostCSS                    │
└────────────────────────────────────────────────────────────────────────┘
```

### 1. Frontend Layer
- **Next.js 15 (App Router)**: Powers both server-side rendering (SSR) for college detail pages (`/colleges/[slug]`) and high-performance client-side interactivity for live search, filtering, and side-by-side comparisons.
- **React 19**: Leverages modern React concurrency, state hooks, and Context API for client-side state management (Authentication & Comparison drawers).
- **TypeScript 5.8 (Strict Mode)**: Enforces end-to-end type safety from database schemas and API responses directly to UI component props.
- **TailwindCSS v4**: Next-generation utility-first styling with zero runtime overhead, responsive breakpoints, glassmorphism accents, and CSS variables for dark/light themes.
- **Lucide React**: Crisp, modern iconography representing college amenities, metrics, and navigation actions.

### 2. Backend & Business Logic Layer
- **Next.js API Route Handlers (`app/api/*`)**: Serverless-ready HTTP endpoints providing RESTful CRUD APIs with standard JSON envelopes.
- **Layered Architecture (Controller → Service → Repository)**:
  - **Controllers (`app/api/**/route.ts`)**: Parse requests, extract parameters, and handle HTTP status codes.
  - **Services (`services/*.service.ts`)**: Encapsulate business logic, calculations (e.g. rating updates), and permission checks.
  - **Repositories (`repositories/*.repository.ts`)**: Isolate database access queries and data transformations.
- **Zod 3.24**: Runtime request validation and schema definition for query parameters, request bodies, and database mutations.
- **BcryptJS**: Salted cryptographic password hashing (salt rounds: 10) for secure student credentials storage.
- **JSONWebToken (JWT)**: Stateless authentication tokens signed with HMAC SHA-256 and transmitted via secure, `HttpOnly`, `SameSite=Lax` cookies.

### 3. Data & Storage Layer
- **PostgreSQL 16/18**: Robust relational database engine supporting ACID transactions, composite B-Tree indexes, and complex relational joins. Runs natively on local machines or through cloud providers (Neon, Supabase, Railway).
- **Prisma ORM 6**: Declarative relational schema modeling, automated database migrations, type-safe database queries, and automatic relation population.

### 4. Testing & Developer Tooling
- **Vitest 3**: Ultra-fast ESM test runner with native TypeScript support executing unit and integration test suites.
- **TSX**: Node.js execution engine used to run Prisma database seed scripts without manual transpilation.

---

## 🔄 System Architecture & Data Flow Workflow

The platform enforces a unidirectional **Three-Tier Architecture** ensuring separation of concerns:

```
[Client Browser]
       │
       │ 1. HTTP Request (GET / POST / DELETE) + Cookie Token
       ▼
[Next.js API Route Handler] (app/api/...)
       │
       │ 2. Validate Request with Zod Schema
       ▼
[Domain Service Layer] (services/...)
       │
       │ 3. Execute Business Logic & Authorization Checks
       ▼
[Repository Layer] (repositories/...)
       │
       │ 4. Type-Safe Prisma Queries
       ▼
[PostgreSQL Database]
       │
       │ 5. Relational Join / Indexed Query Result
       ▼
[Standard JSON Response Envelope]
{ "success": true, "data": [...], "pagination": {...} }
```

---

## 🧭 Core Application Workflows

### 1. College Discovery & Multi-Filter Search Workflow

Enables prospective students to explore colleges across multiple parameters with immediate visual feedback and shareable states.

```mermaid
sequenceDiagram
    autonumber
    actor Student
    participant Browser as Browser (UI & URL)
    participant API as /api/colleges
    participant Service as CollegeService
    participant Repo as CollegeRepository
    participant DB as PostgreSQL

    Student->>Browser: Types search term or selects filters (State, Fee, Stream)
    Browser->>Browser: Update URL query parameters (?search=...&state=...&page=1)
    Browser->>API: GET /api/colleges?search=IIT&state=Delhi&minFees=100000...
    API->>API: Validate query with Zod (page, limit, numbers, strings)
    API->>Service: searchColleges(filterParams)
    Service->>Repo: findMany(criteria, skip, take)
    Repo->>DB: Execute parameterized SQL query with B-Tree indexes & ILIKE
    DB-->>Repo: Return matched records & total count
    Repo-->>Service: Formatted college entities
    Service-->>API: Data payload + Pagination metadata
    API-->>Browser: JSON response { success: true, data: [...], pagination: {...} }
    Browser-->>Student: Renders College Cards with pagination controls
```

- **URL as Single Source of Truth**: All filter combinations are serialized to URL query strings. Any search query can be copied, refreshed, or shared directly.
- **Database Index Optimization**: Filter queries leverage composite indexes (`state + city`, `collegeType + rating`, `minFees`) to avoid full-table scans.

---

### 2. College Institutional Profile & Details Workflow

Provides in-depth institutional metrics including historical placements, seat availability, fees, facilities, and verified student reviews.

```mermaid
sequenceDiagram
    autonumber
    actor Student
    participant Browser as Client Page
    participant Server as Next.js SSR /api/colleges/[slug]
    participant DB as PostgreSQL

    Student->>Browser: Clicks college card (/colleges/iit-bombay)
    Browser->>Server: Request page /colleges/[slug]
    Server->>DB: Query College by Unique Indexed Slug
    Note over Server,DB: Includes relations: Courses, Placements, Reviews, Facilities
    DB-->>Server: Complete relational college graph
    Server-->>Browser: Server-rendered HTML with full institutional profile
    Browser-->>Student: Displays Overview, Fees, Highest/Average CTC, Reviews
```

---

### 3. Side-by-Side Comparison Workflow

Allows students to compare up to 3 colleges side-by-side across fees, NIRF rankings, highest packages, and eligibility criteria.

```mermaid
sequenceDiagram
    autonumber
    actor Student
    participant UI as Comparison Bar
    participant Context as ComparisonContext
    participant Storage as localStorage
    participant Page as /compare Page
    participant API as /api/colleges/compare?ids=id1,id2,id3

    Student->>UI: Clicks "+ Compare" on a College
    UI->>Context: addCollegeToCompare(college)
    alt Already 3 colleges selected
        Context-->>Student: Toast: "Maximum 3 colleges can be compared"
    else Under limit
        Context->>Storage: Save active list to localStorage
        Context-->>UI: Update bottom floating comparison drawer
    end
    Student->>UI: Clicks "Compare Now"
    UI->>Page: Navigate to /compare
    Page->>API: Fetch full comparison details by IDs
    API-->>Page: Return comparative matrix data
    Page-->>Student: Displays side-by-side comparative table
```

---

### 4. Authentication & Security Workflow

Handles student registration and login with zero vendor lock-in, bcrypt salt hashing, and tamper-proof HTTP-only cookie transport.

```mermaid
sequenceDiagram
    autonumber
    actor Student
    participant UI as Login / Signup Form
    participant AuthAPI as /api/auth/login or signup
    participant AuthService as AuthService
    participant DB as PostgreSQL

    Student->>UI: Enters Email and Password
    UI->>AuthAPI: POST /api/auth/login { email, password }
    AuthAPI->>AuthAPI: Validate input format with Zod
    AuthAPI->>AuthService: authenticate(email, password)
    AuthService->>DB: Find user by email
    DB-->>AuthService: User record with passwordHash
    AuthService->>AuthService: bcrypt.compare(password, passwordHash)
    alt Credentials Invalid
        AuthService-->>AuthAPI: Throw InvalidCredentialsError
        AuthAPI-->>UI: 401 Unauthorized { success: false, error: ... }
    else Credentials Valid
        AuthService->>AuthService: Sign JWT ({ userId, email, role })
        AuthService-->>AuthAPI: Token & Sanitized User Profile
        AuthAPI-->>UI: Set-Cookie: token=...; HttpOnly; SameSite=Lax; Path=/
        UI-->>Student: Authenticated state, redirects to saved colleges / profile
    end
```

- **Password Security**: Passwords are encrypted using `bcryptjs` with 10 salt rounds before database insertion. Plaintext passwords never touch logs or disk.
- **XSS Protection**: JWTs are stored exclusively in `HttpOnly` cookies, making them inaccessible to client-side scripts.

---

### 5. Shortlisting & Saved Colleges Workflow

Permits authenticated students to bookmark institutions for future review, with database-level uniqueness guarantees.

```mermaid
sequenceDiagram
    autonumber
    actor Student
    participant UI as College Card / Detail Page
    participant API as /api/saved-colleges
    participant Service as SavedCollegeService
    participant DB as PostgreSQL

    Student->>UI: Clicks "Bookmark / Save" icon
    alt Not Logged In
        UI-->>Student: Prompts redirect to /login
    else Logged In
        UI->>API: POST /api/saved-colleges { collegeId } + Cookie
        API->>API: Verify JWT token & extract userId
        API->>Service: saveCollege(userId, collegeId)
        Service->>DB: Upsert into SavedCollege (unique constraint: userId_collegeId)
        DB-->>Service: Saved record confirmed
        Service-->>API: Return success status
        API-->>UI: 200 OK { success: true }
        UI-->>Student: Icon toggles to filled bookmark
    end
```

---

### 6. Review Submission & Rating Aggregation Workflow

Students submit reviews with pros, cons, and star ratings. The system recalculates and updates the institution's overall rating score.

```mermaid
sequenceDiagram
    autonumber
    actor Student
    participant UI as Review Form
    participant API as /api/reviews
    participant Service as ReviewService
    participant DB as PostgreSQL

    Student->>UI: Submits review (rating: 4.5, pros, cons, title)
    UI->>API: POST /api/reviews { collegeId, rating, ... }
    API->>API: Verify session & validate input with Zod
    API->>Service: createReview(payload)
    Service->>DB: Insert new Review record
    Service->>DB: Aggregate AVG(rating) and COUNT(*) for college
    Service->>DB: Update College table with new rating & reviewCount
    DB-->>Service: Updated records
    Service-->>API: Review created successfully
    API-->>UI: 201 Created
    UI-->>Student: Displays new review and updated rating score
```

---

### 7. Admin College Management Workflow

Authorized administrators can create, update, or remove college records through protected management endpoints.

```mermaid
sequenceDiagram
    autonumber
    actor Admin
    participant AdminUI as /admin/colleges
    participant API as /api/admin/colleges
    participant DB as PostgreSQL

    Admin->>AdminUI: Fills new college form & courses/placements
    AdminUI->>API: POST /api/admin/colleges + Cookie
    API->>API: Verify JWT & check user role == 'admin'
    alt Not Admin
        API-->>AdminUI: 403 Forbidden
    else Authorized Admin
        API->>DB: Create College & nested relations (Courses, Placements, Facilities)
        DB-->>API: Created College Entity
        API-->>AdminUI: 201 Created { success: true, data: college }
        AdminUI-->>Admin: College published to directory immediately
    end
```

---

## 💻 Developer & Operational Workflow

### 1. Prerequisites
- **Node.js**: v18 or higher (tested on Node v22 / v24)
- **PostgreSQL**: Native local PostgreSQL server (Homebrew/apt) OR Cloud PostgreSQL (Neon, Supabase, Railway)

### 2. Environment Configuration
Create a `.env` file in the project root:
```bash
# Local PostgreSQL instance:
DATABASE_URL="postgresql://postgres@localhost:5434/collegedb?schema=public"

# OR Cloud PostgreSQL:
# DATABASE_URL="postgresql://user:password@ep-cool-db.us-east-2.aws.neon.tech/collegedb?sslmode=require"

JWT_SECRET="your_secure_random_jwt_secret_key_at_least_32_characters_long"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Database Initialization & Seeding
```bash
# Push schema changes to the database
npx prisma db push

# Populate database with 60+ accredited colleges, courses, placements, and demo user
npm run prisma:seed
```

### 4. Running the Development Server
```bash
npm run dev
```
Navigate to `http://localhost:3000` to interact with the platform.

### 5. Running Automated Tests
```bash
npm run test
```
Executes all unit and integration tests covering search, filters, pagination, comparisons, authentication, and review rating logic using Vitest.

### 6. Production Build & Deployment
```bash
# Build the optimized production bundle
npm run build

# Start the production Next.js server
npm run start
```
