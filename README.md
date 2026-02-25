# Social Media App

A full-stack social networking application where users can register, log in, create posts, like posts, follow other users, and edit their profiles — built with **Node.js**, **Express**, **MongoDB**, and **Vanilla JavaScript** (frontend).

---

## Features

### 🔑 Authentication
- User registration with username, email, and password
- Secure login with JWT tokens
- Persistent login using `localStorage`

### 👤 User Profiles
- View user details (username, email, bio, location, profile picture)
- Follow/Unfollow users
- See follower & following counts
- Edit your own profile (username, email, bio, location, profile picture)

### 📝 Posts
- Create posts with optional images
- Like/unlike posts
- View post like counts and comment counts
- View posts by a specific user

### 📜 Feed
- Displays all posts from users
- Like/unlike directly from the feed

---

## Tech Stack

**Frontend**
- HTML5, CSS3, Vanilla JavaScript
- Fetch API for HTTP requests

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- Multer for image uploads
- JWT for authentication

---

## API Endpoints

### **Auth**
- `POST /api/users/register` – Register a new account
- `POST /api/users/login` – Log in

### **Users**
- `GET /api/users/:id` – Get user by ID
- `POST /api/users/:id/follow` – Follow/unfollow a user
- `PUT /api/users/:id` – Edit profile

### **Posts**
- `GET /api/posts` – Get all posts
- `GET /api/posts/user/:id` – Get posts by a user
- `POST /api/posts` – Create a post
- `POST /api/posts/:id/like` – Like/unlike a post

---
