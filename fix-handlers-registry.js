const fs = require("fs");
const path = require("path");

// Path to the file with the issue
const gestureDetectorPath = path.join(
    __dirname,
    "node_modules",
    "react-native-gesture-handler",
    "src",
    "handlers",
    "gestures",
    "GestureDetector.tsx"
);

// Fix handlersRegistry import
if (fs.existsSync(gestureDetectorPath)) {
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
} else {
    console.log(
        "GestureDetector.tsx file not found. Make sure you have installed the dependencies."
    );
}

// Create getReactNativeVersion.js if it doesn't exist
const getReactNativeVersionPath = path.join(
    __dirname,
    "node_modules",
    "react-native-gesture-handler",
    "src",
    "getReactNativeVersion.js"
);

if (!fs.existsSync(getReactNativeVersionPath)) {
    console.log("Creating getReactNativeVersion.js...");

    const content = `
// This is a fallback implementation for getReactNativeVersion
export function getReactNativeVersion() {
  return { major: 0, minor: 76 };
}
`;

    // Create the directory if it doesn't exist
    const dir = path.dirname(getReactNativeVersionPath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    // Write the file
    fs.writeFileSync(getReactNativeVersionPath, content, "utf8");

    console.log("Created getReactNativeVersion.js successfully!");
}
