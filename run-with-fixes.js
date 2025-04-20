const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

console.log("Running app with fixes...");

// Run the fix-all script
try {
    console.log("Running fix-all script...");
    require("./fix-all");
} catch (error) {
    console.error("Error running fix-all script:", error);
}

// Run the fix-rns-screen script separately to ensure it's applied
try {
    console.log("Running fix-rns-screen script...");
    require("./fix-rns-screen");
} catch (error) {
    console.error("Error running fix-rns-screen script:", error);
}

// Run the fix-avatar script separately to ensure it's applied
try {
    console.log("Running fix-avatar script...");
    require("./fix-avatar");
} catch (error) {
    console.error("Error running fix-avatar script:", error);
}

// Update all ActivityIndicator components with size="large" to use numeric values
const updateActivityIndicators = () => {
    const directories = [
        path.join(__dirname, "src", "screens"),
        path.join(__dirname, "src", "components"),
    ];

    const processFile = (filePath) => {
        if (
            !filePath.endsWith(".js") &&
            !filePath.endsWith(".jsx") &&
            !filePath.endsWith(".tsx")
        ) {
            return;
        }

        try {
            let content = fs.readFileSync(filePath, "utf8");

            // Replace size="large" with size={50}
            if (content.includes('size="large"')) {
                console.log(`Updating ActivityIndicator in ${filePath}`);
                content = content.replace(/size="large"/g, "size={50}");
                fs.writeFileSync(filePath, content, "utf8");
            }
        } catch (error) {
            console.error(`Error processing file ${filePath}:`, error);
        }
    };

    const processDirectory = (directory) => {
        try {
            const files = fs.readdirSync(directory);

            for (const file of files) {
                const filePath = path.join(directory, file);
                const stats = fs.statSync(filePath);

                if (stats.isDirectory()) {
                    processDirectory(filePath);
                } else {
                    processFile(filePath);
                }
            }
        } catch (error) {
            console.error(`Error processing directory ${directory}:`, error);
        }
    };

    for (const directory of directories) {
        processDirectory(directory);
    }
};

// Update all ActivityIndicator components
updateActivityIndicators();

console.log("All fixes applied. Starting the app...");

// Start the app
try {
    execSync("npm start", { stdio: "inherit" });
} catch (error) {
    console.error("Error starting the app:", error);
}
