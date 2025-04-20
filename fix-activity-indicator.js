const fs = require('fs');
const path = require('path');

console.log('Starting fix for ActivityIndicator size issue...');

// Create a patch for the ActivityIndicator component
const createActivityIndicatorPatch = () => {
  try {
    // Path to create the patch file
    const patchDir = path.join(__dirname, 'src', 'utils', 'patches');
    const patchPath = path.join(patchDir, 'ActivityIndicatorPatch.js');
    
    // Create the directory if it doesn't exist
    if (!fs.existsSync(patchDir)) {
      fs.mkdirSync(patchDir, { recursive: true });
    }
    
    // Create the patch file
    const patchContent = `
// This file provides a patched version of ActivityIndicator that handles string size values
import React from 'react';
import { ActivityIndicator as RNActivityIndicator, View, StyleSheet } from 'react-native';

// Helper function to convert size values
const convertSize = (size) => {
  if (size === undefined || size === null) {
    return 'small';
  }
  
  // If it's already a valid size, return it
  if (size === 'small' || size === 'large' || typeof size === 'number') {
    return size;
  }
  
  // Handle string values that should be numbers
  if (typeof size === 'string') {
    // Try to parse the string as a number
    const parsed = parseFloat(size);
    if (!isNaN(parsed)) {
      return parsed;
    }
    
    // Return a default value for other string values
    console.warn(\`[ActivityIndicator] Invalid size value: \${size}, using 'small'\`);
    return 'small';
  }
  
  return 'small';
};

// Patched ActivityIndicator component
const ActivityIndicator = (props) => {
  const { size, ...rest } = props;
  const convertedSize = convertSize(size);
  
  return <RNActivityIndicator size={convertedSize} {...rest} />;
};

export default ActivityIndicator;
`;
    
    console.log(`Creating patch file: ${patchPath}`);
    fs.writeFileSync(patchPath, patchContent, 'utf8');
    console.log(`Successfully created patch file: ${patchPath}`);
    
    return true;
  } catch (error) {
    console.error('Error creating ActivityIndicator patch:', error);
  }
  
  return false;
};

// Create a patch for the index.js file to export our patched ActivityIndicator
const createIndexPatch = () => {
  try {
    // Path to create the index file
    const patchDir = path.join(__dirname, 'src', 'utils', 'patches');
    const indexPath = path.join(patchDir, 'index.js');
    
    // Create the directory if it doesn't exist
    if (!fs.existsSync(patchDir)) {
      fs.mkdirSync(patchDir, { recursive: true });
    }
    
    // Create the index file
    const indexContent = `
// This file exports all the patched components
export { default as ActivityIndicator } from './ActivityIndicatorPatch';
`;
    
    console.log(`Creating index file: ${indexPath}`);
    fs.writeFileSync(indexPath, indexContent, 'utf8');
    console.log(`Successfully created index file: ${indexPath}`);
    
    return true;
  } catch (error) {
    console.error('Error creating index patch:', error);
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
      if (!content.includes("// Patch ActivityIndicator")) {
        // Find the position to insert our import
        const importPosition = content.indexOf("// Import the real entry point");
        if (importPosition !== -1) {
          // Add our import before the real entry point
          const patchImport = `
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
const success = createActivityIndicatorPatch() && createIndexPatch();
if (success) {
  updateBootstrapFile();
  console.log('Successfully applied patches for ActivityIndicator size issue!');
} else {
  console.log('Failed to apply patches for ActivityIndicator size issue.');
}

console.log('Fix for ActivityIndicator size issue completed!');
