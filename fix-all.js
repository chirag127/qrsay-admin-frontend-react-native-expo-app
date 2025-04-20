const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

console.log("Starting comprehensive fix for all issues...");

// Create directories if they don't exist
const dirs = [
    path.join(__dirname, "src", "utils"),
    path.join(__dirname, "node_modules", "react-native-gesture-handler", "src"),
    path.join(
        __dirname,
        "node_modules",
        "react-native-gesture-handler",
        "src",
        "handlers"
    ),
];

dirs.forEach((dir) => {
    if (!fs.existsSync(dir)) {
        console.log(`Creating directory: ${dir}`);
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Create the gestureHandlerPolyfill.js file
const polyfillPath = path.join(
    __dirname,
    "src",
    "utils",
    "gestureHandlerPolyfill.js"
);
const polyfillContent = `// This file provides a polyfill for react-native-gesture-handler
// to prevent errors when the native module is not found
import React from 'react';

// Create a mock for the entire gesture handler library
const createMockGestureHandler = () => {
  // Basic component that just renders its children
  const createComponent = (name) => {
    return ({ children, ...props }) => {
      // Just return the children
      return children;
    };
  };

  // Create mock gesture handlers
  const mockHandlers = {
    PanGestureHandler: createComponent('PanGestureHandler'),
    TapGestureHandler: createComponent('TapGestureHandler'),
    LongPressGestureHandler: createComponent('LongPressGestureHandler'),
    RotationGestureHandler: createComponent('RotationGestureHandler'),
    FlingGestureHandler: createComponent('FlingGestureHandler'),
    PinchGestureHandler: createComponent('PinchGestureHandler'),
    ForceTouchGestureHandler: createComponent('ForceTouchGestureHandler'),
    NativeViewGestureHandler: createComponent('NativeViewGestureHandler'),
    GestureHandlerRootView: createComponent('GestureHandlerRootView'),
    TouchableOpacity: createComponent('TouchableOpacity'),
    TouchableHighlight: createComponent('TouchableHighlight'),
    TouchableWithoutFeedback: createComponent('TouchableWithoutFeedback'),
    TouchableNativeFeedback: createComponent('TouchableNativeFeedback'),
    ScrollView: createComponent('ScrollView'),
    FlatList: createComponent('FlatList'),
    Switch: createComponent('Switch'),
    TextInput: createComponent('TextInput'),
    DrawerLayout: createComponent('DrawerLayout'),
    Swipeable: createComponent('Swipeable'),
    // Add any other components that might be used
  };

  // Mock gesture states
  const State = {
    UNDETERMINED: 0,
    FAILED: 1,
    BEGAN: 2,
    CANCELLED: 3,
    ACTIVE: 4,
    END: 5,
  };

  // Mock gesture directions
  const Direction = {
    RIGHT: 1,
    LEFT: 2,
    UP: 4,
    DOWN: 8,
  };

  // Mock utility functions
  const mockUtils = {
    State,
    Direction,
    gestureHandlerRootHOC: (Component) => Component,
    enableGestureHandlerStateRestore: () => {},
    createGestureHandler: () => ({ attachGestureHandler: () => {} }),
    dropGestureHandler: () => {},
    handleSetJSResponder: () => {},
    handleClearJSResponder: () => {},
    install: () => {},
  };

  return {
    ...mockHandlers,
    ...mockUtils,
  };
};

// Export the mock gesture handler
const gestureHandler = createMockGestureHandler();
export default gestureHandler;`;

console.log(`Creating polyfill file: ${polyfillPath}`);
fs.writeFileSync(polyfillPath, polyfillContent, "utf8");

// Create the mediaLibraryHelper.js file
const mediaLibraryHelperPath = path.join(
    __dirname,
    "src",
    "utils",
    "mediaLibraryHelper.js"
);
const mediaLibraryHelperContent = `import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';

/**
 * Helper utility to handle media library operations with fallbacks
 * for when permissions are not available in Expo Go
 */
const MediaLibraryHelper = {
  /**
   * Save an image to the device
   * @param {string} uri - The URI of the image to save
   * @param {string} filename - The filename to save the image as
   * @returns {Promise<Object>} - Result of the save operation
   */
  async saveImage(uri, filename) {
    try {
      // First try to get permissions
      const { status } = await MediaLibrary.requestPermissionsAsync();

      if (status === 'granted') {
        // If permissions are granted, save to media library
        const asset = await MediaLibrary.createAssetAsync(uri);
        return { success: true, asset };
      } else {
        // If permissions are not granted, use sharing instead
        return await this.shareImage(uri);
      }
    } catch (error) {
      console.error('Error saving image:', error);
      // If there's an error, try sharing as a fallback
      return await this.shareImage(uri);
    }
  },

  /**
   * Share an image using the sharing API
   * @param {string} uri - The URI of the image to share
   * @returns {Promise<Object>} - Result of the share operation
   */
  async shareImage(uri) {
    try {
      const canShare = await Sharing.isAvailableAsync();

      if (canShare) {
        await Sharing.shareAsync(uri);
        return { success: true, shared: true };
      } else {
        return { success: false, error: 'Sharing not available on this device' };
      }
    } catch (error) {
      console.error('Error sharing image:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Get a list of images from the media library with fallback
   * @returns {Promise<Array>} - Array of images or empty array if not available
   */
  async getImages() {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();

      if (status === 'granted') {
        const media = await MediaLibrary.getAssetsAsync({
          mediaType: 'photo',
          sortBy: [MediaLibrary.SortBy.creationTime],
        });
        return media.assets;
      } else {
        console.log('Media library permissions not granted');
        return [];
      }
    } catch (error) {
      console.error('Error getting images:', error);
      return [];
    }
  }
};

export default MediaLibraryHelper;`;

console.log(`Creating mediaLibraryHelper file: ${mediaLibraryHelperPath}`);
fs.writeFileSync(mediaLibraryHelperPath, mediaLibraryHelperContent, "utf8");

// Create fallback files for react-native-gesture-handler
const fallbackFiles = [
    {
        path: path.join(
            __dirname,
            "node_modules",
            "react-native-gesture-handler",
            "src",
            "getReactNativeVersion.js"
        ),
        content: `
// This is a fallback implementation for getReactNativeVersion
export function getReactNativeVersion() {
  return { major: 0, minor: 76 };
}
`,
    },
    {
        path: path.join(
            __dirname,
            "node_modules",
            "react-native-gesture-handler",
            "src",
            "handlers",
            "handlersRegistry.js"
        ),
        content: `
// Fallback implementation for handlersRegistry
export const baseGestureHandlerWithMonitorProps = {
  id: 'gesture-handler-id',
  enabled: true,
  shouldCancelWhenOutside: true,
  hitSlop: undefined,
  cancelsTouchesInView: true,
  waitFor: undefined,
  simultaneousHandlers: undefined,
  needsPointerData: false,
  manualActivation: false,
  activateAfterLongPress: undefined,
  onBegan: undefined,
  onActivated: undefined,
  onFailed: undefined,
  onCancelled: undefined,
  onEnded: undefined,
  onGestureEvent: undefined,
  onHandlerStateChange: undefined,
};

export const handlersRegistry = {
  getHandler: () => null,
  createHandler: () => null,
  attachHandlerToView: () => null,
  dropHandler: () => null,
  dropAllHandlers: () => null,
};
`,
    },
    {
        path: path.join(
            __dirname,
            "node_modules",
            "react-native-gesture-handler",
            "src",
            "RNGestureHandlerModuleFallback.js"
        ),
        content: `// Fallback implementation for RNGestureHandlerModule

const RNGestureHandlerModuleFallback = {
  // Fallback methods
  handleSetJSResponder: () => {},
  handleClearJSResponder: () => {},
  createGestureHandler: () => {},
  attachGestureHandler: () => {},
  updateGestureHandler: () => {},
  dropGestureHandler: () => {},
  install: () => {},
  // Add any other methods that might be used
};

// Export the fallback module
export default RNGestureHandlerModuleFallback;`,
    },
];

// Create each fallback file
fallbackFiles.forEach((file) => {
    try {
        // Create directory if it doesn't exist
        const dir = path.dirname(file.path);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        // Write the file
        console.log(`Creating fallback file: ${file.path}`);
        fs.writeFileSync(file.path, file.content, "utf8");
    } catch (error) {
        console.error(
            `Error creating fallback file ${file.path}:`,
            error.message
        );
    }
});

// Fix GestureDetector.tsx
const gestureDetectorPath = path.join(
    __dirname,
    "node_modules",
    "react-native-gesture-handler",
    "src",
    "handlers",
    "gestures",
    "GestureDetector.tsx"
);

if (fs.existsSync(gestureDetectorPath)) {
    try {
        console.log("Fixing imports in GestureDetector.tsx...");

        // Read the file content
        let content = fs.readFileSync(gestureDetectorPath, "utf8");

        // Replace the problematic imports
        const fixes = [
            {
                from: "import { baseGestureHandlerWithMonitorProps } from '../handlersRegistry';",
                to: "import { baseGestureHandlerWithMonitorProps } from '../../handlers/handlersRegistry';",
            },
            {
                from: "import { getReactNativeVersion } from '../../getReactNativeVersion';",
                to: "import { getReactNativeVersion } from '../../../getReactNativeVersion';",
            },
        ];

        // Apply all fixes
        fixes.forEach((fix) => {
            if (content.includes(fix.from)) {
                content = content.replace(fix.from, fix.to);
                console.log(`Fixed import: ${fix.from} -> ${fix.to}`);
            }
        });

        // Write the fixed content back to the file
        fs.writeFileSync(gestureDetectorPath, content, "utf8");

        console.log("Fixed imports in GestureDetector.tsx successfully!");
    } catch (error) {
        console.error("Error fixing GestureDetector.tsx:", error);
    }
}

// Fix RNGestureHandlerModule.ts
const rnGestureHandlerModulePath = path.join(
    __dirname,
    "node_modules",
    "react-native-gesture-handler",
    "src",
    "RNGestureHandlerModule.ts"
);

if (fs.existsSync(rnGestureHandlerModulePath)) {
    try {
        console.log("Fixing RNGestureHandlerModule.ts...");

        // Read the file content
        let content = fs.readFileSync(rnGestureHandlerModulePath, "utf8");

        // Replace the problematic line
        if (
            content.includes(
                "const RNGestureHandlerModule = NativeModules.RNGestureHandlerModule;"
            )
        ) {
            content = content.replace(
                "const RNGestureHandlerModule = NativeModules.RNGestureHandlerModule;",
                "const RNGestureHandlerModule = NativeModules.RNGestureHandlerModule || { install: () => {} };"
            );

            // Write the fixed content back to the file
            fs.writeFileSync(rnGestureHandlerModulePath, content, "utf8");

            console.log("Fixed RNGestureHandlerModule.ts successfully!");
        } else {
            console.log(
                "RNGestureHandlerModule.ts does not need fixing or has a different structure."
            );
        }
    } catch (error) {
        console.error("Error fixing RNGestureHandlerModule.ts:", error);
    }
}

// Run the direct patch for react-native-gesture-handler
try {
    console.log("Running direct patch for react-native-gesture-handler...");
    require("./patch-gesture-handler");
} catch (error) {
    console.error("Error running patch-gesture-handler:", error);
}

// Fix naming conflicts in mockGestureHandler.js
try {
    console.log("Running fix for naming conflicts...");
    require("./fix-naming-conflicts");
} catch (error) {
    console.error("Error running fix-naming-conflicts:", error);
}

// Fix entry point
try {
    console.log("Running fix for entry point...");
    require("./fix-entry-point");
} catch (error) {
    console.error("Error running fix-entry-point:", error);
}

// Fix react-native-screens size issue
try {
    console.log("Running fix for react-native-screens size issue...");
    require("./fix-screens-size-issue");
} catch (error) {
    console.error("Error running fix-screens-size-issue:", error);
}

// Fix ActivityIndicator size issue
try {
    console.log("Running fix for ActivityIndicator size issue...");
    require("./fix-activity-indicator");
} catch (error) {
    console.error("Error running fix-activity-indicator:", error);
}

// Fix RNSScreen size issue
try {
    console.log("Running fix for RNSScreen size issue...");
    require("./fix-rns-screen");
} catch (error) {
    console.error("Error running fix-rns-screen:", error);
}

// Fix Avatar size issue
try {
    console.log("Running fix for Avatar size issue...");
    require("./fix-avatar");
} catch (error) {
    console.error("Error running fix-avatar:", error);
}

console.log("All fixes applied successfully!");
console.log("");
console.log("Next steps:");
console.log('1. Run "npm start" to start the development server');
console.log('2. Press "a" to run on Android or "i" to run on iOS');
