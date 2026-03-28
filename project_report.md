# Privacy Cloud - System Report

## Abstract
Privacy Cloud is a web-based secure file storage application that prioritizes user privacy through a "Zero-Knowledge" architecture. Unlike traditional cloud providers where the service provider holds the decryption keys, Privacy Cloud performs all encryption and decryption operations on the client side (in the user's browser). This ensures that the server only ever stores encrypted binary blobs, making data breaches significantly less impactful as the stolen data is unreadable without the user's password. This report details the design, implementation, and testing of the system.

## 1. Introduction
In today's digital age, data privacy is a major concern. High-profile data breaches and the monetization of user data by large corporations have eroded trust. Users need a simple, accessible way to store their files in the cloud without compromising their privacy.

**Privacy Cloud** addresses this need by combining the convenience of cloud storage with the security of end-to-end encryption. The keys are derived from the user's password and never leave the user's device.

### 1.1 Problem Statement
*   **Trust Outcome**: Users must trust cloud providers not to peek at their data.
*   **Data Sovereignty**: Users lose control over their data once it is uploaded.
*   **Security Vulnerabilities**: Centralized storage of keys makes servers a high-value target for attackers.

### 1.2 Proposed Solution
A web application where:
1.  Registration creates a unique salt for the user.
2.  Login retrieves the salt to derive the encryption key locally.
3.  Files are encrypted in the browser before upload.
4.  Files are decrypted in the browser after download.

## 2. Requirement Specifications

### 2.1 Functional Requirements
*   **Authentication**: Secure registration and login using hashed passwords.
*   **File Upload**: Drag-and-drop interface for uploading files. Support for bulk uploads.
*   **Encryption**: AES-GCM encryption with 256-bit keys.
*   **File Management**: Dashboard to list, delete, and download files.
*   **File Preview**: Integrated media player for video/audio and viewer for PDFs and images.
*   **Admin Panel**: 
    *   System-wide statistics (Total Users, Storage Used).
    *   File type distribution visualization.
    *   User activity monitoring (Last Active dates).

*   **Storage Quotas & Capacities**: 
    The system is designed to handle significant data loads with specific configurations for integrity and performance.
    *   **Per-File Limit**: Each individual file upload is capped at **2 Gigabytes (2GB)**. This limit is enforced at the application level to ensure stability during importance encryption processes in the browser and to prevent timeout issues during the chunked upload to the server.
    *   **Total User Storage**: There is **no imposed limit** on the total aggregate storage a user can utilize. Users can upload an unlimited number of files, provided the physical server infrastructure has available disk space. This "pay-as-you-grow" model allows the system to scale with the user's needs without artificial constraints.

### 2.2 Non-Functional Requirements
*   **Performance**: Fast encryption/decryption using Web Crypto API.
*   **Scalability**: Use of MongoDB GridFS to handle files exceeding 16MB document limits.
*   **Compatibility**: Works on all modern browsers (Chrome, Firefox, Edge, Safari).
*   **Security**: HTTPS enforcement (recommended for production), Helmet headers, and secure cookies.

### 2.3 System Requirements
*   **Hardware**: Server with at least 2GB RAM (for database caching) and 20GB Storage.
*   **Software**: Python 3.8+, MongoDB 4.4+, Node.js (for asset management if needed).

## 3. System Design

### 3.1 Architecture Diagram
The system follows a standard MVC (Model-View-Controller) pattern, adapted for a Flask application.

*   **Client (View)**: The browser runs the `crypto.js` logic. It handles the UI and the heavy lifting of encryption.
*   **Server (Controller)**: Flask app routes requests, checks sessions, and passes verified data to the database.
*   **Database (Model)**: MongoDB stores:
    *   `users`: User credentials and admin flags.
    *   `fs.files`: Metadata for files (filename, size, MIME type).
    *   `fs.chunks`: The actual encrypted binary data split into 255KB chunks.

### 3.2 Detailed Crypto Flow
1.  **Key Gen**: `PBKDF2` (100,000 iterations) derives a `CryptoKey` from the User Password + Salt.
2.  **Encryption**: `AES-GCM` uses the `CryptoKey` + a random 12-byte `IV` (Initialization Vector) to encrypt the file.
3.  **Storage**: The `Encrypted Blob`, `IV`, and `Salt` are sent to the server.
4.  **Decryption**: The reverse process. The server sends the `Encrypted Blob` + `IV`. The browser rebuilds the key and decrypts.

## 4. Implementation Details

### 4.1 Tech Stack
*   **Language**: Python 3.12 (Backend), JavaScript ES6 (Frontend).
*   **Framework**: Flask (Microframework).
*   **Database**: MongoDB (NoSQL).
*   **Styling**: Custom CSS with Glassmorphism design principles.

### 4.2 Module Description

#### A. Authentication Module
Handles user signup and login. Uses `bcrypt` for hashing passwords before storing them in the DB. This module manages Flask `session` to keep users logged in.

#### B. Dashboard Module
The main interface for users.
*   **Upload Area**: A drag-and-drop zone that triggers the encryption worker.
*   **File List**: Dynamic list fetching using AJAX.
*   **Preview Modal**: A modal window that determines the file type and renders the appropriate HTML5 tag (`<video>`, `<img>`, etc.).

#### C. Admin Module (New)
A restricted area for the superuser.
*   **Aggregation**: Uses MongoDB aggregation pipelines to calculate the total storage used per user and break down file types.
*   **User Management**: Allows the admin to search for users and see their last activity.

## 5. Testing

### 5.1 Unit Testing
*   **Route Testing**: Verified that `/home` redirects to `/login` if no session exists.
*   **Database Testing**: Verified that creating a user adds a document to the `users` collection.

### 5.2 System Testing
*   **Large File Upload**: Tested with a 1.5GB video file. Result: Success (GridFS chunking worked).
*   **Wrong Password**: Tested login with incorrect password. Result: Access Denied.
*   **Admin Access**: Tested accessing `/admin` as a standard user. Result: Redirected to Home.

### 5.3 UX Testing
*   **Mobile Responsiveness**: Verified layout on mobile screen widths (375px). The Sidebar collapses correctly.
*   **Preview Support**: Tested MP4, PDF, and JPG files. All rendered correctly in the browser.

## 6. Future Scope
*   **File Sharing**: generating a unique link and temporary key to share files with non-users.
*   **Folder Structure**: Allowing users to organize files into directories.
*   **2FA**: Adding Two-Factor Authentication for extra security.
*   **Desktop App**: Electron-based desktop application for offline encryption.

## 7. Conclusion
Privacy Cloud successfully implements a secure, user-friendly file storage system. By shifting the cryptographic load to the client, we achieve a high degree of privacy without burdening the server. The addition of the Admin Panel provides necessary oversight for system maintainers. The project meets all initial functional requirements and sets a strong foundation for future privacy-focused features.

## 8. Bibliography
1.  **Flask Documentation**: https://flask.palletsprojects.com/
2.  **MongoDB Documentation**: https://www.mongodb.com/docs/
3.  **MDN Web Docs - Web Crypto API**: https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API
4.  **PyMongo Distribution**: https://pymongo.readthedocs.io/
5.  **Google Fonts**: https://fonts.google.com/
6.  **RFC 7518 (JSON Web Algorithms)**: https://datatracker.ietf.org/doc/html/rfc7518 (AES-GCM specs)
