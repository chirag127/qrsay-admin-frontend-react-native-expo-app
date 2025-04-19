// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add custom resolver for problematic modules
config.resolver = {
    ...config.resolver,
    extraNodeModules: {
        ...config.resolver.extraNodeModules,
        // Provide fallbacks for problematic modules
        "../handlersRegistry": path.resolve(
            __dirname,
            "src/utils/gestureHandlerFix.js"
        ),
        "../../getReactNativeVersion": path.resolve(
            __dirname,
            "src/utils/gestureHandlerFix.js"
        ),
    },
};

// Add custom transformer to handle problematic imports
config.transformer = {
    ...config.transformer,
    babelTransformerPath: require.resolve(
        "metro-react-native-babel-transformer"
    ),
};

module.exports = config;
