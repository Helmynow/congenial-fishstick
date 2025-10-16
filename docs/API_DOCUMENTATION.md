# API Documentation

This document provides an overview of the ESE Evaluation & Recognition System API endpoints.

## Authentication

All API endpoints (except authentication endpoints) require a valid session cookie. Authentication is handled through NextAuth.js.

### Sign In
**Endpoint:** `POST /api/auth/signin/email`

**Description:** Initiate magic link authentication

**Request Body:**
```json
{
  "email": "user@ese-school.edu.eg",
  "callbackUrl": "http://localhost:3000/dashboard"
}
```

**Response:**
- Success: Redirects to verification page
- Error: Returns error message

---

## EOM (Employee of the Month) API

### Create Nomination

**Endpoint:** `POST /api/eom/nominations`

**Description:** Create a new EOM nomination for the current cycle

**Authentication:** Required (LEAD, PC, or CEO role)

**Request Body:**
```json
{
  "cycleId": "cktj0x1p30000jw1c9l8h0f0f",
  "categoryId": "cktj0x1p30001jw1c9l8h0f0g",
  "nomineeId": "cktj0x1p30002jw1c9l8h0f0h",
  "reason": "Exceptional leadership shown during the project launch. Demonstrated outstanding communication and problem-solving skills."
}
```

**Request Parameters:**
- `cycleId` (string, required): ID of the EOM cycle (must be in NOMINATING status)
- `categoryId` (string, required): ID of the category
- `nomineeId` (string, required): ID of the nominee user
- `reason` (string, required): Nomination reason (10-1000 characters)

**Success Response:**
```json
{
  "message": "Nomination submitted successfully",
  "nomination": {
    "id": "cktj0x1p30003jw1c9l8h0f0i",
    "categoryName": "Excellence in Teaching",
    "nomineeName": "John Doe"
  }
}
```

**Error Responses:**

- **401 Unauthorized**
  ```json
  {
    "error": "Unauthorized"
  }
  ```

- **400 Validation Error**
  ```json
  {
    "error": "Validation error",
    "details": {
      "reason": {
        "_errors": ["String must contain at least 10 character(s)"]
      }
    }
  }
  ```

- **400 Business Logic Error**
  ```json
  {
    "error": "You cannot nominate yourself"
  }
  ```
  
  ```json
  {
    "error": "You have already submitted a nomination for this category"
  }
  ```
  
  ```json
  {
    "error": "Cycle is not in NOMINATING status"
  }
  ```

- **500 Internal Server Error**
  ```json
  {
    "error": "Internal server error",
    "message": "Failed to create nomination"
  }
  ```

**Example cURL Request:**
```bash
curl -X POST http://localhost:3000/api/eom/nominations \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN" \
  -d '{
    "cycleId": "cktj0x1p30000jw1c9l8h0f0f",
    "categoryId": "cktj0x1p30001jw1c9l8h0f0g",
    "nomineeId": "cktj0x1p30002jw1c9l8h0f0h",
    "reason": "Exceptional leadership shown during the project launch."
  }'
```

**Side Effects:**
- Creates an activity log entry
- Creates a notification for the nominee
- Transaction ensures all-or-nothing operation

---

## MRE (Multi-Rater Evaluation) API

### Get User Assignments

**Endpoint:** `GET /api/mre/assignments`

**Description:** Retrieve all evaluation assignments for the current user

**Authentication:** Required

**Success Response:**
```json
{
  "assignments": [
    {
      "id": "assignment-id",
      "target": {
        "name": "John Doe",
        "department": "Mathematics"
      },
      "raterContext": "PEER",
      "status": "PENDING",
      "createdAt": "2025-10-16T10:00:00Z"
    }
  ]
}
```

---

## Data Types

### UserRole Enum
- `CEO`: Superadmin
- `PC`: People & Culture (Admin)
- `LEAD`: Leadership (Can nominate/vote/rate)
- `STAFF`: Regular staff

### UserSegment Enum
- `Language`: Language Division (Blues)
- `International`: International (Greens)
- `Whole`: Whole school

### EomCycleStatus Enum
- `DRAFT`: Cycle is being prepared
- `NOMINATING`: Accepting nominations
- `VERIFYING`: PC is verifying nominations
- `VOTING`: Accepting votes
- `CLOSED`: Cycle is closed

### MreAssignmentStatus Enum
- `PENDING`: Assignment not yet completed
- `SUBMITTED`: Evaluation has been submitted

---

## Error Handling

All API endpoints follow a consistent error response format:

```json
{
  "error": "Error type",
  "message": "Detailed error message",
  "details": {} // Optional: Additional error details
}
```

**Common HTTP Status Codes:**
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation error or business logic error)
- `401`: Unauthorized (not authenticated)
- `403`: Forbidden (authenticated but not authorized)
- `404`: Not Found
- `500`: Internal Server Error

---

## Rate Limiting

Currently, there is no rate limiting implemented. This may be added in future versions.

---

## Versioning

The API is currently unversioned. Breaking changes will be communicated in advance.

---

## Support

For API support or questions, contact the development team or refer to the project documentation.
