const fs = require('fs');
const path = require('path');

console.log('Starting fix for react-native-screens size issue...');

// Create a patch for the RNSScreen component
const patchScreenComponent = () => {
  try {
    // Path to the Screen.js file
    const screenPath = path.join(
      __dirname,
      'node_modules',
      'react-native-screens',
      'src',
      'screens',
      'Screen.tsx'
    );

    // Check if the file exists
    if (fs.existsSync(screenPath)) {
      console.log(`Patching: ${screenPath}`);
      
      // Read the file content
      let content = fs.readFileSync(screenPath, 'utf8');
      
      // Add a size conversion function
      if (!content.includes('const convertSize = (size)')) {
        // Find the import section
        const importSection = content.match(/import.*?;(\r?\n|\r)/g);
        if (importSection) {
          const lastImport = importSection[importSection.length - 1];
          const insertPosition = content.indexOf(lastImport) + lastImport.length;
          
          // Add the size conversion function
          const sizeConversionFunction = `
// Helper function to convert size values
const convertSize = (size) => {
  if (size === undefined || size === null) {
    return undefined;
  }
  
  // Handle string values that should be numbers
  if (typeof size === 'string') {
    // Handle predefined sizes
    if (size === 'small') return 34;
    if (size === 'medium') return 50;
    if (size === 'large') return 75;
    if (size === 'xlarge') return 150;
    
    // Try to parse the string as a number
    const parsed = parseFloat(size);
    if (!isNaN(parsed)) {
      return parsed;
    }
    
    // Return a default value for other string values
    console.warn(\`[react-native-screens] Invalid size value: \${size}, using default\`);
    return undefined;
  }
  
  return size;
};
`;
          
          // Insert the function
          content = content.slice(0, insertPosition) + sizeConversionFunction + content.slice(insertPosition);
          
          // Find places where size props are used and wrap them with the conversion function
          content = content.replace(/\bsize\s*=\s*\{([^}]+)\}/g, 'size={convertSize($1)}');
          
          // Write the patched content back to the file
          fs.writeFileSync(screenPath, content, 'utf8');
          console.log(`Successfully patched: ${screenPath}`);
          return true;
        }
      } else {
        console.log('Size conversion function already exists in Screen.tsx');
        return true;
      }
    } else {
      console.log(`File not found: ${screenPath}`);
    }
  } catch (error) {
    console.error('Error patching Screen.tsx:', error);
  }
  
  return false;
};

// Create a patch for the ScreenStack component
const patchScreenStackComponent = () => {
  try {
    // Path to the ScreenStack.js file
    const screenStackPath = path.join(
      __dirname,
      'node_modules',
      'react-native-screens',
      'src',
      'screens',
      'ScreenStack.tsx'
    );

    // Check if the file exists
    if (fs.existsSync(screenStackPath)) {
      console.log(`Patching: ${screenStackPath}`);
      
      // Read the file content
      let content = fs.readFileSync(screenStackPath, 'utf8');
      
      // Add a size conversion function
      if (!content.includes('const convertSize = (size)')) {
        // Find the import section
        const importSection = content.match(/import.*?;(\r?\n|\r)/g);
        if (importSection) {
          const lastImport = importSection[importSection.length - 1];
          const insertPosition = content.indexOf(lastImport) + lastImport.length;
          
          // Add the size conversion function
          const sizeConversionFunction = `
// Helper function to convert size values
const convertSize = (size) => {
  if (size === undefined || size === null) {
    return undefined;
  }
  
  // Handle string values that should be numbers
  if (typeof size === 'string') {
    // Handle predefined sizes
    if (size === 'small') return 34;
    if (size === 'medium') return 50;
    if (size === 'large') return 75;
    if (size === 'xlarge') return 150;
    
    // Try to parse the string as a number
    const parsed = parseFloat(size);
    if (!isNaN(parsed)) {
      return parsed;
    }
    
    // Return a default value for other string values
    console.warn(\`[react-native-screens] Invalid size value: \${size}, using default\`);
    return undefined;
  }
  
  return size;
};
`;
          
          // Insert the function
          content = content.slice(0, insertPosition) + sizeConversionFunction + content.slice(insertPosition);
          
          // Find places where size props are used and wrap them with the conversion function
          content = content.replace(/\bsize\s*=\s*\{([^}]+)\}/g, 'size={convertSize($1)}');
          
          // Write the patched content back to the file
          fs.writeFileSync(screenStackPath, content, 'utf8');
          console.log(`Successfully patched: ${screenStackPath}`);
          return true;
        }
      } else {
        console.log('Size conversion function already exists in ScreenStack.tsx');
        return true;
      }
    } else {
      console.log(`File not found: ${screenStackPath}`);
    }
  } catch (error) {
    console.error('Error patching ScreenStack.tsx:', error);
  }
  
  return false;
};

