# 📖 Job Search App

The **Job Search App** is a backend system built using **Express.js** and **Node.js**, designed to connect job seekers with companies and streamline the hiring process. It includes features like user authentication, real-time chat, job management, and an admin dashboard for efficient oversight.

---

## ✨ Features

### 🔐 Authentication & Authorization

- **Sign Up & Login**: Users can register and log in via email/password or Google OAuth.
- **OTP Verification**: Email verification using OTP (valid for 10 minutes).
- **Password Reset**: Forgot password functionality with OTP validation.
- **Role-Based Access**:
  - **User**: Apply for jobs, update profile, and chat with HR.
  - **HR**: Manage jobs and applications.
  - **Admin**: Approve companies, ban/unban users/companies, and view all data via GraphQL.

---

### 🏢 Company Management

- **Add Company**: Create a company profile with unique name and email.
- **Update Company**: Only the company owner can update details (except legal attachment).
- **Soft Delete**: Admin or company owner can soft delete a company.
- **Search Companies**: Search for companies by name.
- **Upload Media**: Add or remove company logo and cover picture.
- **View Jobs**: Retrieve all jobs related to a specific company using virtual populate.

---

### 📚 Job Management

- **Add Job**: HR or company owner can post new job opportunities.
- **Update/Delete Job**: Only the owner can update or delete a job.
- **Filter Jobs**: Users can filter jobs by `workingTime`, `jobLocation`, `seniorityLevel`, `jobTitle`, and `technicalSkills`.
- **Pagination**: All job-related APIs support pagination (`skip`, `limit`, `sort`, and total count).
- **View Applications**: HR can view all applications for a specific job, including user details (not just `userId`).
- **Export Applications**: Generate an Excel sheet of job applications for a specific company on a specific day.
- **Apply to Job**: Users can apply to jobs, and HR is notified via a Socket.IO event.
- **Accept/Reject Applicants**: HR can accept or reject candidates, with automated emails sent to applicants.

---

### 👤 User Management

- **Profile Updates**: Users can update their account details (`firstName`, `lastName`, `DOB`, `mobileNumber`, etc.).
- **Password Update**: Securely update passwords.
- **Upload Media**: Add or remove profile and cover pictures.
- **Soft Delete**: Users can soft delete their accounts.

---

### 💬 Real-Time Chat

- **Chat History**: Retrieve chat history with a specific user.
- **Real-Time Messaging**: HR or company owner can initiate conversations, and regular users can reply.
- **Socket.IO Integration**: Real-time communication between HR and users.

---

### 🛠️ Admin Dashboard

- **GraphQL Queries**: Fetch all users and companies in a single request.
- **Ban/Unban**: Admin can ban or unban users and companies.
- **Approve Companies**: Admin can approve pending company registrations.

---

## 🛠️ Tech Stack

- **Backend**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT (Access Token, Refresh Token), OTP for email confirmation
- **Real-Time Communication**: Socket.IO
- **Security**: Helmet, CORS, bcrypt for password hashing
- **File Uploads**: Cloudinary for storing images and PDFs
- **Task Scheduling**: CRON jobs for deleting expired OTP codes
- **API Testing**: Postman collections for testing

---

## 🌟 Project Highlights

- **Validation**: JOI for API data validation.
- **Error Handling**: Individual and global error handling for robust APIs.
- **Clean Code**: Follows clean code principles (meaningful names, no hardcoding, consistent formatting).
- **Environment Variables**: All sensitive data (e.g., database URIs, API keys, email credentials) is securely managed using environment variables.

---

## 🤝 Contributions

Feel free to contribute to this project by opening issues or submitting pull requests. For major changes, please open an issue first to discuss the proposed changes.

