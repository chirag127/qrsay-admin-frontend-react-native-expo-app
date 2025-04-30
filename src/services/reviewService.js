import api from "./api";
import { API_ENDPOINTS } from "../constants";

/**
 * Fetches all reviews from the API
 * @returns {Promise<Object>} Promise that resolves to the reviews data
 */
export const getReviews = async () => {
    try {
        const response = await api.get(API_ENDPOINTS.GET_REVIEWS);
        return response.data;
    } catch (error) {
        console.error("Error fetching reviews:", error);
        throw error;
    }
};

/**
 * Adds a reply to a review
 * @param {Object} replyData - The reply data including reviewId and replyText
 * @returns {Promise<Object>} Promise that resolves to the response data
 */
export const replyToReview = async (replyData) => {
    try {
        const response = await api.post(API_ENDPOINTS.REPLY_TO_REVIEW, replyData);
        return response.data;
    } catch (error) {
        console.error("Error replying to review:", error);
        throw error;
    }
};
