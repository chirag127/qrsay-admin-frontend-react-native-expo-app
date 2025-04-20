const fs = require("fs");
const path = require("path");

console.log("Starting fix for naming conflicts...");

// Fix the mockGestureHandler.js file
const mockGestureHandlerPath = path.join(
    __dirname,
    "src",
    "utils",
    "mockGestureHandler.js"
);

if (fs.existsSync(mockGestureHandlerPath)) {
    try {
        console.log(`Fixing naming conflicts in: ${mockGestureHandlerPath}`);

        // Read the file content
        let content = fs.readFileSync(mockGestureHandlerPath, "utf8");

        // Replace the import
        content = content.replace(
            "import { View, ScrollView, FlatList, TextInput, TouchableOpacity } from 'react-native';",
            "import { View, ScrollView as RNScrollView, FlatList as RNFlatList, TextInput as RNTextInput, TouchableOpacity as RNTouchableOpacity } from 'react-native';"
        );

        // Replace the component usage in the createMockComponent function
        const usageReplacements = [
            [
                "return <TouchableOpacity {...props}>{children}</TouchableOpacity>;",
                "return <RNTouchableOpacity {...props}>{children}</RNTouchableOpacity>;",
            ],
            [
                "return <ScrollView {...props}>{children}</ScrollView>;",
                "return <RNScrollView {...props}>{children}</RNScrollView>;",
            ],
            [
                "return <FlatList {...props} />;",
                "return <RNFlatList {...props} />;",
            ],
            [
                "return <TextInput {...props} />;",
                "return <RNTextInput {...props} />;",
            ],
        ];

        // Apply all usage replacements
        usageReplacements.forEach(([oldStr, newStr]) => {
            if (content.includes(oldStr)) {
                content = content.replace(oldStr, newStr);
            }
        });

        // Replace the component names to avoid conflicts
        const componentReplacements = [
            [
                "export const TouchableOpacity = createMockComponent('TouchableOpacity');",
                "export const TouchableOpacity = createMockComponent('GHTouchableOpacity');",
            ],
            [
                "export const TouchableHighlight = createMockComponent('TouchableHighlight');",
                "export const TouchableHighlight = createMockComponent('GHTouchableHighlight');",
            ],
            [
                "export const TouchableWithoutFeedback = createMockComponent('TouchableWithoutFeedback');",
                "export const TouchableWithoutFeedback = createMockComponent('GHTouchableWithoutFeedback');",
            ],
            [
                "export const TouchableNativeFeedback = createMockComponent('TouchableNativeFeedback');",
                "export const TouchableNativeFeedback = createMockComponent('GHTouchableNativeFeedback');",
            ],
            [
                "export const ScrollView = createMockComponent('ScrollView');",
                "export const ScrollView = createMockComponent('GHScrollView');",
            ],
            [
                "export const FlatList = createMockComponent('FlatList');",
                "export const FlatList = createMockComponent('GHFlatList');",
            ],
            [
                "export const Switch = createMockComponent('Switch');",
                "export const Switch = createMockComponent('GHSwitch');",
            ],
            [
                "export const TextInput = createMockComponent('TextInput');",
                "export const TextInput = createMockComponent('GHTextInput');",
            ],
        ];

        // Apply all replacements
        componentReplacements.forEach(([oldStr, newStr]) => {
            content = content.replace(oldStr, newStr);
        });

        // Write the fixed content back to the file
        fs.writeFileSync(mockGestureHandlerPath, content, "utf8");

        console.log(
            `Successfully fixed naming conflicts in: ${mockGestureHandlerPath}`
        );
    } catch (error) {
        console.error(
            `Error fixing naming conflicts in ${mockGestureHandlerPath}:`,
            error
        );
    }
} else {
    console.log(`File not found: ${mockGestureHandlerPath}`);
}

console.log("Naming conflicts fix completed!");
