# GigFlow Frontend

Modern React frontend for the GigFlow freelance marketplace platform, built with Vite, Redux Toolkit, Tailwind CSS, and Socket.io.

## Quick Start

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env with your backend URL

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Backend API running (see backend README)

## Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:3000
```

For production, set this to your deployed backend URL.

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Auth.jsx              # Login/Register form
│   │   ├── Dashboard.jsx         # Main dashboard with tabs
│   │   ├── GigList.jsx           # Browse and search gigs
│   │   ├── CreateGig.jsx         # Post new gig form
│   │   ├── MyGigs.jsx            # User's posted gigs
│   │   ├── MyBids.jsx           # User's submitted bids
│   │   ├── BidModal.jsx          # Place bid modal
│   │   ├── BidListModal.jsx     # View bids modal (for gig owners)
│   │   ├── Navbar.jsx           # Navigation bar
│   │   └── NotificationToast.jsx # Real-time notification toast
│   ├── store/
│   │   ├── slices/
│   │   │   ├── authSlice.js      # Authentication state
│   │   │   ├── gigSlice.js       # Gig state management
│   │   │   ├── bidSlice.js       # Bid state management
│   │   │   └── notificationSlice.js # Notification state
│   │   └── store.js             # Redux store configuration
│   ├── hooks/
│   │   └── useSocket.js         # Socket.io connection hook
│   ├── App.jsx                   # Root component
│   ├── main.jsx                  # Entry point
│   └── index.css                 # Global styles
├── public/                       # Static assets
└── package.json
```

## Features

### User Interface

- Modern, responsive design with Tailwind CSS
- Clean component architecture
- Real-time notifications
- Toast notifications for user feedback
- Loading states and error handling
- Modal dialogs for actions

### State Management

- Redux Toolkit for global state
- Async thunks for API calls
- Optimistic updates
- Error state management

### Real-time Features

- Socket.io integration
- Instant notifications when hired
- Browser notifications (if permitted)
- Toast notifications

## Components

### Auth.jsx

Login and registration form with:

- Email/password authentication
- Form validation
- Error display
- Toggle between login/register modes

### Dashboard.jsx

Main dashboard with tabbed interface:

- Browse Gigs
- My Posted Gigs
- My Bids
- Post a Gig

### GigList.jsx

Browse and search open gigs:

- Search functionality
- Grid layout of gig cards
- Place bid button (if not owner)
- Gig details (title, description, budget, owner)

### CreateGig.jsx

Form to post new gigs:

- Title input
- Description textarea
- Budget input
- Success feedback

### MyGigs.jsx

View user's posted gigs:

- Status badges (OPEN/ASSIGNED)
- View bids button (for open gigs)
- Gig details

### MyBids.jsx

View user's submitted bids:

- Status indicators (PENDING/HIRED/REJECTED)
- Color-coded status badges
- Gig information
- Bid details (price, message)

### BidModal.jsx

Modal to place a bid:

- Message textarea
- Price input (pre-filled with gig budget)
- Validation
- Error handling

### BidListModal.jsx

Modal for gig owners to view bids:

- List of all bids for a gig
- Freelancer information
- Bid details (price, message)
- Hire button (for pending bids on open gigs)
- Status indicators

### Navbar.jsx

Navigation bar with:

- Logo and branding
- User information
- Notification bell with count
- Logout button

### NotificationToast.jsx

Real-time notification display:

- Toast notification when hired
- Auto-dismiss after 5 seconds
- Gig details
- Dismiss button

## Redux Store

### Auth Slice

- `user`: Current user object
- `loading`: Loading state
- `error`: Error message
- Actions: `register`, `login`, `logout`, `getMe`

### Gig Slice

- `gigs`: Array of open gigs
- `myGigs`: User's posted gigs
- `loading`: Loading state
- `error`: Error message
- Actions: `fetchGigs`, `fetchMyGigs`, `createGig`

### Bid Slice

- `bids`: Bids for current gig (in modal)
- `myBids`: User's submitted bids
- `loading`: Loading state
- `error`: Error message
- Actions: `createBid`, `fetchBidsForGig`, `fetchMyBids`, `hireBid`

### Notification Slice

- `notifications`: Array of notifications
- Actions: `addNotification`, `clearNotifications`

## Socket.io Integration

### useSocket Hook

Automatically connects when user logs in:

- Joins user's personal room
- Listens for "hired" events
- Dispatches notifications to Redux
- Triggers browser notifications

### Real-time Flow

1. User logs in → Socket connects
2. User joins room: `socket.emit("join", userId)`
3. When hired → Backend emits to user's room
4. Frontend receives event → Redux updated
5. Toast notification appears instantly

## Styling

### Tailwind CSS

- Utility-first CSS framework
- Responsive design
- Custom color scheme
- Consistent spacing and typography

### Design System

- Primary color: Blue (#2563eb)
- Success: Green
- Warning: Yellow
- Error: Red
- Modern card-based layouts
- Smooth transitions and hover effects

## Responsive Design

- Mobile-first approach
- Breakpoints: sm, md, lg, xl
- Grid layouts adapt to screen size
- Touch-friendly buttons and interactions

## Build & Deploy

### Development

```bash
npm run dev
```

Starts Vite dev server with HMR at http://localhost:5173

## Error Handling

- API errors displayed in UI
- Network errors handled gracefully
- Loading states for async operations
- Form validation errors
- User-friendly error messages

## Dependencies

### Production

- `react`: UI library
- `react-dom`: DOM rendering
- `react-redux`: Redux bindings
- `@reduxjs/toolkit`: Redux utilities
- `axios`: HTTP client
- `socket.io-client`: Real-time communication
- `tailwindcss`: CSS framework
- `lucide-react`: Icon library

### Development

- `vite`: Build tool
- `@vitejs/plugin-react`: React plugin
- `eslint`: Linting

## Testing

### Manual Testing Checklist

- [ ] User registration
- [ ] User login
- [ ] Browse gigs
- [ ] Search gigs
- [ ] Create gig
- [ ] Place bid
- [ ] View bids (as owner)
- [ ] Hire freelancer
- [ ] Receive real-time notification
- [ ] View my gigs
- [ ] View my bids
- [ ] Logout

## Security

- JWT tokens in HttpOnly cookies (handled by backend)
- Credentials included in API requests
- CORS configured for specific origins
- Input validation on forms
- XSS protection via React

## Notes

- **State Persistence**: User state persists on page reload via `getMe` API call
- **Real-time Updates**: Socket.io automatically reconnects on disconnect
- **Notifications**: Browser notifications require user permission
- **Error Messages**: All errors are user-friendly and actionable

## Best Practices

1. **Component Structure**: Functional components with hooks
2. **State Management**: Redux for global state, local state for UI
3. **API Calls**: Async thunks in Redux slices
4. **Styling**: Tailwind utility classes
5. **Error Handling**: Try-catch blocks with user feedback
6. **Loading States**: Show spinners during async operations

## Troubleshooting

### CORS Errors

- Ensure backend `FRONTEND_URL` matches frontend URL
- Check that credentials are enabled

### Socket Connection Issues

- Verify backend is running
- Check `VITE_API_URL` is correct
- Ensure user is logged in

### Build Errors

- Clear `node_modules` and reinstall
- Check Node.js version (v18+)
- Verify all dependencies are installed

---

**Built with React, Vite, and Tailwind CSS**
