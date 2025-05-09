# Caboodle - Your Personal Collection Management App

![Caboodle Logo](assets/logo-png.png)

## Overview

Caboodle is a modern, feature-rich mobile application built with React Native and Firebase that helps users manage their personal collections, catalogs, and items. Whether you're a collector, organizer, or just someone who wants to keep track of their belongings, Caboodle provides an intuitive and powerful platform to manage your items.

## Features

### Collection Management
- Create and manage multiple catalogs
- Add items with detailed descriptions and values
- Custom attributes for each item
- Image support for items and catalogs
- Public/Private catalog options

### Social Features
- Share your collections with others
- Global chat functionality
- Private messaging system
- User profiles with customizable settings

### User Experience
- Modern and intuitive UI
- Cross-platform support (iOS & Android)
- Real-time updates
- Secure authentication
- Offline support

## Tech Stack

- **Frontend**: React Native, Expo
- **Backend**: Firebase
- **Database**: Firestore
- **Storage**: Firebase Storage
- **Authentication**: Firebase Auth
- **State Management**: React Hooks
- **UI Components**: React Native Paper

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- Firebase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/CooperA02/Caboodle.git
cd caboodle
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Configure Firebase:
   - Create a new Firebase project
   - Enable Authentication, Firestore, and Storage
   - Add your Firebase configuration to `firebaseConfig.js`

4. Start the development server:
```bash
npm start
# or
yarn start
```

5. Run on your preferred platform:
```bash
# For iOS
npm run ios
# For Android
npm run android
# For Web
npm run web
```

## Project Structure

```
caboodle/
├── assets/           # Static assets and images
├── Components/       # Reusable React components
├── Screens/         # Screen components
├── firebaseConfig.js # Firebase configuration
├── App.js           # Main application component
└── package.json     # Project dependencies
```

## Features in Detail

### Catalog Management
- Create and organize multiple catalogs
- Add custom categories and descriptions
- Set privacy settings for each catalog
- Upload and manage catalog images

### Item Management
- Add items with detailed information
- Custom attributes for each item
- Value tracking and description
- Multiple image support
- Public/Private item settings

### Social Features
- Global chat room for all users
- Private messaging between users
- User profiles with customizable settings
- Share collections with other users

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- React Native community
- Firebase team
- Expo team
- All contributors and users of Caboodle
- Caboodle Dev Team - Brett Ross, Cooper Armstrong, Tyler Galea, and Desmond Readwin
