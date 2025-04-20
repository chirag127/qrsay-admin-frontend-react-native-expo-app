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

-   Node.js (v18 or later)
-   npm or yarn
-   Expo CLI (v50 or later)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/chirag127/qrsay.git
cd qrsay/qrsay-admin-frontend-react-native-expo-app
```

2. Install dependencies:

```bash
# Use our robust installation script to avoid common issues
npm run install-robust

# On Windows, you can also run the batch file
install.bat

# On macOS/Linux, you can run the shell script (make it executable first)
chmod +x install.sh
./install.sh

# Or use standard installation (may encounter issues)
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

## Troubleshooting

### Gesture Handler Import Errors

If you encounter any of these errors:

-   `Unable to resolve "../handlersRegistry" from "node_modules\react-native-gesture-handler\src\handlers\gestures\GestureDetector.tsx"`
-   `Unable to resolve "../../getReactNativeVersion" from "node_modules\react-native-gesture-handler\src\handlers\gestures\GestureDetector.tsx"`
-   `Android Bundling failed` related to gesture handler imports
-   `TypeError: Cannot read property 'install' of null` in GestureHandlerRootView
-   `[react-native-gesture-handler] react-native-gesture-handler module was not found`
-   `Unsupported top level event type "topInsetsChange" dispatched`

Follow these steps:

1. Use the fix-activity-indicator script to fix the size issue in ActivityIndicator:

    ```bash
    npm run fix-activity-indicator
    ```

    This script patches the ActivityIndicator component to handle string size values.

2. Use the fix-screens-size-issue script to fix the size issue in react-native-screens:

    ```bash
    npm run fix-screens-size-issue
    ```

    This script patches the react-native-screens package to handle string size values.

3. Use the fix-entry-point script to fix the entry point:

    ```bash
    npm run fix-entry-point
    ```

    This script creates a bootstrap.js file that applies all necessary patches before the app starts.

4. Use the fix-naming-conflicts script to fix naming conflicts:

    ```bash
    npm run fix-naming-conflicts
    ```

    This script fixes naming conflicts in the mockGestureHandler.js file.

5. Use the direct patch for react-native-gesture-handler:

    ```bash
    npm run patch-gesture-handler
    ```

    This script directly patches the react-native-gesture-handler module to work without the native module.

6. Or use the fix-all script to apply all fixes at once:

    ```bash
    npm run fix-all
    ```

    This script applies all necessary fixes to the gesture handler and other components, including the direct patch.

7. Or use the robust installation script:

    ```bash
    npm run install-robust
    ```

    This script handles common installation issues and applies all necessary fixes.

8. If that doesn't work, run the comprehensive fix script:

    ```bash
    npm run fix-gesture-handler
    ```

    This script creates fallback implementations for all the missing modules and fixes import paths.

9. If that doesn't work, run the clean install script:

    ```bash
    npm run clean
    ```

10. This will:

    - Remove node_modules and other temporary directories
    - Clean the npm cache
    - Reinstall dependencies
    - Apply patches to fix gesture handler issues
    - Run the comprehensive fix-gesture-handler script
    - Create fallback implementations for all missing modules

11. If the issue persists, try starting with a cleared cache:

    ```bash
    npm run reset
    ```

12. The app includes a custom metro.config.js that provides fallback implementations for problematic modules. If you're still having issues, check that this file is properly configured.

### Other Issues

If you encounter other issues:

1. Make sure you have the latest version of Expo CLI:

    ```bash
    npm install -g expo-cli
    ```

2. Check that your Node.js version is compatible with Expo SDK 52:

    ```bash
    node -v
    ```

    (Node.js 18.x or later is recommended)

3. Try clearing the Metro bundler cache:

    ```bash
    expo start --clear
    ```

4. If all else fails, try a complete project reset:

    ```bash
    npm run reset-project
    ```

    This will perform a more thorough cleanup than the clean script, including:

    - Removing all generated directories (node_modules, .expo, android, ios)
    - Cleaning all caches (npm, Metro bundler, Expo)
    - Reinstalling all dependencies
    - Applying all fixes

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
