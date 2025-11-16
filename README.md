# Primavera Events - Senior-Friendly Mobile App

A React Native mobile application built with Expo for community event management in Braga, Portugal. The app connects elderly users with local events organized by community organizations, with a focus on accessibility and ease of use for older adults.

## 🎯 Project Overview

This application provides a simplified, senior-friendly interface for:

- Browsing community events
- Marking interest in events
- Viewing personalized event lists
- Managing user profiles

### Key Features

✨ **Senior-Friendly Design**

- Large text (minimum 18px body, 24px+ headers)
- High contrast colors (WCAG AAA compliance - 7:1 ratio)
- Big touch targets (minimum 48x48dp)
- Simple, linear navigation
- Haptic feedback for all interactions

📱 **Core Functionality**

- Event browsing with filters
- Interest marking/unmarking
- Personal event tracking
- User profile management

## 🚀 Getting Started

> **Complete Setup Instructions**: For detailed setup instructions for both the backend and mobile app, see [`SETUP.md`](../PI_Primavera/SETUP.md) in the backend folder.

### Quick Start

1. **Start the backend API** (in a separate terminal):

   ```bash
   cd ../PI_Primavera
   docker compose up
   ```

2. **Install dependencies** (first time only):

   ```bash
   npm install
   ```

3. **Start the Expo development server**:

   ```bash
   npm start
   ```

4. **Run on device/emulator**:
   - Press `i` for iOS Simulator
   - Press `a` for Android Emulator
   - Scan QR code with Expo Go app on physical device

## 📱 App Structure

```
PI_Primavera_Frontend/
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx          # Events List (Home)
│   │   ├── my-events.tsx      # User's interested events
│   │   └── profile.tsx        # User profile
│   └── event/
│       └── [id].tsx           # Event details page
├── components/
│   └── ui/
│       ├── large-button.tsx   # Accessible button component
│       ├── event-card.tsx     # Event display card
│       ├── card.tsx           # Generic card container
│       ├── loading-spinner.tsx
│       └── empty-state.tsx
├── services/
│   └── api.ts                 # API service layer
├── store/
│   ├── userStore.ts           # User state management
│   └── appStore.ts            # App-wide state
├── utils/
│   └── dateUtils.ts           # Date formatting utilities
├── types/
│   └── index.ts               # TypeScript interfaces
└── constants/
    └── theme.ts               # Design tokens
```

## 🎨 Design System

### Colors

- **Primary**: `#2196F3` (Clear blue)
- **Secondary**: `#4CAF50` (Green for positive actions)
- **Background**: `#FFFFFF` (Pure white)
- **Text**: `#000000` (Pure black for maximum contrast)
- **Error**: `#D32F2F` (Clear red)

### Typography

- **H1**: 32px, bold
- **H2**: 28px, bold
- **H3**: 24px, semibold
- **Body**: 18px, regular
- **Body Large**: 20px, regular
- **Button**: 20px, bold

### Spacing

- XS: 8px
- SM: 16px
- MD: 24px
- LG: 32px
- XL: 48px

## 🔌 API Integration

The app connects to a Flask backend API. Key endpoints:

### Events

- `GET /events` - List all events (filters: name, date)
- `POST /event/{id}/interest` - Mark interest
- `DELETE /event/{id}/interest` - Remove interest

### Users

- `POST /user` - Create user
- `GET /users` - List users

### Locations

- `GET /districts` - Get districts
- `GET /municipalities` - Get municipalities
- `GET /parishes` - Get parishes

See `API_DOCUMENTATION.md` in the backend folder for full API details.

## 📦 Key Dependencies

- **expo**: ~54.0.23 - React Native framework
- **react-navigation**: ^7.1.8 - Navigation
- **axios**: Latest - API calls
- **zustand**: Latest - State management
- **date-fns**: Latest - Date utilities
- **@react-native-async-storage/async-storage**: Latest - Local storage

## 🔧 Development

### Project Scripts

```bash
npm start          # Start Expo dev server
npm run android    # Run on Android
npm run ios        # Run on iOS
npm run web        # Run in web browser
npm run lint       # Run ESLint
```

### State Management

The app uses Zustand for state management:

- **userStore**: Current user, interested events
- **appStore**: App-wide state (events list, loading, errors)

### Navigation

Uses Expo Router with file-based routing:

- Bottom tabs: Events, My Events, Profile
- Modal/push navigation for event details

## 🎯 Accessibility Features

- ✅ Screen reader compatible
- ✅ Large touch targets (48x48dp minimum)
- ✅ High contrast colors (WCAG AAA)
- ✅ Haptic feedback
- ✅ Large, readable text
- ✅ Simple navigation patterns
- ✅ Clear visual hierarchy

## 🐛 Troubleshooting

### API Connection Issues

- Ensure backend is running: `docker-compose up`
- Check API URL in `.env` matches backend
- For physical device: Use computer's IP instead of localhost

### Build Errors

```bash
# Clear cache and reinstall
rm -rf node_modules
npm install
npx expo start -c
```

### AsyncStorage Errors

```bash
# Reinstall AsyncStorage
npm install @react-native-async-storage/async-storage
npx expo prebuild --clean
```

## 📝 TODO / Future Enhancements

- [ ] Complete user registration flow
- [ ] Add profile editing
- [ ] Implement search functionality
- [ ] Add event filtering by location
- [ ] Push notifications for events
- [ ] Offline support
- [ ] Event calendar view
- [ ] Social sharing features
- [ ] Organization management (for org admins)

## 🤝 Contributing

This is an academic project for University of Minho.

## 📄 License

See LICENSE file for details.

## 👥 Team

Integrated Project - University of Minho
Department of Informatics
2024/2025
