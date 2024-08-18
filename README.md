This application provides user management functionalities with a focus on backend services. It includes user authentication, token-based security, and CRUD operations for user management. Built using Node.js, Express, Sequelize, and MySQL.

Features
**User Authentication:**

Sign-Up: Register new users with hashed passwords.
Login: Authenticate users and issue JWT tokens.
Forgot Password: Request a password reset and send a secure token via email.
Reset Password: Reset user passwords using secure tokens.
Token Management:

JWT Access and Refresh Tokens for secure API access.
Middleware for validating access tokens and refreshing tokens.

**User Management:**

List Users: Retrieve a paginated list of users (admin only).
Modify User: Update user details (excluding passwords).
Delete User: Remove users from the system (admin only).
