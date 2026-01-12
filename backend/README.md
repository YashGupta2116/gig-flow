# GigFlow Backend API

RESTful API server for the GigFlow freelance marketplace platform, built with Node.js, Express, MongoDB, and Socket.io.

## Quick Start

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env with your configuration

# Run in development mode
npm run dev

# Run in production mode
npm start
```

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local instance or MongoDB Atlas)
- npm or yarn

## Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=3000
MONGO_URI="your-mongo-db-url"

JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Environment Variables Explained

- **PORT**: Server port (default: 3000)
- **MONGO_URI**: MongoDB connection string
- **JWT_SECRET**: Secret key for signing JWT tokens (use a strong random string in production)
- **NODE_ENV**: Environment mode (development/production)
- **FRONTEND_URL**: Frontend URL for CORS configuration

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── db.js              # MongoDB connection configuration
│   ├── controllers/
│   │   ├── authController.js  # Authentication logic (register, login, logout, getMe)
│   │   ├── gigsController.js  # Gig CRUD operations
│   │   └── bidController.js   # Bidding and hiring logic with transactions
│   ├── middleware/
│   │   └── auth.middleware.js # JWT verification middleware
│   ├── models/
│   │   ├── User.js           # User schema
│   │   ├── Gigs.js           # Gig schema
│   │   └── Bid.js             # Bid schema with unique constraint
│   ├── routes/
│   │   ├── authRoutes.js     # Authentication routes
│   │   ├── gigRoutes.js      # Gig routes
│   │   └── bidRoutes.js      # Bid routes
│   ├── utils/
│   │   └── generateToken.js  # JWT token generation utility
│   └── index.js               # Server entry point with Socket.io setup
└── package.json
```

## API Endpoints

### Authentication

#### Register User

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "_id": "user_id",
  "name": "John Doe",
  "email": "john@example.com"
}
```

Sets HttpOnly cookie with JWT token.

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "_id": "user_id",
  "name": "John Doe",
  "email": "john@example.com"
}
```

Sets HttpOnly cookie with JWT token.

#### Logout

```http
POST /api/auth/logout
```

**Response:**

```json
{
  "message": "Logged out successfully"
}
```

Clears authentication cookie.

#### Get Current User

```http
GET /api/auth/me
```

**Response:**

```json
{
  "_id": "user_id",
  "name": "John Doe",
  "email": "john@example.com"
}
```

### Gigs

#### Get All Open Gigs

```http
GET /api/gigs
GET /api/gigs?search=react
```

**Response:**

```json
[
  {
    "_id": "gig_id",
    "title": "Build React Dashboard",
    "description": "Need a modern dashboard...",
    "budget": 1000,
    "status": "OPEN",
    "ownerId": {
      "_id": "owner_id",
      "name": "Client Name",
      "email": "client@example.com"
    },
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

#### Get Gig by ID

```http
GET /api/gigs/:id
```

#### Get My Posted Gigs

```http
GET /api/gigs/my/posted
```

Requires authentication.

#### Create Gig

```http
POST /api/gigs
Content-Type: application/json
Authorization: Required

