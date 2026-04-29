import { apiClient } from "@/config/api.config";
import { API_ENDPOINTS } from "@/config/app.config";
import { ApiResponse } from "@/lib/api";
import { formData } from "@/lib/formdata";
import { ItemRequest } from "@/model/item.model";

export const DrinkService = {
  createDrink(entity: Readonly<ItemRequest>): Promise<ApiResponse<void>> {
    return apiClient.postForm<void>(API_ENDPOINTS.DRINK.CREATE, formData(entity));
  },
  updateDrink(id: number, entity: Readonly<ItemRequest>): Promise<ApiResponse<void>> {
    return apiClient.putForm<void>(API_ENDPOINTS.DRINK.UPDATE + id, formData(entity));
  },

  deleteDrink(id: number): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(API_ENDPOINTS.DRINK.DELETE + id);
  },
};
