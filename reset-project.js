const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

console.log('Starting complete project reset...');

// Directories to remove
const dirsToRemove = [
  'node_modules',
  '.expo',
  '.expo-shared',
  'android',
  'ios'
];

// Files to remove
const filesToRemove = [
  'yarn.lock',
  'package-lock.json',
  'yarn-error.log',
  'npm-debug.log'
];

// Clean Expo and npm caches
console.log('Cleaning caches...');
try {
  execSync('expo doctor --fix', { stdio: 'inherit' });
  execSync('npm cache clean --force', { stdio: 'inherit' });
  execSync('npx expo-cli clean-project-dependencies', { stdio: 'inherit' });
  
  // Clean Metro bundler cache
  const tempDir = os.tmpdir();
  const metroCacheDir = path.join(tempDir, 'metro-cache');
  if (fs.existsSync(metroCacheDir)) {
    console.log(`Removing Metro cache directory: ${metroCacheDir}`);
    if (process.platform === 'win32') {
      execSync(`rmdir /s /q "${metroCacheDir}"`, { stdio: 'inherit' });
    } else {
      execSync(`rm -rf "${metroCacheDir}"`, { stdio: 'inherit' });
    }
  }
  
  // Clean Expo cache
  const expoCacheDir = path.join(os.homedir(), '.expo');
  if (fs.existsSync(expoCacheDir)) {
    console.log(`Cleaning Expo cache directory: ${expoCacheDir}`);
    execSync('expo start --clear', { stdio: 'inherit' });
  }
} catch (error) {
  console.log('Error cleaning caches, continuing anyway...');
}

// Remove directories
console.log('Removing directories...');
dirsToRemove.forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  if (fs.existsSync(dirPath)) {
    console.log(`Removing ${dir}...`);
    try {
      if (process.platform === 'win32') {
        execSync(`rmdir /s /q "${dirPath}"`, { stdio: 'inherit' });
      } else {
        execSync(`rm -rf "${dirPath}"`, { stdio: 'inherit' });
      }
    } catch (error) {
      console.error(`Error removing ${dir}:`, error.message);
    }
  }
});

// Remove files
console.log('Removing files...');
filesToRemove.forEach(file => {
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
console.log('Reinstalling dependencies...');
try {
  execSync('npm install', { stdio: 'inherit' });
} catch (error) {
  console.error('Error reinstalling dependencies:', error.message);
  process.exit(1);
}

// Fix gesture handler issues
console.log('Fixing gesture handler issues...');
try {
  execSync('npm run fix-gesture-handler', { stdio: 'inherit' });
} catch (error) {
  console.log('Error fixing gesture handler, continuing anyway...');
}

console.log('Complete project reset finished successfully!');
console.log('');
console.log('Next steps:');
console.log('1. Run "npm start" to start the development server');
console.log('2. Press "a" to run on Android or "i" to run on iOS');
console.log('');
console.log('If you still encounter issues, please refer to the README.md troubleshooting section.');
