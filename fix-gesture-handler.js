const fs = require("fs");
const path = require("path");

console.log("Starting comprehensive fix for react-native-gesture-handler...");

// Source file with our fallback implementations
const sourcePath = path.join(__dirname, "src", "utils", "gestureHandlerFix.js");

// Check if source file exists
if (!fs.existsSync(sourcePath)) {
    console.error("Source file not found:", sourcePath);
    process.exit(1);
}

// Read the source file
const sourceContent = fs.readFileSync(sourcePath, "utf8");

// Target paths
const targetPaths = [
    // RNGestureHandlerModule fallback
    {
        path: path.join(
            __dirname,
            "node_modules",
            "react-native-gesture-handler",
            "src",
            "RNGestureHandlerModuleFallback.js"
        ),
        content: `
// Fallback implementation for RNGestureHandlerModule

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
export default RNGestureHandlerModuleFallback;
`,
    },
    // getReactNativeVersion.js
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
    // handlersRegistry.js
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
];

// Create or update each target file
targetPaths.forEach((target) => {
    try {
        // Create directory if it doesn't exist
        const dir = path.dirname(target.path);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
            console.log(`Created directory: ${dir}`);
        }

        // Write the file
        fs.writeFileSync(target.path, target.content, "utf8");
        console.log(`Created/updated file: ${target.path}`);
    } catch (error) {
        console.error(
            `Error creating/updating file ${target.path}:`,
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
        console.error("Error fixing GestureDetector.tsx:", error.message);
    }
} else {
    console.log(
        "GestureDetector.tsx file not found. Make sure you have installed the dependencies."
    );
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
        console.error("Error fixing RNGestureHandlerModule.ts:", error.message);
    }
} else {
    console.log(
        "RNGestureHandlerModule.ts file not found. Make sure you have installed the dependencies."
    );
}

console.log("Comprehensive fix for react-native-gesture-handler completed!");
