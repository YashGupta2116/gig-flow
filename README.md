# GigFlow - Freelance Marketplace Platform

A fullstack freelance marketplace platform where Clients can post jobs (Gigs) and Freelancers can bid on them. Built with React, Node.js, Express, MongoDB, and Socket.io for realtime updates.

## Project Overview

GigFlow is a mini-freelance marketplace platform that demonstrates complex database relationships, secure authentication, state management, and real-time communication. The system allows users to seamlessly switch between Client and Freelancer roles.

**Key Features:**

- Secure JWT-based authentication with HttpOnly cookies
- Gig management (Create, Browse, Search)
- Bidding system for freelancers
- Hiring workflow with race condition prevention
- Real-time notifications via Socket.io
- Modern UI with Tailwind CSS

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Features](#features)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Bonus Features](#bonus-features)
- [Environment Variables](#environment-variables)

## Tech Stack

### Frontend

- **React.js 19** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Redux Toolkit** - State management
- **Socket.io Client** - Real-time communication
- **Axios** - HTTP client
- **Lucide React** - Icons

### Backend

- **Node.js** - Runtime environment
- **Express.js 5** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **Socket.io** - Real-time server
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Cookie Parser** - Cookie handling

## Project Structure

```
gig-flow/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js              # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── authController.js  # Authentication logic
│   │   │   ├── gigsController.js  # Gig CRUD operations
│   │   │   └── bidController.js   # Bidding & hiring logic
│   │   ├── middleware/
│   │   │   └── auth.middleware.js # JWT verification
│   │   ├── models/
│   │   │   ├── User.js           # User schema
│   │   │   ├── Gigs.js           # Gig schema
│   │   │   └── Bid.js             # Bid schema
│   │   ├── routes/
│   │   │   ├── authRoutes.js     # Auth endpoints
│   │   │   ├── gigRoutes.js       # Gig endpoints
│   │   │   └── bidRoutes.js      # Bid endpoints
│   │   ├── utils/
│   │   │   └── generateToken.js  # JWT generation
│   │   └── index.js               # Server entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth.jsx           # Login/Register
│   │   │   ├── Dashboard.jsx     # Main dashboard
│   │   │   ├── GigList.jsx        # Browse gigs
│   │   │   ├── CreateGig.jsx     # Post new gig
│   │   │   ├── MyGigs.jsx        # User's posted gigs
│   │   │   ├── MyBids.jsx        # User's bids
│   │   │   ├── BidModal.jsx      # Place bid modal
│   │   │   ├── BidListModal.jsx  # View bids modal
│   │   │   ├── Navbar.jsx        # Navigation
│   │   │   └── NotificationToast.jsx # Toast notifications
│   │   ├── store/
│   │   │   ├── slices/
│   │   │   │   ├── authSlice.js      # Auth state
│   │   │   │   ├── gigSlice.js       # Gig state
│   │   │   │   ├── bidSlice.js       # Bid state
│   │   │   │   └── notificationSlice.js # Notification state
│   │   │   └── store.js           # Redux store
│   │   ├── hooks/
│   │   │   └── useSocket.js       # Socket.io hook
│   │   └── App.jsx                # Root component
│   └── package.json
└── README.md
```

## Features

### A. User Authentication

- Secure sign-up with email validation
- Secure login with password hashing
- JWT tokens stored in HttpOnly cookies
- Protected routes with middleware
- Session persistence on page reload
- Fluid roles: Any user can be Client or Freelancer

### B. Gig Management (CRUD)

- Browse all open gigs
- Search gigs by title/description
- Create new gig posts (Title, Description, Budget)
- View own posted gigs
- Gig status tracking (OPEN/ASSIGNED)

### C. Bidding System

- Submit bids on open gigs
- Bid includes message and price
- Prevent duplicate bids (one bid per gig per freelancer)
- Prevent bidding on own gigs
- View all bids for a gig (owner only)

### D. Hiring Logic (Critical Feature)

- Client can hire a freelancer from bid list
- Atomic status updates:
  - Gig status: OPEN → ASSIGNED
  - Selected bid: PENDING → HIRED
  - Other bids: PENDING → REJECTED
- Race condition prevention (see Bonus Features)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd gig-flow
   ```

2. **Backend Setup**

   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your MongoDB URI and JWT secret
   npm run dev
   ```

3. **Frontend Setup**

   ```bash
   cd frontend
   npm install
   cp .env.example .env
   # Edit .env with your backend URL
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:3000

## API Documentation

### Authentication Endpoints

| Method | Endpoint             | Description                 | Auth Required |
| ------ | -------------------- | --------------------------- | ------------- |
| POST   | `/api/auth/register` | Register new user           | No            |
| POST   | `/api/auth/login`    | Login & set HttpOnly cookie | No            |
| POST   | `/api/auth/logout`   | Logout & clear cookie       | No            |
| GET    | `/api/auth/me`       | Get current user            | Yes           |

### Gig Endpoints

| Method | Endpoint              | Description                                       | Auth Required |
| ------ | --------------------- | ------------------------------------------------- | ------------- |
| GET    | `/api/gigs`           | Get all open gigs (with optional `?search=query`) | No            |
| GET    | `/api/gigs/:id`       | Get gig by ID                                     | No            |
| GET    | `/api/gigs/my/posted` | Get user's posted gigs                            | Yes           |
| POST   | `/api/gigs`           | Create new gig                                    | Yes           |

### Bid Endpoints

| Method | Endpoint                | Description                         | Auth Required |
| ------ | ----------------------- | ----------------------------------- | ------------- |
| POST   | `/api/bids`             | Submit a bid for a gig              | Yes           |
| GET    | `/api/bids/:gigId`      | Get all bids for a gig (owner only) | Yes           |
| GET    | `/api/bids/my/bids`     | Get user's bids                     | Yes           |
| PATCH  | `/api/bids/:bidId/hire` | Hire a freelancer (atomic update)   | Yes           |

## Bonus Features

### Bonus 1: Transactional Integrity (Race Conditions)

**Implementation:**

- Uses MongoDB transactions when replica set is available
- Falls back to atomic `findOneAndUpdate` operations for standalone MongoDB
- Prevents race conditions when multiple admins hire simultaneously

**How it works:**

```javascript
// Atomic check: Only update if status is still OPEN
const updatedGig = await gigs.findOneAndUpdate(
  { _id: gig._id, status: "OPEN" },
  { status: "ASSIGNED" },
  { new: true }
);
```

If two users click "Hire" simultaneously:

- First request: Updates gig from OPEN → ASSIGNED
- Second request: Finds gig is no longer OPEN, update fails
- Second request receives: "Gig is already assigned..."

### Bonus 2: Real-time Updates with Socket.io

**Implementation:**

- Backend emits Socket.io events when hiring
- Frontend receives instant notifications
- Toast notifications appear without page refresh
- Browser notifications (if permitted)

**Flow:**

1. Client hires freelancer → Backend processes
2. Backend emits: `io.to(freelancerId).emit("hired", data)`
3. Freelancer's browser receives event instantly
4. Redux store updated → Toast appears
5. Browser notification also triggered

## Environment Variables

### Backend (.env)

```env.example
PORT=3000
MONGO_URI="your-mongo-db-url"
JWT_SECRET=your-super-secret-jwt-key-here
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:3000
```

## 👨‍💻 Development

### Running in Development

```bash
# Backend (with auto-reload)
cd backend && npm run dev

# Frontend (with HMR)
cd frontend && npm run dev
```

### Testing Race Conditions

1. Open same gig's bid list in two browser windows (as different users)
2. Click "Hire" on different bids simultaneously
3. Only one should succeed

\*\*Built with ❤️ by Yash
