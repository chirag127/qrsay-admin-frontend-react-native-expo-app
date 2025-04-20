import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';

/**
 * Helper utility to handle media library operations with fallbacks
 * for when permissions are not available in Expo Go
 */
const MediaLibraryHelper = {
  /**
   * Save an image to the device
   * @param {string} uri - The URI of the image to save
   * @param {string} filename - The filename to save the image as
   * @returns {Promise<Object>} - Result of the save operation
   */
  async saveImage(uri, filename) {
    try {
      // First try to get permissions
      const { status } = await MediaLibrary.requestPermissionsAsync();

      if (status === 'granted') {
        // If permissions are granted, save to media library
        const asset = await MediaLibrary.createAssetAsync(uri);
        return { success: true, asset };
      } else {
        // If permissions are not granted, use sharing instead
        return await this.shareImage(uri);
      }
    } catch (error) {
      console.error('Error saving image:', error);
      // If there's an error, try sharing as a fallback
      return await this.shareImage(uri);
    }
  },

  /**
   * Share an image using the sharing API
   * @param {string} uri - The URI of the image to share
   * @returns {Promise<Object>} - Result of the share operation
   */
  async shareImage(uri) {
    try {
      const canShare = await Sharing.isAvailableAsync();

      if (canShare) {
        await Sharing.shareAsync(uri);
        return { success: true, shared: true };
      } else {
        return { success: false, error: 'Sharing not available on this device' };
      }
    } catch (error) {
      console.error('Error sharing image:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Get a list of images from the media library with fallback
   * @returns {Promise<Array>} - Array of images or empty array if not available
   */
  async getImages() {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();

      if (status === 'granted') {
        const media = await MediaLibrary.getAssetsAsync({
          mediaType: 'photo',
          sortBy: [MediaLibrary.SortBy.creationTime],
        });
        return media.assets;
      } else {
        console.log('Media library permissions not granted');
        return [];
      }
    } catch (error) {
      console.error('Error getting images:', error);
      return [];
    }
  }
};

export default MediaLibraryHelper;