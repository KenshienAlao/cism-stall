import { apiClient } from "@/config/api.config";
import { API_ENDPOINTS } from "@/config/app.config";
import { ApiResponse } from "@/lib/api";
import { formData } from "@/lib/formdata";
import { ItemRequest } from "@/model/item.model";

export const SnackService = {
  createSnack(entity: Readonly<ItemRequest>): Promise<ApiResponse<void>> {
    return apiClient.postForm<void>(API_ENDPOINTS.SNACK.CREATE, formData(entity));
  },
  updateSnack(id: number, entity: Readonly<ItemRequest> ): Promise<ApiResponse<void>> {
    return apiClient.putForm<void>(API_ENDPOINTS.SNACK.UPDATE + id, formData(entity));
  },
  deleteSnack(id: number): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(API_ENDPOINTS.SNACK.DELETE + id);
  },
};
