// This file is the entry point for the app
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


// Import the patch for react-native-screens
try {
  require('./node_modules/react-native-screens/src/patches/SizeConverter');
  console.log('Applied patch for react-native-screens');
} catch (error) {
  console.log('Error applying patch for react-native-screens:', error);
}


// Patch ActivityIndicator
try {
  // Override the ActivityIndicator component with our patched version
  const ActivityIndicator = require('./src/utils/patches').ActivityIndicator;
  if (global.RN$Bridgeless !== true && global.__fbBatchedBridge && global.__fbBatchedBridge.getCallableModule) {
    const RCTUIManager = global.__fbBatchedBridge.getCallableModule('UIManager');
    if (RCTUIManager) {
      // Monkey patch the RCTUIManager to handle string size values
      const originalCreateView = RCTUIManager.createView;
      if (originalCreateView) {
        RCTUIManager.createView = function(tag, className, rootTag, props) {
          if (className === 'RCTActivityIndicatorView' && props && props.size && typeof props.size === 'string' && props.size !== 'small' && props.size !== 'large') {
            // Convert string size values to valid values
            if (props.size === 'medium') {
              props.size = 'small';
            } else {
              props.size = 'small';
            }
          }
          return originalCreateView.call(this, tag, className, rootTag, props);
        };
      }
    }
  }
  console.log('Applied patch for ActivityIndicator');
} catch (error) {
  console.log('Error applying patch for ActivityIndicator:', error);
}


// Patch RNSScreen
try {
  // Import our patches
  require('./src/utils/patches');
  console.log('Applied patch for RNSScreen');
} catch (error) {
  console.log('Error applying patch for RNSScreen:', error);
}


// Patch Avatar
try {
  // Override the Avatar component with our patched version
  const { Avatar } = require('./src/utils/patches');
  
  // Monkey patch the react-native-elements Avatar component
  const RNElements = require('react-native-elements');
  if (RNElements && RNElements.Avatar) {
    RNElements.Avatar = Avatar;
    console.log('Applied patch for Avatar');
  }
} catch (error) {
  console.log('Error applying patch for Avatar:', error);
}

// Import the real entry point
require('./index.js');