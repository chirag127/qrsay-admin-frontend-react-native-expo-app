import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    Share,
    Platform,
} from "react-native";
import { Card } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import QRCode from "react-native-qrcode-svg";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as MediaLibrary from "expo-media-library";
import { useRestaurant } from "../../context/RestaurantContext";
import restaurantService from "../../services/restaurant.service";
import Header from "../../components/common/Header";

const RestaurantQrCodeScreen = () => {
    const { restaurantData } = useRestaurant();

    const [isLoading, setIsLoading] = useState(true);
    const [qrCodeData, setQrCodeData] = useState(null);
    const [qrCodeRef, setQrCodeRef] = useState(null);
    const [hasMediaPermission, setHasMediaPermission] = useState(false);

    useEffect(() => {
        fetchQrCodeData();
        checkMediaPermission();
    }, []);

    const checkMediaPermission = async () => {
        if (Platform.OS !== "web") {
            const { status } = await MediaLibrary.requestPermissionsAsync();
            setHasMediaPermission(status === "granted");
        }
    };

    const fetchQrCodeData = async () => {
        try {
            setIsLoading(true);
            const response = await restaurantService.getRestaurantQrCode();

            if (response && response.data && response.data.qrCodeData) {
                setQrCodeData(response.data.qrCodeData);
            } else {
                // If no QR code data is available, create a default one
                const defaultQrData = `https://qrsay.web.app/restaurant/${
                    restaurantData?._id || "unknown"
                }`;
                setQrCodeData(defaultQrData);
            }
        } catch (error) {
            console.error("Fetch QR code data error:", error);
            // Create a default QR code on error
            const defaultQrData = `https://qrsay.web.app/restaurant/${
                restaurantData?._id || "unknown"
            }`;
            setQrCodeData(defaultQrData);
        } finally {
            setIsLoading(false);
        }
    };

    const handleShareQrCode = async () => {
        try {
            if (qrCodeData) {
                await Share.share({
                    message: `Scan this QR code to view our restaurant menu: ${qrCodeData}`,
                });
            }
        } catch (error) {
            console.error("Share QR code error:", error);
            Alert.alert("Error", "Failed to share QR code");
        }
    };

    const handleSaveQrCode = async () => {
        if (!hasMediaPermission) {
            Alert.alert(
                "Permission Required",
                "Storage permission is required to save the QR code",
                [
                    { text: "Cancel", style: "cancel" },
                    { text: "Grant Permission", onPress: checkMediaPermission },
                ]
            );
            return;
        }

        try {
            if (qrCodeRef) {
                // Get the QR code as a base64 string
                qrCodeRef.toDataURL(async (base64) => {
                    const fileUri = `${FileSystem.cacheDirectory}qrsay-restaurant-qrcode.png`;

                    // Write the base64 data to a file
                    await FileSystem.writeAsStringAsync(fileUri, base64, {
                        encoding: FileSystem.EncodingType.Base64,
                    });

                    // Save to media library
                    const asset = await MediaLibrary.createAssetAsync(fileUri);
                    await MediaLibrary.createAlbumAsync("QRSay", asset, false);

                    Alert.alert("Success", "QR code saved to your gallery");
                });
            }
        } catch (error) {
            console.error("Save QR code error:", error);
            Alert.alert("Error", "Failed to save QR code");
        }
    };

    if (isLoading) {
        return (
            <View style={styles.container}>
                <Header title="Restaurant QR Code" showBackButton />
                <ActivityIndicator
                    size={50}
                    color="#ff6b00"
                    style={styles.loader}
                />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Header title="Restaurant QR Code" showBackButton />

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Card containerStyle={styles.card}>
                    <Text style={styles.cardTitle}>Restaurant QR Code</Text>
                    <Text style={styles.cardSubtitle}>
                        Customers can scan this QR code to view your restaurant
                        menu
                    </Text>

                    <View style={styles.qrCodeContainer}>
                        {qrCodeData ? (
                            <QRCode
                                value={qrCodeData}
                                size={250}
                                color="#000"
                                backgroundColor="#fff"
                                getRef={(ref) => setQrCodeRef(ref)}
                            />
                        ) : (
                            <Text style={styles.errorText}>
                                Failed to generate QR code
                            </Text>
                        )}
                    </View>

                    <View style={styles.actionButtons}>
                        <TouchableOpacity
                            style={[styles.actionButton, styles.shareButton]}
                            onPress={handleShareQrCode}
                        >
                            <Icon name="share-alt" size={16} color="#fff" />
                            <Text style={styles.actionButtonText}>Share</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.actionButton, styles.saveButton]}
                            onPress={handleSaveQrCode}
                        >
                            <Icon name="download" size={16} color="#fff" />
                            <Text style={styles.actionButtonText}>Save</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.infoContainer}>
                        <Text style={styles.infoTitle}>How to use:</Text>
                        <View style={styles.infoItem}>
                            <Icon
                                name="print"
                                size={16}
                                color="#666"
                                style={styles.infoIcon}
                            />
                            <Text style={styles.infoText}>
                                Print this QR code and place it on your tables
                                or menu cards
                            </Text>
                        </View>
                        <View style={styles.infoItem}>
                            <Icon
                                name="mobile"
                                size={16}
                                color="#666"
                                style={styles.infoIcon}
                            />
                            <Text style={styles.infoText}>
                                Customers can scan it with their smartphone
                                camera
                            </Text>
                        </View>
                        <View style={styles.infoItem}>
                            <Icon
                                name="cutlery"
                                size={16}
                                color="#666"
                                style={styles.infoIcon}
                            />
                            <Text style={styles.infoText}>
                                They will be directed to your digital menu
                            </Text>
                        </View>
                        <View style={styles.infoItem}>
                            <Icon
                                name="shopping-cart"
                                size={16}
                                color="#666"
                                style={styles.infoIcon}
                            />
                            <Text style={styles.infoText}>
                                Customers can browse and place orders directly
                            </Text>
                        </View>
                    </View>
                </Card>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    scrollContainer: {
        padding: 10,
        paddingBottom: 20,
    },
    card: {
        borderRadius: 5,
        padding: 15,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 10,
        color: "#333",
    },
    cardSubtitle: {
        fontSize: 14,
        textAlign: "center",
        marginBottom: 20,
        color: "#666",
    },
    qrCodeContainer: {
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        backgroundColor: "#fff",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#ddd",
        marginBottom: 20,
    },
    errorText: {
        color: "red",
        textAlign: "center",
    },
    actionButtons: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginBottom: 20,
    },
    actionButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        width: "45%",
    },
    shareButton: {
        backgroundColor: "#2196F3",
    },
    saveButton: {
        backgroundColor: "#4CAF50",
    },
    actionButtonText: {
        color: "#fff",
        fontWeight: "bold",
        marginLeft: 5,
    },
    infoContainer: {
        backgroundColor: "#f9f9f9",
        padding: 15,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#ddd",
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 10,
        color: "#333",
    },
    infoItem: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 10,
    },
    infoIcon: {
        marginRight: 10,
        marginTop: 2,
    },
    infoText: {
        flex: 1,
        color: "#666",
    },
    loader: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});

export default RestaurantQrCodeScreen;
