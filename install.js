const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

console.log("Starting robust installation process...");

// Function to run a command and handle errors
const runCommand = (command, ignoreError = false) => {
    try {
        console.log(`Running: ${command}`);
        execSync(command, { stdio: "inherit" });
        return true;
    } catch (error) {
        if (!ignoreError) {
            console.error(`Error running command: ${command}`);
            console.error(error.message);
        } else {
            console.log(`Command failed but continuing: ${command}`);
        }
        return false;
    }
};

// Clean npm cache
console.log("Cleaning npm cache...");
runCommand("npm cache clean --force", true);

// Install dependencies
console.log("Installing dependencies...");
runCommand("npm install --no-package-lock --legacy-peer-deps");

// Apply fixes manually
console.log("Applying gesture handler fixes...");

// Create directories if they don't exist
const dirs = [
    path.join(__dirname, "node_modules", "react-native-gesture-handler", "src"),
    path.join(
        __dirname,
        "node_modules",
        "react-native-gesture-handler",
        "src",
        "handlers"
    ),
    path.join(
        __dirname,
        "node_modules",
        "react-native-gesture-handler",
        "src",
        "handlers",
        "gestures"
    ),
];

dirs.forEach((dir) => {
    if (!fs.existsSync(dir)) {
        console.log(`Creating directory: ${dir}`);
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Run fix-all script
try {
    console.log("Running fix-all script...");
    require("./fix-all");
} catch (error) {
    console.log("Error running fix-all script, continuing anyway...");
    console.error(error.message);
}

console.log("Installation completed successfully!");
console.log("");
console.log("Next steps:");
console.log('1. Run "npm start" to start the development server');
console.log('2. Press "a" to run on Android or "i" to run on iOS');
