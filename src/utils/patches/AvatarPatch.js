
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
