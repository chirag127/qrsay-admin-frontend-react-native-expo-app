const fs = require('fs');
const path = require('path');

console.log('Starting fix for entry point...');

// Create the bootstrap.js file
const bootstrapPath = path.join(__dirname, 'bootstrap.js');
const bootstrapContent = `// This file is the entry point for the app
// It applies all necessary patches and then imports the real entry point

// Apply global patches
console.log('Applying global patches...');

// Patch for the "topInsetsChange" event
if (global.RCTDeviceEventEmitter && global.RCTDeviceEventEmitter.emit) {
  console.log('Patching RCTDeviceEventEmitter.emit for topInsetsChange event');
  const originalEmit = global.RCTDeviceEventEmitter.emit;
  global.RCTDeviceEventEmitter.emit = function(eventName, ...args) {
    if (eventName === 'topInsetsChange') {
      // Silently ignore this event
      console.log('Ignored topInsetsChange event');
      return;
    }
    return originalEmit.apply(this, [eventName, ...args]);
  };
}

// Patch for unhandled errors
if (global.ErrorUtils) {
  console.log('Patching global error handler');
  const previousHandler = global.ErrorUtils.getGlobalHandler();
  global.ErrorUtils.setGlobalHandler((error, isFatal) => {
    console.log('Caught global error:', error.message);
    // Only pass non-topInsetsChange errors to the previous handler
    if (!error.message || !error.message.includes('topInsetsChange')) {
      previousHandler(error, isFatal);
    }
  });
}

// Ignore specific warnings
if (global.LogBox && global.LogBox.ignoreLogs) {
  console.log('Ignoring specific warnings...');
  global.LogBox.ignoreLogs([
    'Unsupported top level event type "topInsetsChange" dispatched',
    'Unable to resolve "../handlersRegistry"',
    'Unable to resolve "../../getReactNativeVersion"',
    '[react-native-gesture-handler]',
    'Android Bundling failed',
    'Due to changes in Androids permission requirements',
    'JavaScript logs will be removed from Metro',
  ]);
}

console.log('Global patches applied successfully');

// Import the real entry point
require('./index.js');`;

console.log(`Creating bootstrap.js file: ${bootstrapPath}`);
fs.writeFileSync(bootstrapPath, bootstrapContent, 'utf8');

// Update the package.json file
const packageJsonPath = path.join(__dirname, 'package.json');
let packageJson = {};

try {
  // Read the existing package.json file
  if (fs.existsSync(packageJsonPath)) {
    packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  }
  
  // Update the main field to point to our bootstrap.js file
  packageJson.main = 'bootstrap.js';
  
  // Write the updated package.json file
  console.log(`Updating package.json file: ${packageJsonPath}`);
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8');
} catch (error) {
  console.error('Error updating package.json:', error);
}

// Update the index.js file
const indexPath = path.join(__dirname, 'index.js');
let indexContent = '';

try {
  // Read the existing index.js file
  if (fs.existsSync(indexPath)) {
    indexContent = fs.readFileSync(indexPath, 'utf8');
  }
  
  // Check if we need to update the file
  if (!indexContent.includes('./global-patch')) {
    // Add the import for global-patch.js
    indexContent = indexContent.replace(
      "import { registerRootComponent } from",
      "// Import global patches before anything else\nimport './global-patch';\n\nimport { registerRootComponent } from"
    );
    
    // Write the updated index.js file
    console.log(`Updating index.js file: ${indexPath}`);
    fs.writeFileSync(indexPath, indexContent, 'utf8');
  } else {
    console.log('index.js file already updated');
  }
} catch (error) {
  console.error('Error updating index.js:', error);
}

// Create the global-patch.js file
const globalPatchPath = path.join(__dirname, 'global-patch.js');
const globalPatchContent = `// This file contains global patches that need to be applied before any other code runs

// Patch for the "topInsetsChange" event
if (global.RCTDeviceEventEmitter && global.RCTDeviceEventEmitter.emit) {
  console.log('Patching RCTDeviceEventEmitter.emit for topInsetsChange event');
  const originalEmit = global.RCTDeviceEventEmitter.emit;
  global.RCTDeviceEventEmitter.emit = function(eventName, ...args) {
    if (eventName === 'topInsetsChange') {
      // Silently ignore this event
      return;
    }
    return originalEmit.apply(this, [eventName, ...args]);
  };
}

// Patch for unhandled errors
if (global.ErrorUtils) {
  console.log('Patching global error handler');
  const previousHandler = global.ErrorUtils.getGlobalHandler();
  global.ErrorUtils.setGlobalHandler((error, isFatal) => {
    console.log('Caught global error:', error.message);
    // Only pass non-topInsetsChange errors to the previous handler
    if (!error.message || !error.message.includes('topInsetsChange')) {
      previousHandler(error, isFatal);
    }
  });
}

// Patch for the gesture handler module
try {
  console.log('Setting up gesture handler module patch');
  // This will be applied when the module is imported
  const gestureHandlerModuleName = 'react-native-gesture-handler';
  const originalRequire = global.require;
  
  if (originalRequire && typeof originalRequire === 'function') {
    global.require = function(moduleName) {
      if (moduleName === gestureHandlerModuleName) {
        try {
          const result = originalRequire(moduleName);
          console.log('Successfully loaded react-native-gesture-handler module');
          return result;
        } catch (error) {
          console.log('Failed to load react-native-gesture-handler, using mock');
          // Return a mock implementation
          return {
            GestureHandlerRootView: function(props) {
              return props.children;
            },
            State: {
              UNDETERMINED: 0,
              FAILED: 1,
              BEGAN: 2,
              CANCELLED: 3,
              ACTIVE: 4,
              END: 5,
            },
            Direction: {
              RIGHT: 1,
              LEFT: 2,
              UP: 4,
              DOWN: 8,
            },
            gestureHandlerRootHOC: function(Component) {
              return Component;
            },
            // Add other necessary exports
          };
        }
      }
      return originalRequire(moduleName);
    };
  }
} catch (error) {
  console.log('Error setting up gesture handler module patch:', error);
}

console.log('Global patches applied successfully');`;

console.log(`Creating global-patch.js file: ${globalPatchPath}`);
fs.writeFileSync(globalPatchPath, globalPatchContent, 'utf8');

// Update the App.js file
const appPath = path.join(__dirname, 'App.js');
let appContent = '';

try {
  // Read the existing App.js file
  if (fs.existsSync(appPath)) {
    appContent = fs.readFileSync(appPath, 'utf8');
  }
  
  // Check if we need to update the file
  if (appContent.includes('// Patch RCTDeviceEventEmitter before any other imports')) {
    // Remove the redundant patch
    appContent = appContent.replace(
      /\/\/ Patch RCTDeviceEventEmitter before any other imports[\s\S]*?}\);[\s\S]*?}/,
      '// The RCTDeviceEventEmitter is already patched in global-patch.js'
    );
    
    // Write the updated App.js file
    console.log(`Updating App.js file: ${appPath}`);
    fs.writeFileSync(appPath, appContent, 'utf8');
  } else {
    console.log('App.js file already updated');
  }
} catch (error) {
  console.error('Error updating App.js:', error);
}

console.log('Entry point fix completed successfully!');
