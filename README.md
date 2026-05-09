# Full-Stack Capstone Blog Application Engine

A high-performance blog platform that enables collaborative content creation through three distinct user roles: **Users**, **Authors**, and **Admins**. The system integrates secure authentication, image processing, and a modern "Aurora" glassmorphism UI.

## 🚀 Technical Stack
*   **Frontend:** React, React Router, Zustand (State Management), Tailwind CSS.
*   **Backend:** Node.js, Express.js.
*   **Database:** MongoDB via Mongoose.
*   **Authentication:** JWT (JSON Web Tokens) with Cookies and Bcryptjs for password hashing.
*   **Storage:** Multer and Cloudinary for profile image management.

---

## 🏗 System Architecture & Roles

The application is built on a modular router architecture with four primary API sectors: `/auth`, `/user-api`, `/author-api`, and `/admin-api`.

### 1. Admin Features (`ADMIN`)
*   **User Oversight:** Access a centralized list of all users and authors in the system.
*   **Status Management:** Ability to block or unblock users and authors to maintain platform integrity.
*   **Exclusion Logic:** Admins are filtered out of the general user lists for security.

### 2. Author Features (`AUTHOR`)
*   **Content Lifecycle:** Full CRUD operations for articles, including creating, editing, and soft-deleting.
*   **Article Management:** Authors can view their own published history and modify existing content.
*   **Soft Delete:** Authors can toggle `isArticleActive` to hide articles without permanent deletion.

### 3. User Features (`USER`)
*   **Article Discovery:** Browse a feed of active articles with author details populated directly from the database.
*   **Engagement:** Add comments to specific articles to foster community interaction.
*   **Profile Control:** Update personal account details and change passwords securely.

---

## 💾 Data Modeling

### User Schema
*   **Fields:** `firstName`, `lastName`, `email`, `password`, `role`, `profileImageUrl`, and `isUserActive`.
*   **Security:** Role validation using an enum: `["USER", "AUTHOR", "ADMIN"]`.

### Article Schema
*   **Structure:** Includes `author` (referenced ID), `title`, `category`, `content`, and `isArticleActive`.
*   **Nested Data:** A dedicated `commentSchema` handles user-comment arrays within each article document.

---

## 🛡 Security & Middleware

*   **Role-Based Access Control (RBAC):** The `verifyToken` middleware validates JWTs and checks if the user's role is authorized for the requested route.
*   **Secure File Uploads:** Multer handles memory storage of images, restricted to 2MB and specific formats (JPG/PNG), before uploading them to **Cloudinary**.
*   **Global Error Handling:** Specialized backend middleware catches `ValidationError`, `CastError`, and duplicate key errors (code 11000) to return clean, standardized JSON responses.

---

## 🎨 UI & Design System

The frontend utilizes a "Premium Glassmorphism" style defined in a centralized `common.js` file:
*   **Visual Style:** Aurora mesh gradient backgrounds (`indigo-100` to `blue-100`) and backdrop-blur effects.
*   **Cards:** "Ultra-Glass" look with floating animations and subtle purple-tinted borders.
*   **Typography:** Vibrant multi-color gradients for page titles and high-contrast slate colors for readability.

---

## 🚦 API Endpoints (Core)

| Method | Endpoint | Access | Function |
| :--- | :--- | :--- | :--- |
| **POST** | `/auth/users` | Public | Register new account with profile image. |
| **POST** | `/auth/login` | Public | Authenticate user and set HTTP-only cookie. |
| **GET** | `/user-api/articles` | All | Fetch all active articles. |
| **POST** | `/author-api/articles`| Author | Create a new blog post. |
| **PATCH** | `/admin-api/user-status`| Admin | Block or unblock a user profile. |

---

## 🔧 Installation & Usage

1.  **Backend:**
    *   Configure `.env` with `DB_URL`, `PORT`, `CLOUDINARY_` credentials, and `SECRET_KEY`.
    *   Run `npm run dev` to start the server on Port 5000.
2.  **Frontend:**
    *   Ensure the `axios` base URL matches the server.
    *   Run `npm run dev` and navigate to the application to login via the `Login.jsx` portal.
