const fs = require('fs');
const path = require('path');

console.log('Starting fix for Avatar size issue...');

// Create a direct patch for the Avatar component
const createDirectPatch = () => {
  try {
    // Path to create the patch file
    const patchDir = path.join(__dirname, 'src', 'utils', 'patches');
    const patchPath = path.join(patchDir, 'AvatarPatch.js');
    
    // Create the directory if it doesn't exist
    if (!fs.existsSync(patchDir)) {
      fs.mkdirSync(patchDir, { recursive: true });
    }
    
    // Create the patch file
    const patchContent = `
// This file provides a direct patch for the Avatar component
import React from 'react';
import { Avatar as RNEAvatar } from 'react-native-elements';

// Define the avatar sizes
const avatarSizes = {
  small: 34,
  medium: 50,
  large: 75,
  xlarge: 150,
};

// Patched Avatar component
const Avatar = (props) => {
  const { size, ...rest } = props;
  
  // Convert string size values to numbers
  let numericSize = size;
  if (typeof size === 'string' && !['small', 'medium', 'large', 'xlarge'].includes(size)) {
    // Try to parse the string as a number
    const parsed = parseFloat(size);
    if (!isNaN(parsed)) {
      numericSize = parsed;
    } else {
      // Use a default value
      numericSize = 'small';
    }
  }
  
  return <RNEAvatar size={numericSize} {...rest} />;
};

// Copy all static properties from RNEAvatar to our patched Avatar
Object.keys(RNEAvatar).forEach(key => {
  if (key !== 'propTypes' && key !== 'defaultProps') {
    Avatar[key] = RNEAvatar[key];
  }
});

export default Avatar;
`;
    
    console.log(`Creating patch file: ${patchPath}`);
    fs.writeFileSync(patchPath, patchContent, 'utf8');
    console.log(`Successfully created patch file: ${patchPath}`);
    
    return true;
  } catch (error) {
    console.error('Error creating Avatar patch:', error);
  }
  
  return false;
};

// Update the index.js file to export our patched Avatar
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
      if (!indexContent.includes("export { default as Avatar }")) {
        // Add our export
        indexContent += "export { default as Avatar } from './AvatarPatch';\n";
      } else {
        console.log('Avatar patch already exported in index.js');
        return true;
      }
    } else {
      // Create the index file
      indexContent = `
// This file exports all the patched components
require('./RNSScreenPatch');
export { default as ActivityIndicator } from './ActivityIndicatorPatch';
export { default as Avatar } from './AvatarPatch';
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

// Create a patch for the App.js file to import our patched Avatar
const patchAppFile = () => {
  try {
    // Path to the App.js file
    const appPath = path.join(__dirname, 'App.js');
    
    // Check if the file exists
    if (fs.existsSync(appPath)) {
      console.log(`Patching: ${appPath}`);
      
      // Read the file content
      let content = fs.readFileSync(appPath, 'utf8');
      
      // Check if our patch is already imported
      if (!content.includes("// Patch Avatar")) {
        // Add our import at the top of the file
        const importStatement = "// Patch Avatar\nimport { Avatar } from './src/utils/patches';\n\n";
        
        // Find the position to insert our import
        const importPosition = content.indexOf("import React");
        if (importPosition !== -1) {
          // Insert the import
          content = content.slice(0, importPosition) + importStatement + content.slice(importPosition);
          
          // Write the patched content back to the file
          fs.writeFileSync(appPath, content, 'utf8');
          console.log(`Successfully patched: ${appPath}`);
          return true;
        }
      } else {
        console.log('Avatar patch already imported in App.js');
        return true;
      }
    } else {
      console.log(`File not found: ${appPath}`);
    }
  } catch (error) {
    console.error('Error patching App.js:', error);
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
      if (!content.includes("// Patch Avatar")) {
        // Find the position to insert our import
        const importPosition = content.indexOf("// Import the real entry point");
        if (importPosition !== -1) {
          // Add our import before the real entry point
          const patchImport = `
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
  patchAppFile();
  updateBootstrapFile();
  console.log('Successfully applied patches for Avatar size issue!');
} else {
  console.log('Failed to apply patches for Avatar size issue.');
}

console.log('Fix for Avatar size issue completed!');
