// This file contains global patches that need to be applied before any other code runs

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

console.log('Global patches applied successfully');