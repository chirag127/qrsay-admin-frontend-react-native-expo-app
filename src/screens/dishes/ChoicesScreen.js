import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    RefreshControl,
    Alert,
} from "react-native";
import {
    Appbar,
    Card,
    Title,
    Button,
    Divider,
    TextInput,
    FAB,
    Dialog,
    Portal,
    Paragraph,
    List,
} from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SIZES } from "../../constants";
import LoadingScreen from "../common/LoadingScreen";
import * as choicesService from "../../services/choicesService";

const ChoicesScreen = ({ navigation }) => {
    const [choices, setChoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);

    // Dialog states
    const [addDialogVisible, setAddDialogVisible] = useState(false);
    const [editDialogVisible, setEditDialogVisible] = useState(false);
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [optionDialogVisible, setOptionDialogVisible] = useState(false);
    const [selectedChoice, setSelectedChoice] = useState(null);
    const [choiceName, setChoiceName] = useState("");
    const [optionName, setOptionName] = useState("");
    const [optionPrice, setOptionPrice] = useState("");
    const [selectedOption, setSelectedOption] = useState(null);
    const [isEditingOption, setIsEditingOption] = useState(false);

    useEffect(() => {
        fetchChoices();
    }, []);

    const fetchChoices = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await choicesService.getChoices();

            if (response && response.data && response.data.choices) {
                setChoices(response.data.choices);
            } else {
                setChoices([]);
            }
        } catch (err) {
            setError(err.message || "Failed to load choices");
            console.error("Error fetching choices:", err);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchChoices();
        setRefreshing(false);
    };

    const handleAddChoice = async () => {
        if (!choiceName.trim()) {
            Alert.alert("Error", "Choice name cannot be empty");
            return;
        }

        try {
            const choiceData = {
                name: choiceName,
            };

            const response = await choicesService.addChoice(choiceData);

            if (response && response.success) {
                // Refresh the choices list
                await fetchChoices();
                setChoiceName("");
                setAddDialogVisible(false);
                Alert.alert("Success", "Choice added successfully");
            } else {
                throw new Error(response?.message || "Failed to add choice");
            }
        } catch (error) {
            console.error("Error adding choice:", error);
            Alert.alert("Error", error.message || "Failed to add choice");
        }
    };

    const handleEditChoice = async () => {
        if (!selectedChoice) return;

        if (!choiceName.trim()) {
            Alert.alert("Error", "Choice name cannot be empty");
            return;
        }

        try {
            const choiceData = {
                _id: selectedChoice._id,
                name: choiceName,
            };

            const response = await choicesService.editChoice(choiceData);

            if (response && response.success) {
                // Refresh the choices list
                await fetchChoices();
                setChoiceName("");
                setEditDialogVisible(false);
                setSelectedChoice(null);
                Alert.alert("Success", "Choice updated successfully");
            } else {
                throw new Error(response?.message || "Failed to update choice");
            }
        } catch (error) {
            console.error("Error updating choice:", error);
            Alert.alert("Error", error.message || "Failed to update choice");
        }
    };

    const handleDeleteChoice = async () => {
        if (!selectedChoice) return;

        try {
            const response = await choicesService.deleteChoice(
                selectedChoice._id
            );

            if (response && response.success) {
                // Refresh the choices list
                await fetchChoices();
                setDeleteDialogVisible(false);
                setSelectedChoice(null);
                Alert.alert("Success", "Choice deleted successfully");
            } else {
                throw new Error(response?.message || "Failed to delete choice");
            }
        } catch (error) {
            console.error("Error deleting choice:", error);
            Alert.alert("Error", error.message || "Failed to delete choice");
        }
    };

    const handleAddOption = async () => {
        if (!selectedChoice) return;

        if (!optionName.trim()) {
            Alert.alert("Error", "Option name cannot be empty");
            return;
        }

        if (!optionPrice.trim() || isNaN(parseFloat(optionPrice))) {
            Alert.alert("Error", "Please enter a valid price");
            return;
        }

        try {
            const optionData = {
                choiceId: selectedChoice._id,
                name: optionName,
                price: parseFloat(optionPrice),
            };

            const response = await choicesService.addOption(optionData);

            if (response && response.success) {
                // Refresh the choices list
                await fetchChoices();
                setOptionName("");
                setOptionPrice("");
                setOptionDialogVisible(false);
                Alert.alert("Success", "Option added successfully");
            } else {
                throw new Error(response?.message || "Failed to add option");
            }
        } catch (error) {
            console.error("Error adding option:", error);
            Alert.alert("Error", error.message || "Failed to add option");
        }
    };

    const handleEditOption = async () => {
        if (!selectedChoice || !selectedOption) return;

        if (!optionName.trim()) {
            Alert.alert("Error", "Option name cannot be empty");
            return;
        }

        if (!optionPrice.trim() || isNaN(parseFloat(optionPrice))) {
            Alert.alert("Error", "Please enter a valid price");
            return;
        }

        try {
            const optionData = {
                choiceId: selectedChoice._id,
                optionId: selectedOption._id,
                name: optionName,
                price: parseFloat(optionPrice),
            };

            const response = await choicesService.editOption(optionData);

            if (response && response.success) {
                // Refresh the choices list
                await fetchChoices();
                setOptionName("");
                setOptionPrice("");
                setOptionDialogVisible(false);
                setSelectedOption(null);
                setIsEditingOption(false);
                Alert.alert("Success", "Option updated successfully");
            } else {
                throw new Error(response?.message || "Failed to update option");
            }
        } catch (error) {
            console.error("Error updating option:", error);
            Alert.alert("Error", error.message || "Failed to update option");
        }
    };

    const handleDeleteOption = async () => {
        if (!selectedChoice || !selectedOption) return;

        try {
            const response = await choicesService.deleteOption(
                selectedChoice._id,
                selectedOption._id
            );

            if (response && response.success) {
                // Refresh the choices list
                await fetchChoices();
                setSelectedOption(null);
                Alert.alert("Success", "Option deleted successfully");
            } else {
                throw new Error(response?.message || "Failed to delete option");
            }
        } catch (error) {
            console.error("Error deleting option:", error);
            Alert.alert("Error", error.message || "Failed to delete option");
        }
    };

    const renderChoiceItem = ({ item }) => (
        <Card style={styles.card}>
            <Card.Content>
                <View style={styles.choiceHeader}>
                    <Title style={styles.choiceTitle}>{item.name}</Title>
                    <View style={styles.headerButtons}>
                        <Button
                            mode="text"
                            onPress={() => {
                                setSelectedChoice(item);
                                setChoiceName(item.name);
                                setEditDialogVisible(true);
                            }}
                            style={styles.smallButton}
                            icon="pencil"
                        >
                            Edit
                        </Button>
                        <Button
                            mode="text"
                            onPress={() => {
                                setSelectedChoice(item);
                                setDeleteDialogVisible(true);
                            }}
                            style={styles.smallButton}
                            icon="delete"
                            color={COLORS.error}
                        >
                            Delete
                        </Button>
                    </View>
                </View>

                <Divider style={styles.divider} />

                {item.options.length > 0 ? (
                    <View style={styles.optionsContainer}>
                        {item.options.map((option) => (
                            <View key={option._id} style={styles.optionItem}>
                                <View style={styles.optionInfo}>
                                    <Text style={styles.optionName}>
                                        {option.name}
                                    </Text>
                                    <Text style={styles.optionPrice}>
                                        ₹{option.price.toFixed(2)}
                                    </Text>
                                </View>
                                <View style={styles.optionButtons}>
                                    <TouchableOpacity
                                        style={styles.optionButton}
                                        onPress={() => {
                                            setSelectedChoice(item);
                                            setSelectedOption(option);
                                            setOptionName(option.name);
                                            setOptionPrice(
                                                option.price.toString()
                                            );
                                            setIsEditingOption(true);
                                            setOptionDialogVisible(true);
                                        }}
                                    >
                                        <Ionicons
                                            name="pencil"
                                            size={16}
                                            color={COLORS.primary}
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.optionButton}
                                        onPress={() => {
                                            setSelectedChoice(item);
                                            setSelectedOption(option);
                                            Alert.alert(
                                                "Delete Option",
                                                `Are you sure you want to delete "${option.name}"?`,
                                                [
                                                    {
                                                        text: "Cancel",
                                                        style: "cancel",
                                                    },
                                                    {
                                                        text: "Delete",
                                                        onPress:
                                                            handleDeleteOption,
                                                        style: "destructive",
                                                    },
                                                ]
                                            );
                                        }}
                                    >
                                        <Ionicons
                                            name="trash"
                                            size={16}
                                            color={COLORS.error}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </View>
                ) : (
                    <Text style={styles.noOptionsText}>
                        No options available
                    </Text>
                )}
            </Card.Content>

            <Card.Actions style={styles.cardActions}>
                <Button
                    mode="outlined"
                    onPress={() => {
                        setSelectedChoice(item);
                        setOptionName("");
                        setOptionPrice("");
                        setIsEditingOption(false);
                        setOptionDialogVisible(true);
                    }}
                    style={styles.addOptionButton}
                    icon="plus"
                >
                    Add Option
                </Button>
            </Card.Actions>
        </Card>
    );

    if (loading && !refreshing) {
        return <LoadingScreen />;
    }

    return (
        <View style={styles.container}>
            <Appbar.Header style={styles.header}>
                <Appbar.Action
                    icon="menu"
                    onPress={() => navigation.openDrawer()}
                />
                <Appbar.Content title="Choices" />
                <Appbar.Action icon="refresh" onPress={onRefresh} />
            </Appbar.Header>

            {error && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            )}

            <FlatList
                data={choices}
                keyExtractor={(item) => item._id}
                renderItem={renderChoiceItem}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons
                            name="options-outline"
                            size={64}
                            color={COLORS.lightGray}
                        />
                        <Text style={styles.emptyText}>No choices found</Text>
                        <Button
                            mode="contained"
                            onPress={() => {
                                setChoiceName("");
                                setAddDialogVisible(true);
                            }}
                            style={styles.addButton}
                            icon="plus"
                        >
                            Add New Choice
                        </Button>
                    </View>
                }
            />

            <FAB
                style={styles.fab}
                icon="plus"
                color={COLORS.white}
                onPress={() => {
                    setChoiceName("");
                    setAddDialogVisible(true);
                }}
            />

            <Portal>
                {/* Add Choice Dialog */}
                <Dialog
                    visible={addDialogVisible}
                    onDismiss={() => setAddDialogVisible(false)}
                >
                    <Dialog.Title>Add Choice</Dialog.Title>
                    <Dialog.Content>
                        <TextInput
                            label="Choice Name"
                            value={choiceName}
                            onChangeText={setChoiceName}
                            mode="outlined"
                            style={styles.dialogInput}
                        />
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setAddDialogVisible(false)}>
                            Cancel
                        </Button>
                        <Button onPress={handleAddChoice}>Add</Button>
                    </Dialog.Actions>
                </Dialog>

                {/* Edit Choice Dialog */}
                <Dialog
                    visible={editDialogVisible}
                    onDismiss={() => setEditDialogVisible(false)}
                >
                    <Dialog.Title>Edit Choice</Dialog.Title>
                    <Dialog.Content>
                        <TextInput
                            label="Choice Name"
                            value={choiceName}
                            onChangeText={setChoiceName}
                            mode="outlined"
                            style={styles.dialogInput}
                        />
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setEditDialogVisible(false)}>
                            Cancel
                        </Button>
                        <Button onPress={handleEditChoice}>Update</Button>
                    </Dialog.Actions>
                </Dialog>

                {/* Delete Choice Dialog */}
                <Dialog
                    visible={deleteDialogVisible}
                    onDismiss={() => setDeleteDialogVisible(false)}
                >
                    <Dialog.Title>Delete Choice</Dialog.Title>
                    <Dialog.Content>
                        <Paragraph>
                            Are you sure you want to delete "
                            {selectedChoice?.name}"?
                        </Paragraph>
                        <Paragraph>
                            This will also delete all options associated with
                            this choice.
                        </Paragraph>
                        <Paragraph>This action cannot be undone.</Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setDeleteDialogVisible(false)}>
                            Cancel
                        </Button>
                        <Button
                            onPress={handleDeleteChoice}
                            color={COLORS.error}
                        >
                            Delete
                        </Button>
                    </Dialog.Actions>
                </Dialog>

                {/* Add/Edit Option Dialog */}
                <Dialog
                    visible={optionDialogVisible}
                    onDismiss={() => setOptionDialogVisible(false)}
                >
                    <Dialog.Title>
                        {isEditingOption ? "Edit Option" : "Add Option"}
                    </Dialog.Title>
                    <Dialog.Content>
                        <TextInput
                            label="Option Name"
                            value={optionName}
                            onChangeText={setOptionName}
                            mode="outlined"
                            style={styles.dialogInput}
                        />
                        <TextInput
                            label="Price"
                            value={optionPrice}
                            onChangeText={setOptionPrice}
                            mode="outlined"
                            keyboardType="numeric"
                            style={styles.dialogInput}
                            left={<TextInput.Affix text="₹" />}
                        />
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setOptionDialogVisible(false)}>
                            Cancel
                        </Button>
                        <Button
                            onPress={
                                isEditingOption
                                    ? handleEditOption
                                    : handleAddOption
                            }
                        >
                            {isEditingOption ? "Update" : "Add"}
                        </Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
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
    listContent: {
        padding: SIZES.medium,
        paddingBottom: SIZES.extraLarge * 2,
    },
    card: {
        marginBottom: SIZES.medium,
    },
    choiceHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    choiceTitle: {
        fontSize: SIZES.medium,
        fontWeight: "bold",
    },
    headerButtons: {
        flexDirection: "row",
    },
    smallButton: {
        marginLeft: SIZES.base / 2,
    },
    divider: {
        marginVertical: SIZES.base,
    },
    optionsContainer: {
        marginTop: SIZES.base,
    },
    optionItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: SIZES.base,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.lightGray,
    },
    optionInfo: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    optionName: {
        fontSize: SIZES.font,
    },
    optionPrice: {
        fontSize: SIZES.font,
        fontWeight: "bold",
        color: COLORS.primary,
    },
    optionButtons: {
        flexDirection: "row",
        marginLeft: SIZES.medium,
    },
    optionButton: {
        padding: SIZES.base,
        marginLeft: SIZES.base,
    },
    noOptionsText: {
        color: COLORS.gray,
        fontStyle: "italic",
        marginTop: SIZES.base,
    },
    cardActions: {
        justifyContent: "flex-end",
    },
    addOptionButton: {
        borderColor: COLORS.primary,
    },
    emptyContainer: {
        alignItems: "center",
        justifyContent: "center",
        padding: SIZES.extraLarge * 2,
    },
    emptyText: {
        marginTop: SIZES.medium,
        fontSize: SIZES.medium,
        color: COLORS.gray,
        textAlign: "center",
        marginBottom: SIZES.medium,
    },
    addButton: {
        backgroundColor: COLORS.primary,
    },
    fab: {
        position: "absolute",
        margin: SIZES.medium,
        right: 0,
        bottom: 0,
        backgroundColor: COLORS.primary,
    },
    errorContainer: {
        padding: SIZES.medium,
        backgroundColor: COLORS.error,
    },
    errorText: {
        color: COLORS.white,
        textAlign: "center",
    },
    dialogInput: {
        marginTop: SIZES.base,
        backgroundColor: COLORS.white,
    },
});

export default ChoicesScreen;
