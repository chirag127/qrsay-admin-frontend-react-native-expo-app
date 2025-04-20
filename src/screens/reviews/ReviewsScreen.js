import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    RefreshControl,
    Alert,
    ScrollView,
} from "react-native";
import {
    Appbar,
    Card,
    Title,
    Paragraph,
    Button,
    Divider,
    Searchbar,
    Avatar,
    Chip,
} from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SIZES } from "../../constants";
import LoadingScreen from "../common/LoadingScreen";

// This would typically come from an API service
const getReviews = async () => {
    // Simulate API call
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                data: {
                    reviews: [
                        {
                            _id: "1",
                            customerName: "John Doe",
                            rating: 5,
                            comment:
                                "Amazing food and excellent service! Will definitely come back again.",
                            date: "2023-06-15T12:30:00.000Z",
                            reply: null,
                            dishName: "Butter Chicken",
                            orderId: "ORD123456",
                        },
                        {
                            _id: "2",
                            customerName: "Jane Smith",
                            rating: 4,
                            comment:
                                "Food was delicious but took a bit longer to arrive than expected.",
                            date: "2023-06-10T15:45:00.000Z",
                            reply: "Thank you for your feedback. We apologize for the delay and are working to improve our service times.",
                            dishName: "Paneer Tikka",
                            orderId: "ORD123457",
                        },
                        {
                            _id: "3",
                            customerName: "Bob Johnson",
                            rating: 3,
                            comment:
                                "Average experience. Food was okay but nothing special.",
                            date: "2023-05-28T09:15:00.000Z",
                            reply: null,
                            dishName: "Vegetable Biryani",
                            orderId: "ORD123458",
                        },
                    ],
                },
            });
        }, 1000);
    });
};

