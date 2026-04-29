import { apiClient } from "@/config/api.config";
import { API_ENDPOINTS } from "@/config/app.config";
import { ApiResponse } from "@/lib/api";
import { LoginRequest, LoginResponse } from "@/model/login.model";

export const AuthService = {
  loginStall(
    entity: Readonly<LoginRequest>
  ): Promise<ApiResponse<LoginResponse>> {
    return apiClient.post<LoginResponse>(API_ENDPOINTS.STALL.LOGIN, entity);
  },

  validateCookie(): Promise<ApiResponse<string>> {
    return apiClient.get<string>(API_ENDPOINTS.AUTH.VALIDATE_COOKIE);
  },
};
