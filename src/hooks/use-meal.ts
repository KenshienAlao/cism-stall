import { notifyError, notifySuccess } from "@/lib/toast";
import { ItemRequest } from "@/model/item.model";
import { MealService } from "@/service/meal.service";
import { ProfileService } from "@/service/profile.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const MEAL_QUERY_KEY = ["profile"];

export function useMeal() {
  const queryClient = useQueryClient();

  const profileQuery = useQuery({
    queryKey: MEAL_QUERY_KEY,
    queryFn: async () => {
      const res = await ProfileService.getProfile();
      if (!res.success) throw new Error(res.message);
      return res.data;
    },
    retry: false,
    refetchOnWindowFocus: true,
  });

  // create meal
  const createMealMutation = useMutation({
    mutationFn: (data: ItemRequest) => MealService.createMeal(data),
    onSuccess: res => {
      if (res.success) {
        notifySuccess("Meal created successfully");
        queryClient.invalidateQueries({ queryKey: MEAL_QUERY_KEY });
      } else {
        notifyError(res.message);
      }
    },
    onError: (err: any) => {
      notifyError(err.message || "Failed to create meal");
    },
  });

  // update meal

  const updateMealMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: ItemRequest }) =>
      MealService.updateMeal(id, data),
    onSuccess: res => {
      if (res.success) {
        notifySuccess("Meal updated successfully");
        queryClient.invalidateQueries({ queryKey: MEAL_QUERY_KEY });
      } else {
        notifyError(res.message);
      }
    },
    onError: (err: any) => {
      notifyError(err.message || "Failed to update meal");
    },
  });

  // delete meal

  const deleteMealMutation = useMutation({
    mutationFn: (id: number) => MealService.deleteMeal(id),
    onSuccess: res => {
      if (res.success) {
        notifySuccess("Meal deleted successfully");
        queryClient.invalidateQueries({ queryKey: MEAL_QUERY_KEY });
      } else {
        notifyError(res.message);
      }
    },
    onError: (err: any) => {
      notifyError(err.message || "Failed to delete meal");
    },
  });
  return {
    meals: profileQuery.data?.meals || [],
    isLoading: profileQuery.isLoading,
    isError: profileQuery.isError,
    error: profileQuery.error,
    createMeal: createMealMutation.mutate,
    isCreating: createMealMutation.isPending,
    updateMeal: updateMealMutation.mutate,
    isUpdating: updateMealMutation.isPending,
    deleteMeal: deleteMealMutation.mutate,
    isDeleting: deleteMealMutation.isPending,
  };
}