const ReviewsScreen = ({ navigation }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredReviews, setFilteredReviews] = useState([]);
    const [activeFilter, setActiveFilter] = useState("all");

    useEffect(() => {
        fetchReviews();
    }, []);

    useEffect(() => {
        filterReviews();
    }, [reviews, searchQuery, activeFilter]);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await getReviews();

            if (response && response.data && response.data.reviews) {
                setReviews(response.data.reviews);
            } else {
                setReviews([]);
            }
        } catch (err) {
            setError(err.message || "Failed to load reviews");
            console.error("Error fetching reviews:", err);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchReviews();
        setRefreshing(false);
    };

    const filterReviews = () => {
        let filtered = [...reviews];

        // Filter by rating
        if (activeFilter !== "all") {
            const rating = parseInt(activeFilter);
            filtered = filtered.filter((review) => review.rating === rating);
        }

        // Filter by search query
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (review) =>
                    review.customerName.toLowerCase().includes(query) ||
                    review.comment.toLowerCase().includes(query) ||
                    review.dishName.toLowerCase().includes(query)
            );
        }

        setFilteredReviews(filtered);
    };

    const handleReply = (reviewId) => {
        Alert.prompt(
            "Reply to Review",
            "Enter your response to the customer:",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Submit",
                    onPress: (text) => {
                        if (text && text.trim()) {
                            // This would typically be an API call
                            // const response = await replyToReview(reviewId, text);

                            // For now, update the local state
                            setReviews(
                                reviews.map((review) =>
                                    review._id === reviewId
                                        ? { ...review, reply: text }
                                        : review
                                )
                            );

                            Alert.alert(
                                "Success",
                                "Reply submitted successfully"
                            );
                        }
                    },
                },
            ],
            "plain-text"
        );
    };

    const renderRatingStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <Ionicons
                    key={i}
                    name={i <= rating ? "star" : "star-outline"}
                    size={16}
                    color={i <= rating ? COLORS.warning : COLORS.gray}
                    style={styles.starIcon}
                />
            );
        }
        return <View style={styles.ratingContainer}>{stars}</View>;
    };

    const renderReviewItem = ({ item }) => (
        <Card style={styles.card}>
            <Card.Content>
                <View style={styles.reviewHeader}>
                    <View style={styles.customerInfo}>
                        <Avatar.Text
                            size={40}
                            label={item.customerName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            backgroundColor={COLORS.primary}
                        />
                        <View style={styles.customerDetails}>
                            <Title style={styles.customerName}>
                                {item.customerName}
                            </Title>
                            {renderRatingStars(item.rating)}
                        </View>
                    </View>
                    <Text style={styles.reviewDate}>
                        {new Date(item.date).toLocaleDateString()}
                    </Text>
                </View>

                <View style={styles.dishInfo}>
                    <Chip icon="food" style={styles.dishChip}>
                        {item.dishName}
                    </Chip>
                    <Chip icon="receipt" style={styles.orderChip}>
                        {item.orderId}
                    </Chip>
                </View>

                <Paragraph style={styles.reviewComment}>
                    {item.comment}
                </Paragraph>

                {item.reply && (
                    <View style={styles.replyContainer}>
                        <Text style={styles.replyLabel}>Your Reply:</Text>
                        <Paragraph style={styles.replyText}>
                            {item.reply}
                        </Paragraph>
                    </View>
                )}
            </Card.Content>

            <Card.Actions style={styles.cardActions}>
                {!item.reply && (
                    <Button
                        mode="contained"
                        onPress={() => handleReply(item._id)}
                        style={styles.replyButton}
                        icon="reply"
                    >
                        Reply
                    </Button>
                )}
                {item.reply && (
                    <Button
                        mode="outlined"
                        onPress={() => handleReply(item._id)}
                        style={styles.editReplyButton}
                        icon="pencil"
                    >
                        Edit Reply
                    </Button>
                )}
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
                <Appbar.Content title="Reviews" />
                <Appbar.Action icon="refresh" onPress={onRefresh} />
            </Appbar.Header>

            <View style={styles.searchContainer}>
                <Searchbar
                    placeholder="Search reviews..."
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                    style={styles.searchbar}
                />
            </View>

            <View style={styles.filterContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <Chip
                        selected={activeFilter === "all"}
                        onPress={() => setActiveFilter("all")}
                        style={[
                            styles.filterChip,
                            activeFilter === "all" && styles.activeFilterChip,
                        ]}
                        textStyle={
                            activeFilter === "all" && styles.activeFilterText
                        }
                    >
                        All
                    </Chip>
                    <Chip
                        selected={activeFilter === "5"}
                        onPress={() => setActiveFilter("5")}
                        style={[
                            styles.filterChip,
                            activeFilter === "5" && styles.activeFilterChip,
                        ]}
                        textStyle={
                            activeFilter === "5" && styles.activeFilterText
                        }
                    >
                        5 Stars
                    </Chip>
                    <Chip
                        selected={activeFilter === "4"}
                        onPress={() => setActiveFilter("4")}
                        style={[
                            styles.filterChip,
                            activeFilter === "4" && styles.activeFilterChip,
                        ]}
                        textStyle={
                            activeFilter === "4" && styles.activeFilterText
                        }
                    >
                        4 Stars
                    </Chip>
                    <Chip
                        selected={activeFilter === "3"}
                        onPress={() => setActiveFilter("3")}
                        style={[
                            styles.filterChip,
                            activeFilter === "3" && styles.activeFilterChip,
                        ]}
                        textStyle={
                            activeFilter === "3" && styles.activeFilterText
                        }
                    >
                        3 Stars
                    </Chip>
                    <Chip
                        selected={activeFilter === "2"}
                        onPress={() => setActiveFilter("2")}
                        style={[
                            styles.filterChip,
                            activeFilter === "2" && styles.activeFilterChip,
                        ]}
                        textStyle={
                            activeFilter === "2" && styles.activeFilterText
                        }
                    >
                        2 Stars
                    </Chip>
                    <Chip
                        selected={activeFilter === "1"}
                        onPress={() => setActiveFilter("1")}
                        style={[
                            styles.filterChip,
                            activeFilter === "1" && styles.activeFilterChip,
                        ]}
                        textStyle={
                            activeFilter === "1" && styles.activeFilterText
                        }
                    >
                        1 Star
                    </Chip>
                </ScrollView>
            </View>

            {error && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            )}

            <FlatList
                data={filteredReviews}
                keyExtractor={(item) => item._id}
                renderItem={renderReviewItem}
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
                            name="star-outline"
                            size={64}
                            color={COLORS.lightGray}
                        />
                        <Text style={styles.emptyText}>No reviews found</Text>
                    </View>
                }
            />
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
    searchContainer: {
        padding: SIZES.medium,
        backgroundColor: COLORS.white,
    },
    searchbar: {
        elevation: 0,
        backgroundColor: COLORS.background,
    },
    filterContainer: {
        backgroundColor: COLORS.white,
        paddingHorizontal: SIZES.medium,
        paddingBottom: SIZES.medium,
    },
    filterChip: {
        marginRight: SIZES.base,
        backgroundColor: COLORS.lightGray,
    },
    activeFilterChip: {
        backgroundColor: COLORS.primary,
    },
    activeFilterText: {
        color: COLORS.white,
    },
    listContent: {
        padding: SIZES.medium,
        paddingBottom: SIZES.extraLarge,
    },
    card: {
        marginBottom: SIZES.medium,
    },
    reviewHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
    },
    customerInfo: {
        flexDirection: "row",
        alignItems: "center",
    },
    customerDetails: {
        marginLeft: SIZES.base,
    },
    customerName: {
        fontSize: SIZES.medium,
        fontWeight: "bold",
    },
    reviewDate: {
        fontSize: SIZES.small,
        color: COLORS.gray,
    },
    ratingContainer: {
        flexDirection: "row",
        marginTop: SIZES.base / 2,
    },
    starIcon: {
        marginRight: 2,
    },
    dishInfo: {
        flexDirection: "row",
        marginVertical: SIZES.base,
    },
    dishChip: {
        marginRight: SIZES.base,
        backgroundColor: COLORS.lightGray,
    },
    orderChip: {
        backgroundColor: COLORS.lightGray,
    },
    reviewComment: {
        marginVertical: SIZES.base,
        fontSize: SIZES.font,
    },
    replyContainer: {
        backgroundColor: COLORS.lightGray,
        padding: SIZES.medium,
        borderRadius: SIZES.base,
        marginTop: SIZES.base,
    },
    replyLabel: {
        fontWeight: "bold",
        marginBottom: SIZES.base / 2,
        color: COLORS.primary,
    },
    replyText: {
        fontSize: SIZES.small,
    },
    cardActions: {
        justifyContent: "flex-end",
    },
    replyButton: {
        backgroundColor: COLORS.primary,
    },
    editReplyButton: {
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
    },
    errorContainer: {
        padding: SIZES.medium,
        backgroundColor: COLORS.error,
    },
    errorText: {
        color: COLORS.white,
        textAlign: "center",
    },
});

export default ReviewsScreen;
