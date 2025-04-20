const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { optimize } = require('svgo');

// Path to the SVG file
const svgPath = path.join(__dirname, 'src', 'assets', 'logo.svg');
// Output path for the PNG file
const pngPath = path.join(__dirname, 'src', 'assets', 'logo.png');

// Read the SVG file
const svgContent = fs.readFileSync(svgPath, 'utf8');

// Optimize the SVG
const optimizedSvg = optimize(svgContent, {
  multipass: true,
}).data;

// Convert SVG to PNG
sharp(Buffer.from(optimizedSvg))
  .resize(200, 200) // Resize to 200x200 pixels
  .png()
  .toFile(pngPath)
  .then(() => {
    console.log(`Successfully converted SVG to PNG: ${pngPath}`);
  })
  .catch(err => {
    console.error('Error converting SVG to PNG:', err);
  });