{
  "title": "Build React Dashboard",
  "description": "Need a modern dashboard with charts",
  "budget": 1000
}
```

**Response:**

```json
{
  "_id": "gig_id",
  "title": "Build React Dashboard",
  "description": "Need a modern dashboard with charts",
  "budget": 1000,
  "status": "OPEN",
  "ownerId": {
    "_id": "owner_id",
    "name": "Client Name",
    "email": "client@example.com"
  },
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### Bids

#### Submit Bid

```http
POST /api/bids
Content-Type: application/json
Authorization: Required

{
  "gigId": "gig_id",
  "message": "I am experienced in React and dashboard development!",
  "price": 1100
}
```

**Response:**

```json
{
  "_id": "bid_id",
  "gigId": {
    "_id": "gig_id",
    "title": "Build React Dashboard"
  },
  "freelancerId": {
    "_id": "freelancer_id",
    "name": "Freelancer Name",
    "email": "freelancer@example.com"
  },
  "message": "I am experienced...",
  "price": 1100,
  "status": "PENDING",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

**Validation:**

- Cannot bid on own gig
- Cannot bid on closed gigs
- One bid per gig per freelancer (unique constraint)

#### Get Bids for Gig

```http
GET /api/bids/:gigId
```

Requires authentication. Only gig owner can view bids.

**Response:**

```json
[
  {
    "_id": "bid_id",
    "freelancerId": {
      "_id": "freelancer_id",
      "name": "Freelancer Name",
      "email": "freelancer@example.com"
    },
    "message": "I am experienced...",
    "price": 1100,
    "status": "PENDING",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

#### Get My Bids

```http
GET /api/bids/my/bids
```

Requires authentication.

**Response:**

```json
[
  {
    "_id": "bid_id",
    "gigId": {
      "_id": "gig_id",
      "title": "Build React Dashboard",
      "budget": 1000,
      "status": "OPEN"
    },
    "message": "I am experienced...",
    "price": 1100,
    "status": "PENDING",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

#### Hire Freelancer

```http
PATCH /api/bids/:bidId/hire
Authorization: Required
```

**Response:**

```json
{
  "message": "Freelancer hired successfully",
  "bid": {
    "_id": "bid_id",
    "status": "HIRED",
    "freelancerId": {
      "_id": "freelancer_id",
      "name": "Freelancer Name",
      "email": "freelancer@example.com"
    },
    "gigId": {
      "_id": "gig_id",
      "title": "Build React Dashboard",
      "budget": 1000
    }
  }
}
```

**What happens:**

1. Gig status: OPEN → ASSIGNED
2. Selected bid: PENDING → HIRED
3. Other bids for same gig: PENDING → REJECTED
4. Socket.io event emitted to hired freelancer

**Race Condition Prevention:**

- Uses MongoDB transactions (if replica set available)
- Falls back to atomic `findOneAndUpdate` operations
- Only updates if gig status is still "OPEN"

## Authentication

The API uses JWT (JSON Web Tokens) stored in HttpOnly cookies for security.

### How it works:

1. User registers/logs in
2. Server generates JWT token
3. Token stored in HttpOnly cookie (not accessible via JavaScript)
4. Cookie sent automatically with subsequent requests
5. Middleware verifies token on protected routes

### Protected Routes

All routes except `/api/auth/register`, `/api/auth/login`, and `GET /api/gigs` require authentication.

## Database Models

### User

- `name`: String (required)
- `email`: String (required, unique, lowercase)
- `password`: String (required, hashed with bcrypt)
- `timestamps`: createdAt, updatedAt

### Gig

- `title`: String (required)
- `description`: String (required)
- `budget`: Number (required, min: 0)
- `ownerId`: ObjectId (ref: 'users')
- `status`: String (enum: ['OPEN', 'ASSIGNED'], default: 'OPEN')
- `timestamps`: createdAt, updatedAt
- Index: Text search on title and description

### Bid

- `gigId`: ObjectId (ref: 'gigs')
- `freelancerId`: ObjectId (ref: 'users')
- `message`: String (required)
- `price`: Number (required, min: 0)
- `status`: String (enum: ['PENDING', 'HIRED', 'REJECTED'], default: 'PENDING')
- `timestamps`: createdAt, updatedAt
- Unique Index: (gigId, freelancerId) - prevents duplicate bids

## Socket.io Events

### Server Emits

#### `hired`

Emitted to the hired freelancer when they are hired.

```javascript
io.to(freelancerId).emit("hired", {
  message: 'You have been hired for "Project Name"!',
  gig: {
    id: "gig_id",
    title: "Project Name",
    budget: 1000,
  },
  bid: {
    /* full bid object */
  },
});
```

### Client Events

#### `join`

Client joins their personal room for notifications.

```javascript
socket.emit("join", userId);
```

## Security Features

1. **Password Hashing**: bcrypt with salt rounds
2. **JWT Tokens**: Signed tokens with expiration (7 days)
3. **HttpOnly Cookies**: Prevents XSS attacks
4. **CORS**: Configured for specific origins
5. **Input Validation**: Mongoose schema validation
6. **Authorization Checks**: Middleware verifies ownership
7. **Race Condition Prevention**: Atomic operations and transactions

## Dependencies

### Production

- `express`: Web framework
- `mongoose`: MongoDB ODM
- `jsonwebtoken`: JWT token generation
- `bcryptjs`: Password hashing
- `cookie-parser`: Cookie parsing
- `cors`: CORS middleware
- `dotenv`: Environment variables
- `socket.io`: Real-time communication

### Development

- `nodemon`: Auto-reload in development

## Deployment

1. Set environment variables in your hosting platform
2. Ensure MongoDB is accessible (use MongoDB Atlas for cloud)
3. Update `FRONTEND_URL` to your frontend domain
4. Set `NODE_ENV=production`
5. Use a strong `JWT_SECRET` in production

## Notes

- **MongoDB Transactions**: For full transaction support, set up a replica set. The code automatically falls back to atomic operations if transactions aren't available.
- **CORS**: Configured to allow credentials for cookie-based auth
- **Cookie Settings**:
  - `httpOnly: true` (prevents XSS)
  - `secure: true` in production (HTTPS only)
  - `sameSite: 'lax'` (CSRF protection)

## Troubleshooting

### MongoDB Connection Issues

- Check `MONGO_URI` is correct
- Ensure MongoDB is running (if local)
- Check network/firewall settings (if Atlas)

### CORS Errors

- Verify `FRONTEND_URL` matches your frontend URL
- Check that credentials are enabled in frontend requests

### Transaction Errors

- If you see "Transaction numbers are only allowed on a replica set":
  - Set up a MongoDB replica set (see MongoDB docs)
  - Or the code will automatically use atomic operations fallback

---

**Built with Node.js, Express, and MongoDB**
