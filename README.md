# AI Crop Documentation System

## Agricultural Analytics Platform for Crop Prediction & Management

### Features
- Real-time crop health monitoring
- AI-powered yield prediction models
- Historical data analysis
- Firebase-backed user authentication
- Cross-platform mobile support (iOS/Android)

## Getting Started

### Prerequisites
- Node.js 16+ 
- Expo CLI (`npm install -g expo-cli`)
- Firebase account

### Installation
```bash
cd ai-crop-doc
npm install
```

## Firebase Configuration
1. Create project at [Firebase Console](https://console.firebase.google.com)
2. Enable Authentication, Firestore, and Storage
3. Update config in `src/services/firebase.js`:
```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};
```

## Running the Application
```bash
npm start
```

## Contributing
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License
Distributed under MIT License.