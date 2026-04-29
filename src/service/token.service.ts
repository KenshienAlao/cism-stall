import { apiClient } from "@/config/api.config";
import { API_ENDPOINTS } from "@/config/app.config";
import { ApiResponse } from "@/lib/api";

export const tokenService = {
  getRefreshToken(): Promise<ApiResponse<any>> {
    return apiClient.get(API_ENDPOINTS.AUTH.REFRESH_TOKEN);
  },
};
