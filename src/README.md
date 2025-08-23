# Insyd Notification System - Frontend

A React.js frontend application for the Insyd notification system POC, providing real-time notification display and event triggering capabilities.

## Features

- 🔔 Real-time notification display via WebSocket
- 👤 User management (create/select users)
- 🚀 Event triggering interface (like, comment, follow)
- 📱 Responsive design for mobile and desktop
- ⚡ Live connection status indicator
- 🎯 Interactive notification management

## Tech Stack

- **Frontend Framework:** React.js v18
- **Real-time Communication:** Socket.io Client
- **HTTP Client:** Axios
- **Styling:** Custom CSS with modern design
- **Build Tool:** Create React App

## Quick Start

### 1. Installation

```bash
cd insyd-notification-frontend
npm install
```

### 2. Environment Setup

Create a `.env` file in the project root (optional):

```env
REACT_APP_API_URL=http://localhost:5000
```

If not set, it defaults to `http://localhost:5000`.

### 3. Start the Development Server

```bash
npm start
```

The app will start on http://localhost:3000

### 4. Build for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── NotificationList.js    # Displays notifications
│   ├── EventTrigger.js        # Triggers notification events
│   └── UserSelector.js        # User management interface
├── App.js                     # Main application component
├── App.css                    # Application styles
├── index.js                   # Application entry point
├── index.css                  # Global styles
└── reportWebVitals.js         # Performance monitoring
```

## Components Overview

### 1. App.js (Main Component)
- Manages application state
- Handles Socket.io connection
- Coordinates between all child components
- Manages API calls

### 2. UserSelector Component
- Create new users or select existing ones
- Displays current user information
- Quick-start with predefined users
- Auto-selects created users

### 3. EventTrigger Component
- Interface to simulate user interactions
- Support for like, comment, and follow events
- Form validation and error handling
- Real-time feedback on event creation

### 4. NotificationList Component
- Displays notifications in real-time
- Mark notifications as read
- Time formatting (relative time)
- Empty state handling
- Interactive notification items

## Usage Guide

### Getting Started

1. **Create Users**: Start by creating 2-3 users using the "Create New User" feature
2. **Select a User**: Choose a user to view their notifications
3. **Trigger Events**: Use the Event Trigger panel to create interactions
4. **View Notifications**: See real-time notifications appear in the main panel

### Testing the Notification Flow

1. Create users "Alice" and "Bob"
2. Select "Bob" as current user
3. Trigger a "Like" event from Alice to Bob
4. See the notification appear instantly in Bob's notification list
5. Click the notification to mark it as read

### Event Types

- **👍 Like**: Simulate liking someone's post
- **💬 Comment**: Simulate commenting on content
- **👥 Follow**: Simulate following another user

## API Integration

The frontend communicates with the backend through:

### REST API Endpoints
- `GET /api/users` - Fetch all users
- `POST /api/users` - Create new user
- `POST /api/events` - Trigger notification events
- `GET /api/notifications/:userId` - Get user notifications
- `PATCH /api/notifications/:id/read` - Mark notification as read

### WebSocket Events
- **Outgoing**: `identify` - Register user for real-time updates
- **Incoming**: `new_notification` - Receive new notifications

## Key Features Explained

### Real-time Notifications
- Uses Socket.io for instant notification delivery
- Automatic connection management and reconnection
- Visual connection status indicator

### User Experience
- Clean, modern interface design
- Intuitive notification interactions
- Mobile-responsive layout
- Loading states and error handling

### Browser Notifications
- Requests permission for desktop notifications
- Shows system notifications for new alerts
- Graceful fallback if permission denied

## Customization

### Styling
- Modify `src/App.css` for visual changes
- CSS variables for consistent theming
- Responsive design breakpoints included

### Functionality
- Easy to add new event types in `EventTrigger.js`
- Notification display customizable in `NotificationList.js`
- API endpoints configurable via environment variables

## Testing

### Manual Testing Checklist

1. **User Management**:
   - ✅ Create new users
   - ✅ Select different users
   - ✅ Handle duplicate usernames/emails

2. **Event Triggering**:
   - ✅ Like events generate notifications
   - ✅ Comment events work correctly
   - ✅ Follow events create notifications
   - ✅ Form validation prevents invalid submissions

3. **Real-time Features**:
   - ✅ Notifications appear instantly
   - ✅ Connection status updates correctly
   - ✅ Reconnection works after network issues

4. **Notification Management**:
   - ✅ Mark notifications as read
   - ✅ Unread count updates correctly
   - ✅ Clear all notifications works
   - ✅ Time stamps display correctly

## Deployment

### Vercel Deployment (Recommended)

1. **Push to GitHub**:
```bash
git add .
git commit -m "Initial frontend commit"
git push origin main
```

2. **Deploy on Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Set environment variables if needed
   - Deploy automatically

3. **Environment Variables for Production**:
```env
REACT_APP_API_URL=https://your-backend-url.com
```

### Alternative: Netlify
1. Build the project: `npm run build`
2. Upload the `build` folder to Netlify
3. Configure environment variables in Netlify dashboard

## Troubleshooting

### Common Issues

**"Can't connect to backend"**
- Check if backend server is running on port 5000
- Verify REACT_APP_API_URL is correct
- Check CORS settings in backend

**"Notifications not appearing"**
- Ensure WebSocket connection is established (green indicator)
- Check browser console for Socket.io errors
- Verify user is properly identified to socket

**"Events not triggering notifications"**
- Check that target user is different from source user
- Verify backend is processing events correctly
- Check API endpoint responses in Network tab

### Development Tips

- Use browser DevTools to monitor WebSocket connections
- Check Network tab for API call responses
- Console logs are included for debugging WebSocket events
- Use React DevTools for component state inspection

## Future Enhancements

### Planned Features
- User avatars and profiles
- Notification preferences/settings
- Push notifications for offline users
- Notification categories and filtering
- Dark mode theme
- Mobile app using React Native

### Performance Optimizations
- Virtual scrolling for large notification lists
- Notification batching and deduplication
- Lazy loading of user data
- Service worker for offline support

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Architecture Notes

This frontend implements the client-side portion of the notification system architecture:

- **Event Publisher**: User interactions trigger API calls
- **Real-time Delivery**: WebSocket connection for instant notifications  
- **User Interface**: Clean, responsive design for notification consumption
- **State Management**: React hooks for local state management
- **API Integration**: Axios for HTTP requests, Socket.io for real-time

The design prioritizes user experience while maintaining the simplicity required for a POC demonstration.