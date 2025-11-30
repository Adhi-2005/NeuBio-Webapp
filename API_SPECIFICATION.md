# HearTrack API Specification

This document outlines the backend API endpoints required for the HearTrack Patients application and the Admin Dashboard.

## Base URL
`http://localhost:5000` (or your production server URL)

## Authentication

### 1. Register User
*   **Endpoint:** `POST /api/auth/register`
*   **Description:** Creates a new user account.
*   **Request Body:**
    ```json
    {
      "email": "user@example.com",
      "password": "securePassword123",
      "firstName": "John",
      "lastName": "Doe",
      "guardianName": "Jane Doe", // Optional
      "guardianPhone": "+1234567890" // Optional
    }
    ```
*   **Response (201 Created):**
    ```json
    {
      "user": {
        "id": "uuid-string",
        "email": "user@example.com",
        "firstName": "John",
        "lastName": "Doe"
      },
      "token": "jwt-token-string" // If using JWT
    }
    ```

### 2. Login User
*   **Endpoint:** `POST /api/auth/login`
*   **Description:** Authenticates a user.
*   **Request Body:**
    ```json
    {
      "email": "user@example.com",
      "password": "securePassword123"
    }
    ```
*   **Response (200 OK):**
    ```json
    {
      "user": {
        "id": "uuid-string",
        "email": "user@example.com",
        "firstName": "John",
        "lastName": "Doe"
      },
      "token": "jwt-token-string"
    }
    ```

---

## Patient Application (Frontend)

### 3. Submit/Update Beneficiary Profile
*   **Endpoint:** `POST /api/beneficiary-profile`
*   **Description:** Saves the beneficiary details.
*   **Headers:** `Authorization: Bearer <token>`
*   **Request Body:**
    ```json
    {
      "insuredFirstName": "John",
      "insuredLastName": "Doe",
      "beneficiaryFirstName": "Baby",
      "beneficiaryMiddleName": "James",
      "beneficiaryLastName": "Doe",
      "beneficiarySuffix": "Jr",
      "beneficiaryDob": "2023-01-01",
      "beneficiaryGender": "male",
      "addressStreet": "123 Main St",
      "addressLine2": "Apt 4B",
      "addressCity": "Dubai",
      "addressState": "Dubai",
      "addressZip": "00000",
      "addressCountry": "UAE",
      "relationshipToInsured": "Child",
      "allocation": "100",
      "addBeneficiary2": "no",
      "totalAllocation": "100"
    }
    ```
*   **Response (200 OK):**
    ```json
    {
      "success": true,
      "profileId": "uuid-string"
    }
    ```

### 4. Submit Questionnaire Responses
*   **Endpoint:** `POST /api/questionnaire-responses`
*   **Description:** Saves the answers to the readiness questionnaire.
*   **Headers:** `Authorization: Bearer <token>`
*   **Request Body:**
    ```json
    {
      "q1_education": "University Degree",
      "q2_work": "Engineer",
      "q3_hobbies": "Reading, Swimming",
      "q4_siblings": "Yes, doing well",
      "q5_importance": "Crucial for development",
      "q6_expectations": "Normal life",
      "q7_commitment_medical": "Yes, fully committed",
      "q8_education_support": "Will hire tutor",
      "q9_caregiver": "Mother",
      "q10_challenges": "None",
      "q11_instruction_readiness": "Yes",
      "q12_commitment_level": "High"
    }
    ```
*   **Response (200 OK):**
    ```json
    {
      "success": true,
      "responseId": "uuid-string"
    }
    ```

### 5. Upload Document
*   **Endpoint:** `POST /api/documents/upload`
*   **Description:** Uploads a single document file.
*   **Headers:** `Authorization: Bearer <token>`, `Content-Type: multipart/form-data`
*   **Request Body (FormData):**
    *   `file`: (Binary File)
    *   `documentType`: "passport" | "emirates_id" | "medical_report" | ...
*   **Response (200 OK):**
    ```json
    {
      "success": true,
      "document": {
        "id": "uuid-string",
        "fileName": "passport.pdf",
        "fileUrl": "https://storage.bucket/path/to/passport.pdf",
        "status": "pending"
      }
    }
    ```

### 6. Get Application Status
*   **Endpoint:** `GET /api/application/status`
*   **Description:** Checks the current status of the user's application.
*   **Headers:** `Authorization: Bearer <token>`
*   **Response (200 OK):**
    ```json
    {
      "status": "pending" // "pending" | "review" | "approved" | "declined"
    }
    ```

---

## Admin Dashboard (Backend Integration)

### 7. Get All Applications
*   **Endpoint:** `GET /api/admin/applications`
*   **Description:** Retrieves a list of all patient applications.
*   **Headers:** `Authorization: Bearer <admin-token>`
*   **Response (200 OK):**
    ```json
    [
      {
        "userId": "uuid-string",
        "firstName": "John",
        "lastName": "Doe",
        "email": "user@example.com",
        "status": "review",
        "submittedAt": "2023-10-27T10:00:00Z"
      },
      ...
    ]
    ```

### 8. Get Full Application Details
*   **Endpoint:** `GET /api/admin/applications/:userId`
*   **Description:** Retrieves **EVERY** detail for a specific user (Profile, Questionnaire, Documents).
*   **Headers:** `Authorization: Bearer <admin-token>`
*   **Response (200 OK):**
    ```json
    {
      "user": {
        "id": "uuid-string",
        "firstName": "John",
        "lastName": "Doe",
        "email": "user@example.com"
      },
      "beneficiaryProfile": {
        "insuredFirstName": "John",
        "beneficiaryFirstName": "Baby",
        "addressCity": "Dubai",
        // ... all other profile fields
      },
      "questionnaire": {
        "q1_education": "University Degree",
        "q2_work": "Engineer",
        // ... all other answers
      },
      "documents": [
        {
          "id": "doc-uuid-1",
          "type": "passport",
          "fileName": "passport.pdf",
          "url": "https://api.heartrack.com/api/admin/documents/doc-uuid-1/download",
          "status": "pending"
        },
        {
          "id": "doc-uuid-2",
          "type": "medical_report",
          "fileName": "report.jpg",
          "url": "https://api.heartrack.com/api/admin/documents/doc-uuid-2/download",
          "status": "approved"
        }
      ]
    }
    ```

### 9. Download Document
*   **Endpoint:** `GET /api/admin/documents/:documentId/download`
*   **Description:** Downloads the actual file content.
*   **Headers:** `Authorization: Bearer <admin-token>`
*   **Response:** Binary file stream (PDF/Image).

### 10. Update Application Status
*   **Endpoint:** `PATCH /api/admin/applications/:userId/status`
*   **Description:** Updates the status of an application (e.g., Approve/Decline).
*   **Headers:** `Authorization: Bearer <admin-token>`
*   **Request Body:**
    ```json
    {
      "status": "approved", // "approved" | "declined" | "review"
      "notes": "All documents verified."
    }
    ```
*   **Response (200 OK):**
    ```json
    {
      "success": true,
      "newStatus": "approved"
    }
    ```
