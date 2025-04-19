const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// Directories to remove
const dirsToRemove = ["node_modules", ".expo", ".expo-shared"];

// Files to remove
const filesToRemove = [
    "yarn.lock",
    "package-lock.json",
    "yarn-error.log",
    "npm-debug.log",
];

// Clean cache
console.log("Cleaning cache...");
try {
    execSync("expo doctor --fix", { stdio: "inherit" });
    execSync("npm cache clean --force", { stdio: "inherit" });
    execSync("npx expo-cli clean-project-dependencies", { stdio: "inherit" });
} catch (error) {
    console.log("Error cleaning cache, continuing anyway...");
}

// Remove directories
console.log("Removing directories...");
dirsToRemove.forEach((dir) => {
    const dirPath = path.join(__dirname, dir);
    if (fs.existsSync(dirPath)) {
        console.log(`Removing ${dir}...`);
        try {
            if (process.platform === "win32") {
                execSync(`rmdir /s /q "${dirPath}"`, { stdio: "inherit" });
            } else {
                execSync(`rm -rf "${dirPath}"`, { stdio: "inherit" });
            }
        } catch (error) {
            console.error(`Error removing ${dir}:`, error.message);
        }
    }
});

// Remove files
console.log("Removing files...");
filesToRemove.forEach((file) => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
        console.log(`Removing ${file}...`);
        try {
            fs.unlinkSync(filePath);
        } catch (error) {
            console.error(`Error removing ${file}:`, error.message);
        }
    }
});

// Reinstall dependencies
console.log("Reinstalling dependencies...");
try {
    execSync("npm install", { stdio: "inherit" });
} catch (error) {
    console.error("Error reinstalling dependencies:", error.message);
    process.exit(1);
}

// Fix gesture handler issues
console.log("Fixing gesture handler issues...");
try {
    execSync("npm run fix-gesture-handler", { stdio: "inherit" });
} catch (error) {
    console.log("Error fixing gesture handler, continuing anyway...");
    // Try the older fix as a fallback
    try {
        execSync("npm run fix-handlers", { stdio: "inherit" });
    } catch (innerError) {
        console.log("Error fixing handlersRegistry, continuing anyway...");
    }
}

console.log("Clean install completed successfully!");