// Create a direct patch for the RNSScreen component
const createDirectPatch = () => {
  try {
    // Path to create the patch file
    const patchDir = path.join(__dirname, 'node_modules', 'react-native-screens', 'src', 'patches');
    const patchPath = path.join(patchDir, 'SizeConverter.js');
    
    // Create the directory if it doesn't exist
    if (!fs.existsSync(patchDir)) {
      fs.mkdirSync(patchDir, { recursive: true });
    }
    
    // Create the patch file
    const patchContent = `
// This file provides a utility to convert string size values to numbers
// It's used to fix the "Unable to convert string to floating point value" error

// Helper function to convert size values
export const convertSize = (size) => {
  if (size === undefined || size === null) {
    return undefined;
  }
  
  // Handle string values that should be numbers
  if (typeof size === 'string') {
    // Handle predefined sizes
    if (size === 'small') return 34;
    if (size === 'medium') return 50;
    if (size === 'large') return 75;
    if (size === 'xlarge') return 150;
    
    // Try to parse the string as a number
    const parsed = parseFloat(size);
    if (!isNaN(parsed)) {
      return parsed;
    }
    
    // Return a default value for other string values
    console.warn(\`[react-native-screens] Invalid size value: \${size}, using default\`);
    return undefined;
  }
  
  return size;
};

// Apply the patch to the global RNSScreen component
if (global.RNSScreen) {
  const originalRNSScreen = global.RNSScreen;
  global.RNSScreen = (props) => {
    // Convert string size values to numbers
    const patchedProps = { ...props };
    if (props.size !== undefined) {
      patchedProps.size = convertSize(props.size);
    }
    return originalRNSScreen(patchedProps);
  };
}
`;
    
    console.log(`Creating patch file: ${patchPath}`);
    fs.writeFileSync(patchPath, patchContent, 'utf8');
    console.log(`Successfully created patch file: ${patchPath}`);
    
    return true;
  } catch (error) {
    console.error('Error creating direct patch:', error);
  }
  
  return false;
};

// Create a patch for the bootstrap.js file to import our patch
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
      if (!content.includes("require('./node_modules/react-native-screens/src/patches/SizeConverter')")) {
        // Find the position to insert our import
        const importPosition = content.indexOf("// Import the real entry point");
        if (importPosition !== -1) {
          // Add our import before the real entry point
          const patchImport = `
// Import the patch for react-native-screens
try {
  require('./node_modules/react-native-screens/src/patches/SizeConverter');
  console.log('Applied patch for react-native-screens');
} catch (error) {
  console.log('Error applying patch for react-native-screens:', error);
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
const success = patchScreenComponent() || patchScreenStackComponent() || createDirectPatch();
if (success) {
  updateBootstrapFile();
  console.log('Successfully applied patches for react-native-screens size issue!');
} else {
  console.log('Failed to apply patches for react-native-screens size issue.');
}

console.log('Fix for react-native-screens size issue completed!');
