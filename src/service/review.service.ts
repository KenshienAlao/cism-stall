import { apiClient } from "@/config/api.config";
import { API_ENDPOINTS } from "@/config/app.config";
import { ApiResponse } from "@/lib/api";
import { Review } from "@/model/review.model";

export const reviewService = {
  getAllReview(): Promise<ApiResponse<Review[]>> {
    return apiClient.get(API_ENDPOINTS.REVIEW.GETALL);
  },

  deleteReview(userId: number, reviewId: number): Promise<ApiResponse<void>> {
    return apiClient.delete(
      API_ENDPOINTS.REVIEW.DELETE_REVIEW + userId + "/" + reviewId
    );
  },

  
};
