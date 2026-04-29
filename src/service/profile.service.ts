import { apiClient } from "@/config/api.config";
import { API_ENDPOINTS } from "@/config/app.config";
import { ApiResponse } from "@/lib/api";
import { Profile } from "@/model/profile.model";

export const ProfileService = {
  getProfile(): Promise<ApiResponse<Profile>> {
    return apiClient.get<Profile>(API_ENDPOINTS.STALL.PROFILE);
  },
};
