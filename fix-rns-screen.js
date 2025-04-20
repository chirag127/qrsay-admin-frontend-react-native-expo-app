const fs = require('fs');
const path = require('path');

console.log('Starting fix for RNSScreen size issue...');

// Create a direct patch for the RNSScreen component
const createDirectPatch = () => {
  try {
    // Path to create the patch file
    const patchDir = path.join(__dirname, 'src', 'utils', 'patches');
    const patchPath = path.join(patchDir, 'RNSScreenPatch.js');
    
    // Create the directory if it doesn't exist
    if (!fs.existsSync(patchDir)) {
      fs.mkdirSync(patchDir, { recursive: true });
    }
    
    // Create the patch file
    const patchContent = `
// This file provides a direct patch for the RNSScreen component
import React from 'react';
import { NativeModules } from 'react-native';

// Monkey patch the RNSScreen component
if (NativeModules.RNSScreenManager) {
  console.log('Applying patch for RNSScreen component...');
  
  // Store the original createScreen method
  const originalCreateScreen = NativeModules.RNSScreenManager.createScreen;
  
  // Override the createScreen method to handle string size values
  NativeModules.RNSScreenManager.createScreen = function(tag, options) {
    // Convert string size values to numbers
    if (options && options.size && typeof options.size === 'string') {
      if (options.size === 'small') {
        options.size = 34;
      } else if (options.size === 'medium') {
        options.size = 50;
      } else if (options.size === 'large') {
        options.size = 75;
      } else if (options.size === 'xlarge') {
        options.size = 150;
      } else {
        // Try to parse the string as a number
        const parsed = parseFloat(options.size);
        if (!isNaN(parsed)) {
          options.size = parsed;
        } else {
          // Use a default value
          options.size = 75;
        }
      }
    }
    
    // Call the original method with the modified options
    return originalCreateScreen.call(this, tag, options);
  };
  
  console.log('Successfully applied patch for RNSScreen component');
}

// Monkey patch the UIManager to handle string size values
if (global.RN$Bridgeless !== true && global.__fbBatchedBridge && global.__fbBatchedBridge.getCallableModule) {
  const RCTUIManager = global.__fbBatchedBridge.getCallableModule('UIManager');
  if (RCTUIManager) {
    console.log('Applying patch for UIManager...');
    
    // Store the original createView method
    const originalCreateView = RCTUIManager.createView;
    
    // Override the createView method to handle string size values
    RCTUIManager.createView = function(tag, className, rootTag, props) {
      // Handle RNSScreen components
      if (className === 'RNSScreen' && props && props.size && typeof props.size === 'string') {
        if (props.size === 'small') {
          props.size = 34;
        } else if (props.size === 'medium') {
          props.size = 50;
        } else if (props.size === 'large') {
          props.size = 75;
        } else if (props.size === 'xlarge') {
          props.size = 150;
        } else {
          // Try to parse the string as a number
          const parsed = parseFloat(props.size);
          if (!isNaN(parsed)) {
            props.size = parsed;
          } else {
            // Use a default value
            props.size = 75;
          }
        }
      }
      
      // Call the original method with the modified props
      return originalCreateView.call(this, tag, className, rootTag, props);
    };
    
    console.log('Successfully applied patch for UIManager');
  }
}
`;
    
    console.log(`Creating patch file: ${patchPath}`);
    fs.writeFileSync(patchPath, patchContent, 'utf8');
    console.log(`Successfully created patch file: ${patchPath}`);
    
    return true;
  } catch (error) {
    console.error('Error creating RNSScreen patch:', error);
  }
  
  return false;
};

// Update the index.js file to export our patched RNSScreen
const updateIndexFile = () => {
  try {
    // Path to the index file
    const patchDir = path.join(__dirname, 'src', 'utils', 'patches');
    const indexPath = path.join(patchDir, 'index.js');
    
    // Create the directory if it doesn't exist
    if (!fs.existsSync(patchDir)) {
      fs.mkdirSync(patchDir, { recursive: true });
    }
    
    // Check if the file exists
    let indexContent = '';
    if (fs.existsSync(indexPath)) {
      // Read the file content
      indexContent = fs.readFileSync(indexPath, 'utf8');
      
      // Check if our patch is already imported
      if (!indexContent.includes("require('./RNSScreenPatch')")) {
        // Add our import
        indexContent = indexContent.replace('// This file exports all the patched components', '// This file exports all the patched components\nrequire(\'./RNSScreenPatch\');');
      } else {
        console.log('RNSScreen patch already imported in index.js');
        return true;
      }
    } else {
      // Create the index file
      indexContent = `
// This file exports all the patched components
require('./RNSScreenPatch');
export { default as ActivityIndicator } from './ActivityIndicatorPatch';
`;
    }
    
    console.log(`Updating index file: ${indexPath}`);
    fs.writeFileSync(indexPath, indexContent, 'utf8');
    console.log(`Successfully updated index file: ${indexPath}`);
    
    return true;
  } catch (error) {
    console.error('Error updating index file:', error);
  }
  
  return false;
};

// Update the bootstrap.js file to import our patch
const updateBootstrapFile = () => {
  try {
    // Path to the bootstrap.js file
    const bootstrapPath = path.join(__dirname, 'bootstrap.js');
    
    // Check if the file exists
    if (fs.existsSync(bootstrapPath)) {
      console.log(`Updating: ${bootstrapPath}`);
      
      // Read the file content
      let content = fs.readFileSync(bootstrapPath, 'utf8');
      
      // Check if our patch is already imported
      if (!content.includes("// Patch RNSScreen")) {
        // Find the position to insert our import
        const importPosition = content.indexOf("// Import the real entry point");
        if (importPosition !== -1) {
          // Add our import before the real entry point
          const patchImport = `
// Patch RNSScreen
try {
  // Import our patches
  require('./src/utils/patches');
  console.log('Applied patch for RNSScreen');
} catch (error) {
  console.log('Error applying patch for RNSScreen:', error);
}

`;
          
          // Insert the import
          content = content.slice(0, importPosition) + patchImport + content.slice(importPosition);
          
          // Write the updated content back to the file
          fs.writeFileSync(bootstrapPath, content, 'utf8');
          console.log(`Successfully updated: ${bootstrapPath}`);
          return true;
        }
      } else {
        console.log('Patch already imported in bootstrap.js');
        return true;
      }
    } else {
      console.log(`File not found: ${bootstrapPath}`);
    }
  } catch (error) {
    console.error('Error updating bootstrap.js:', error);
  }
  
  return false;
};

// Run all the patches
const success = createDirectPatch() && updateIndexFile();
if (success) {
  updateBootstrapFile();
  console.log('Successfully applied patches for RNSScreen size issue!');
} else {
  console.log('Failed to apply patches for RNSScreen size issue.');
}

console.log('Fix for RNSScreen size issue completed!');
