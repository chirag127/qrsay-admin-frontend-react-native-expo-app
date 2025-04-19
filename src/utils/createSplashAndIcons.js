// This is a utility script to create splash screen and icons for the app
// Run this script with Node.js to generate the assets

const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

// Create assets directory if it doesn't exist
const assetsDir = path.join(__dirname, '../../assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir);
}

// Create icon (1024x1024)
const iconCanvas = createCanvas(1024, 1024);
const iconCtx = iconCanvas.getContext('2d');

// Fill background
iconCtx.fillStyle = '#ff6b00';
iconCtx.fillRect(0, 0, 1024, 1024);

// Draw text
iconCtx.fillStyle = '#ffffff';
iconCtx.font = 'bold 200px Arial';
iconCtx.textAlign = 'center';
iconCtx.textBaseline = 'middle';
iconCtx.fillText('QRSay', 512, 512);

// Save icon
const iconBuffer = iconCanvas.toBuffer('image/png');
fs.writeFileSync(path.join(assetsDir, 'icon.png'), iconBuffer);

// Create adaptive icon (1024x1024)
const adaptiveIconCanvas = createCanvas(1024, 1024);
const adaptiveIconCtx = adaptiveIconCanvas.getContext('2d');

// Fill background
adaptiveIconCtx.fillStyle = '#ff6b00';
adaptiveIconCtx.fillRect(0, 0, 1024, 1024);

// Draw text
adaptiveIconCtx.fillStyle = '#ffffff';
adaptiveIconCtx.font = 'bold 200px Arial';
adaptiveIconCtx.textAlign = 'center';
adaptiveIconCtx.textBaseline = 'middle';
adaptiveIconCtx.fillText('QRSay', 512, 512);

// Save adaptive icon
const adaptiveIconBuffer = adaptiveIconCanvas.toBuffer('image/png');
fs.writeFileSync(path.join(assetsDir, 'adaptive-icon.png'), adaptiveIconBuffer);

// Create splash screen (2048x2048)
const splashCanvas = createCanvas(2048, 2048);
const splashCtx = splashCanvas.getContext('2d');

// Fill background
splashCtx.fillStyle = '#ff6b00';
splashCtx.fillRect(0, 0, 2048, 2048);

// Draw text
splashCtx.fillStyle = '#ffffff';
splashCtx.font = 'bold 300px Arial';
splashCtx.textAlign = 'center';
splashCtx.textBaseline = 'middle';
splashCtx.fillText('QRSay', 1024, 924);

// Draw subtitle
splashCtx.font = 'bold 150px Arial';
splashCtx.fillText('Admin', 1024, 1124);

// Save splash screen
const splashBuffer = splashCanvas.toBuffer('image/png');
fs.writeFileSync(path.join(assetsDir, 'splash.png'), splashBuffer);

// Create favicon (192x192)
const faviconCanvas = createCanvas(192, 192);
const faviconCtx = faviconCanvas.getContext('2d');

// Fill background
faviconCtx.fillStyle = '#ff6b00';
faviconCtx.fillRect(0, 0, 192, 192);

// Draw text
faviconCtx.fillStyle = '#ffffff';
faviconCtx.font = 'bold 40px Arial';
faviconCtx.textAlign = 'center';
faviconCtx.textBaseline = 'middle';
faviconCtx.fillText('QRSay', 96, 96);

// Save favicon
const faviconBuffer = faviconCanvas.toBuffer('image/png');
fs.writeFileSync(path.join(assetsDir, 'favicon.png'), faviconBuffer);

console.log('Splash screen and icons created successfully!');
