import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Share } from 'react-native';
import { Appbar, Card, Title, Button, Divider, TextInput, SegmentedButtons } from 'react-native-paper';
import QRCode from 'react-native-qrcode-svg';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import { useAuth } from '../../context/AuthContext';
import { COLORS, SIZES } from '../../constants';
import LoadingScreen from '../common/LoadingScreen';

const QRCodeScreen = ({ navigation }) => {
  const { restaurant } = useAuth();
  const [loading, setLoading] = useState(false);
  const [qrValue, setQrValue] = useState('');
  const [qrType, setQrType] = useState('restaurant');
  const [tableNumber, setTableNumber] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [qrSize, setQrSize] = useState(200);
  const [qrRef, setQrRef] = useState(null);
  
  useEffect(() => {
    generateQRValue();
  }, [qrType, tableNumber, roomNumber, restaurant]);
  
  const generateQRValue = () => {
    if (!restaurant) return;
    
    const baseUrl = 'https://qrsay.com';
    let url = '';
    
    switch (qrType) {
      case 'restaurant':
        url = `${baseUrl}/restaurant/${restaurant._id}`;
        break;
      case 'table':
        url = `${baseUrl}/restaurant/${restaurant._id}/table/${tableNumber}`;
        break;
      case 'room':
        url = `${baseUrl}/restaurant/${restaurant._id}/room/${roomNumber}`;
        break;
      default:
        url = baseUrl;
    }
    
    setQrValue(url);
  };
  
  const handleSaveQRCode = async () => {
    try {
      setLoading(true);
      
      // Request permissions
      const { status } = await MediaLibrary.requestPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant permission to save QR code to your device');
        setLoading(false);
        return;
      }
      
      // Get QR code as SVG string
      let svg = '';
      qrRef.toDataURL(async (data) => {
        try {
          // Create a temporary file
          const fileUri = `${FileSystem.cacheDirectory}qrcode.png`;
          
          // Convert base64 to file
          await FileSystem.writeAsStringAsync(fileUri, data, {
            encoding: FileSystem.EncodingType.Base64,
          });
          
          // Save to media library
          const asset = await MediaLibrary.createAssetAsync(fileUri);
          await MediaLibrary.createAlbumAsync('QRSay', asset, false);
          
          Alert.alert('Success', 'QR code saved to your device');
        } catch (error) {
          console.error('Error saving QR code:', error);
          Alert.alert('Error', 'Failed to save QR code');
        } finally {
          setLoading(false);
        }
      });
    } catch (error) {
      console.error('Error saving QR code:', error);
      Alert.alert('Error', 'Failed to save QR code');
      setLoading(false);
    }
  };
  
  const handleShareQRCode = async () => {
    try {
      setLoading(true);
      
      // Get QR code as SVG string
      qrRef.toDataURL(async (data) => {
        try {
          // Create a temporary file
          const fileUri = `${FileSystem.cacheDirectory}qrcode.png`;
          
          // Convert base64 to file
          await FileSystem.writeAsStringAsync(fileUri, data, {
            encoding: FileSystem.EncodingType.Base64,
          });
          
          // Check if sharing is available
          const isAvailable = await Sharing.isAvailableAsync();
          
          if (isAvailable) {
            await Sharing.shareAsync(fileUri);
          } else {
            // Fallback to Share API
            await Share.share({
              title: 'QRSay QR Code',
              message: `Scan this QR code to access ${restaurant?.restaurantName || 'our restaurant'}: ${qrValue}`,
              url: fileUri,
            });
          }
        } catch (error) {
          console.error('Error sharing QR code:', error);
          Alert.alert('Error', 'Failed to share QR code');
        } finally {
          setLoading(false);
        }
      });
    } catch (error) {
      console.error('Error sharing QR code:', error);
      Alert.alert('Error', 'Failed to share QR code');
      setLoading(false);
    }
  };
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.Action icon="menu" onPress={() => navigation.openDrawer()} />
        <Appbar.Content title="QR Code Generator" />
      </Appbar.Header>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Generate QR Code</Title>
            <Divider style={styles.divider} />
            
            <Text style={styles.label}>QR Code Type</Text>
            <SegmentedButtons
              value={qrType}
              onValueChange={setQrType}
              buttons={[
                { value: 'restaurant', label: 'Restaurant' },
                { value: 'table', label: 'Table' },
                { value: 'room', label: 'Room' },
              ]}
              style={styles.segmentedButtons}
            />
            
            {qrType === 'table' && (
              <TextInput
                label="Table Number"
                value={tableNumber}
                onChangeText={setTableNumber}
                style={styles.input}
                mode="outlined"
                keyboardType="number-pad"
              />
            )}
            
            {qrType === 'room' && (
              <TextInput
                label="Room Number"
                value={roomNumber}
                onChangeText={setRoomNumber}
                style={styles.input}
                mode="outlined"
                keyboardType="number-pad"
              />
            )}
            
            <Text style={styles.label}>QR Code Size</Text>
            <View style={styles.sizeButtons}>
              <TouchableOpacity
                style={[styles.sizeButton, qrSize === 150 && styles.selectedSizeButton]}
                onPress={() => setQrSize(150)}
              >
                <Text style={[styles.sizeButtonText, qrSize === 150 && styles.selectedSizeButtonText]}>Small</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.sizeButton, qrSize === 200 && styles.selectedSizeButton]}
                onPress={() => setQrSize(200)}
              >
                <Text style={[styles.sizeButtonText, qrSize === 200 && styles.selectedSizeButtonText]}>Medium</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.sizeButton, qrSize === 250 && styles.selectedSizeButton]}
                onPress={() => setQrSize(250)}
              >
                <Text style={[styles.sizeButtonText, qrSize === 250 && styles.selectedSizeButtonText]}>Large</Text>
              </TouchableOpacity>
            </View>
          </Card.Content>
        </Card>
        
        <Card style={styles.qrCard}>
          <Card.Content style={styles.qrContent}>
            <Title style={styles.qrTitle}>
              {qrType === 'restaurant'
                ? 'Restaurant QR Code'
                : qrType === 'table'
                ? `Table ${tableNumber} QR Code`
                : `Room ${roomNumber} QR Code`}
            </Title>
            
            <View style={styles.qrContainer}>
              {qrValue ? (
                <QRCode
                  value={qrValue}
                  size={qrSize}
                  color={COLORS.black}
                  backgroundColor={COLORS.white}
                  getRef={(ref) => setQrRef(ref)}
                />
              ) : (
                <View style={[styles.qrPlaceholder, { width: qrSize, height: qrSize }]}>
                  <Text style={styles.qrPlaceholderText}>QR Code</Text>
                </View>
              )}
            </View>
            
            <Text style={styles.qrValueText}>{qrValue}</Text>
            
            <View style={styles.qrActions}>
              <Button
                mode="contained"
                onPress={handleSaveQRCode}
                style={styles.qrButton}
                icon="content-save"
              >
                Save
              </Button>
              <Button
                mode="contained"
                onPress={handleShareQRCode}
                style={styles.qrButton}
                icon="share-variant"
              >
                Share
              </Button>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
  },
  scrollContent: {
    padding: SIZES.medium,
    paddingBottom: SIZES.extraLarge,
  },
  card: {
    marginBottom: SIZES.medium,
  },
  cardTitle: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  divider: {
    marginVertical: SIZES.base,
  },
  label: {
    fontSize: SIZES.font,
    fontWeight: 'bold',
    marginTop: SIZES.medium,
    marginBottom: SIZES.base,
    color: COLORS.text,
  },
  segmentedButtons: {
    marginBottom: SIZES.medium,
  },
  input: {
    marginBottom: SIZES.medium,
    backgroundColor: COLORS.white,
  },
  sizeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.medium,
  },
  sizeButton: {
    flex: 1,
    paddingVertical: SIZES.base,
    paddingHorizontal: SIZES.medium,
    borderRadius: SIZES.base,
    backgroundColor: COLORS.lightGray,
    marginHorizontal: SIZES.base / 2,
    alignItems: 'center',
  },
  selectedSizeButton: {
    backgroundColor: COLORS.primary,
  },
  sizeButtonText: {
    color: COLORS.text,
  },
  selectedSizeButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  qrCard: {
    marginBottom: SIZES.medium,
  },
  qrContent: {
    alignItems: 'center',
  },
  qrTitle: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    marginBottom: SIZES.medium,
    color: COLORS.primary,
  },
  qrContainer: {
    padding: SIZES.medium,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.base,
    marginBottom: SIZES.medium,
  },
  qrPlaceholder: {
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: SIZES.base,
  },
  qrPlaceholderText: {
    color: COLORS.gray,
    fontWeight: 'bold',
  },
  qrValueText: {
    fontSize: SIZES.small,
    color: COLORS.gray,
    marginBottom: SIZES.medium,
    textAlign: 'center',
  },
  qrActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  qrButton: {
    flex: 1,
    marginHorizontal: SIZES.base,
    backgroundColor: COLORS.primary,
  },
});

export default QRCodeScreen;
