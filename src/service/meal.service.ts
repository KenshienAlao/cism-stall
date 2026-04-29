import { apiClient } from "@/config/api.config";
import { API_ENDPOINTS } from "@/config/app.config";
import { ApiResponse } from "@/lib/api";
import { formData } from "@/lib/formdata";
import { ItemRequest } from "@/model/item.model";

export const MealService = {
  createMeal(entity: Readonly<ItemRequest>): Promise<ApiResponse<void>> {
    return apiClient.postForm<void>(API_ENDPOINTS.MEAL.CREATE, formData(entity));
  },
  updateMeal(id: number, entity: Readonly<ItemRequest>): Promise<ApiResponse<void>> {
    return apiClient.putForm<void>(API_ENDPOINTS.MEAL.UPDATE + id, formData(entity));
  },

  deleteMeal(id: number): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(API_ENDPOINTS.MEAL.DELETE + id);
  },
};
