# QRSay Admin Mobile App

A React Native Expo mobile application for QRSay restaurant management system. This app provides restaurant owners and staff with a mobile interface to manage orders, dishes, customers, and more.

## Features

-   **Authentication**: Secure login, registration, and password reset
-   **Dashboard**: Overview of restaurant performance and current orders
-   **Order Management**: View, accept, process, and complete orders
-   **Menu Management**: Add, edit, and delete dishes and categories
-   **Waiter Call System**: Manage waiter calls from customers
-   **User Management**: Manage staff accounts and permissions
-   **Restaurant Profile**: Update restaurant information and settings
-   **Real-time Updates**: Get instant notifications for new orders and waiter calls

## Prerequisites

-   Node.js (v14 or later)
-   npm or yarn
-   Expo CLI

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/qrsay-admin-frontend-react-native-expo-app.git
cd qrsay-admin-frontend-react-native-expo-app
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

4. Run on a device or emulator:
    - Scan the QR code with the Expo Go app on your mobile device
    - Press 'a' to run on an Android emulator
    - Press 'i' to run on an iOS simulator (requires macOS)

## Environment Configuration

Create a `.env` file in the root directory with the following variables:

```
API_URL=http://your-backend-url.com/api
SOCKET_URL=http://your-backend-url.com
```

## Project Structure

```
qrsay-admin-frontend-react-native-expo-app/
├── src/
│   ├── assets/           # Images, fonts, and other static files
│   ├── components/       # Reusable UI components
│   ├── constants/        # App constants and theme
│   ├── context/          # React context providers
│   ├── hooks/            # Custom React hooks
│   ├── navigation/       # Navigation configuration
│   ├── screens/          # App screens
│   ├── services/         # API services
│   └── utils/            # Utility functions
├── App.js                # Main app component
├── app.json              # Expo configuration
└── package.json          # Dependencies and scripts
```

## Backend Integration

This app is designed to work with the QRSay backend API. Make sure the backend server is running and accessible from your device or emulator.

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
-   Expo
-   React Native
-   React Navigation
-   React Native Paper
