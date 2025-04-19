# QRSay Admin Mobile App

A React Native Expo mobile application for QRSay restaurant management system. This app provides restaurant owners and staff with a mobile interface to manage orders, dishes, tables, and other restaurant operations.

## Features

-   **Authentication**: Secure login and user management
-   **Dashboard**: Overview of restaurant status, orders, and waiter calls
-   **Order Management**: View, accept, and manage customer orders
-   **Menu Management**: Add, edit, and manage dishes, categories, and options
-   **Restaurant Profile**: Manage restaurant details, gallery, and settings
-   **Table Management**: Manage restaurant tables and rooms
-   **Waiter Call System**: Receive and respond to customer waiter calls
-   **User Management**: Manage staff accounts and permissions
-   **Customer Management**: View customer information and order history

## Technologies Used

-   React Native
-   Expo
-   React Navigation
-   Socket.io for real-time communication
-   Axios for API requests
-   AsyncStorage for local storage
-   React Native Elements for UI components

## Getting Started

### Prerequisites

-   Node.js (v14 or later)
-   npm or yarn
-   Expo CLI

### Installation

1. Clone the repository:

```bash
git clone https://github.com/chirag127/qrsay.git
cd qrsay/qrsay-admin-frontend-react-native-expo-app
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Start the development server:

```bash
npm start
# or
yarn start
```

4. Open the app on your device using the Expo Go app or run on an emulator.

## Environment Configuration

The app uses different environment configurations for development, staging, and production. You can modify these settings in `src/config/environment.js`.

## Project Structure

```
qrsay-admin-frontend-react-native-expo-app/
├── assets/                  # Static assets like images and fonts
├── src/
│   ├── components/          # Reusable UI components
│   ├── config/              # Configuration files
│   ├── context/             # React context providers
│   ├── hooks/               # Custom React hooks
│   ├── navigation/          # Navigation configuration
│   ├── screens/             # Screen components
│   ├── services/            # API services
│   └── utils/               # Utility functions
├── App.js                   # Main app component
├── app.json                 # Expo configuration
├── babel.config.js          # Babel configuration
└── package.json             # Project dependencies
```

## Backend API

This app connects to the QRSay backend API. Make sure the backend server is running and accessible.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

-   QRSay Team
-   All contributors to the project
