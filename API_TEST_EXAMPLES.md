# API Test Examples & Catalog

This document contains test requests, query parameter options, and response JSON payloads for testing the **CollegeFinder** platform APIs.

Base URL: `http://localhost:3000` (or `http://localhost:3001` if running on port 3001).

---

## 1. College Discovery & Search (`GET /api/colleges`)

### Example 1.1: Basic Discovery (Page 1, Limit 2)
```bash
curl -s "http://localhost:3001/api/colleges?page=1&limit=2"
```

#### Response:
```json
{
  "success": true,
  "message": "Colleges retrieved successfully",
  "data": [
    {
      "id": "00419b0f-daf4-4bbc-b7a9-01e16bbe3d52",
      "slug": "aiims-new-delhi",
      "name": "All India Institute of Medical Sciences New Delhi",
      "shortName": "AIIMS Delhi",
      "overview": "AIIMS New Delhi is India's apex medical institution...",
      "establishedYear": 1956,
      "collegeType": "Medical",
      "ownership": "Public",
      "affiliation": "Autonomous Medical Institute of National Importance",
      "accreditation": "NIRF #1 Medical 2024",
      "rating": 5,
      "reviewCount": 520,
      "minFees": 1500,
      "maxFees": 6000,
      "city": "New Delhi",
      "state": "Delhi",
      "address": "Ansari Nagar, New Delhi 110029",
      "website": "https://www.aiims.edu",
      "logoUrl": "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=160&auto=format&fit=crop&q=80",
      "bannerUrl": "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&auto=format&fit=crop&q=80",
      "courses": [
        {
          "annualFees": 1628,
          "eligibility": "10+2 with PCB (60%) + NEET-UG Top Rank (AIR 1-50)",
          "course": {
            "name": "Bachelor of Medicine, Bachelor of Surgery (MBBS)",
            "degree": "MBBS",
            "code": "MBBS"
          }
        }
      ],
      "placements": [
        {
          "year": 2024,
          "highestPackage": 36,
          "averagePackage": 20,
          "topRecruiters": "Max Healthcare, Apollo Hospitals, Fortis Healthcare, Mayo Clinic Fellowship, NHS UK"
        }
      ],
      "_count": {
        "courses": 2,
        "reviews": 1
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 2,
    "total": 60,
    "totalPages": 30,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### Example 1.2: Filter by Search Keyword (`search=IIT`)
```bash
curl -s "http://localhost:3001/api/colleges?search=IIT&limit=3"
```

### Example 1.3: Filter by State & Stream
```bash
curl -s "http://localhost:3001/api/colleges?state=Delhi&collegeType=Engineering"
```

### Example 1.4: Filter by Fee Range & Minimum Rating
```bash
curl -s "http://localhost:3001/api/colleges?minFees=100000&maxFees=300000&minRating=4.5"
```

### Example 1.5: Sort by Fees Ascending
```bash
curl -s "http://localhost:3001/api/colleges?sort=fees_asc&limit=5"
```

---

## 2. College Detail View (`GET /api/colleges/[slug]`)

### Example 2.1: Existing College Slug
```bash
curl -s "http://localhost:3001/api/colleges/iit-bombay"
```

#### Response:
```json
{
  "success": true,
  "message": "College details retrieved successfully",
  "data": {
    "id": "92de9ccd-9697-4c3c-b411-ce21bc65f8df",
    "slug": "iit-bombay",
    "name": "Indian Institute of Technology Bombay",
    "shortName": "IIT Bombay",
    "overview": "IIT Bombay is a globally recognized public technical and research university located in Powai, Mumbai...",
    "establishedYear": 1958,
    "collegeType": "Engineering",
    "ownership": "Public",
    "affiliation": "Institute of National Importance",
    "accreditation": "NIRF #3 Engineering 2024",
    "rating": 4.9,
    "reviewCount": 420,
    "minFees": 220000,
    "maxFees": 250000,
    "city": "Mumbai",
    "state": "Maharashtra",
    "courses": [ ... ],
    "placements": [ ... ],
    "facilities": [ ... ],
    "reviews": [ ... ],
    "_count": {
      "savedBy": 1
    }
  }
}
```

### Example 2.2: Non-existent Slug (404 Error)
```bash
curl -s "http://localhost:3001/api/colleges/unknown-college"
```

#### Response:
```json
{
  "success": false,
  "error": {
    "code": "COLLEGE_NOT_FOUND",
    "message": "College with identifier 'unknown-college' was not found",
    "details": null
  }
}
```

---

## 3. Compare Colleges (`GET /api/colleges/compare`)

### Example 3.1: Compare 2 Colleges
```bash
curl -s "http://localhost:3001/api/colleges/compare?slugs=iit-bombay,iit-delhi"
```

### Example 3.2: Comparison Limit Exceeded (>3 colleges)
```bash
curl -s "http://localhost:3001/api/colleges/compare?slugs=iit-bombay,iit-delhi,iit-madras,iit-kanpur"
```

#### Response (400 Bad Request):
```json
{
  "success": false,
  "error": {
    "code": "MAX_COMPARISON_EXCEEDED",
    "message": "You can compare at most 3 colleges at a time",
    "details": null
  }
}
```

---

## 4. Authentication (`POST /api/auth/*`)

### Example 4.1: Signup
```bash
curl -s -X POST "http://localhost:3001/api/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Priya Sharma",
    "email": "priya.student@example.com",
    "password": "SecurePassword123"
  }'
```

#### Response (201 Created):
```json
{
  "success": true,
  "message": "Account created successfully",
  "data": {
    "user": {
      "id": "...",
      "email": "priya.student@example.com",
      "name": "Priya Sharma",
      "role": "student"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Example 4.2: Login
```bash
curl -s -i -X POST "http://localhost:3001/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@example.com",
    "password": "Password123"
  }'
```

#### Response Header & Body:
```http
HTTP/1.1 200 OK
Set-Cookie: auth_token=...; Path=/; HttpOnly; SameSite=Lax
Content-Type: application/json

{
  "success": true,
  "message": "Logged in successfully",
  "data": {
    "user": {
      "id": "8255dd6e-82f2-4b76-bd2c-986c0e041906",
      "email": "student@example.com",
      "name": "Rahul Sharma",
      "role": "student"
    },
    "token": "..."
  }
}
```

### Example 4.3: Login with Invalid Password
```bash
curl -s -X POST "http://localhost:3001/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@example.com",
    "password": "WrongPassword!"
  }'
```

#### Response (401 Unauthorized):
```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Invalid email or password",
    "details": null
  }
}
```

---

## 5. Saved Colleges (`/api/saved-colleges`)

### Example 5.1: List Saved Colleges (with Bearer Token or Cookie)
```bash
curl -s "http://localhost:3001/api/saved-colleges" \
  -H "Authorization: Bearer <TOKEN>"
```

#### Response:
```json
{
  "success": true,
  "message": "Saved colleges retrieved successfully",
  "data": [
    {
      "savedAt": "2026-09-10T00:29:04.000Z",
      "college": {
        "id": "92de9ccd-9697-4c3c-b411-ce21bc65f8df",
        "slug": "iit-bombay",
        "name": "Indian Institute of Technology Bombay",
        "city": "Mumbai",
        "state": "Maharashtra",
        "rating": 4.9
      }
    }
  ]
}
```

### Example 5.2: Save a College
```bash
curl -s -X POST "http://localhost:3001/api/saved-colleges" \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"collegeId": "92de9ccd-9697-4c3c-b411-ce21bc65f8df"}'
```

### Example 5.3: Remove a Saved College
```bash
curl -s -X DELETE "http://localhost:3001/api/saved-colleges/92de9ccd-9697-4c3c-b411-ce21bc65f8df" \
  -H "Authorization: Bearer <TOKEN>"
```
