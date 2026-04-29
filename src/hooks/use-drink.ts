import { notifyError, notifySuccess } from "@/lib/toast";
import { ItemRequest } from "@/model/item.model";
import { DrinkService } from "@/service/drink.service";
import { ProfileService } from "@/service/profile.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const DRINK_QUERY_KEY = ["profile"];

export function useDrink() {
  const queryClient = useQueryClient();

  const profileQuery = useQuery({
    queryKey: DRINK_QUERY_KEY,
    queryFn: async () => {
      const res = await ProfileService.getProfile();
      if (!res.success) throw new Error(res.message);
      return res.data;
    },
    retry: false,
    refetchOnWindowFocus: true,
  });

  // create drink
  const createDrinkMutation = useMutation({
    mutationFn: (data: ItemRequest) => DrinkService.createDrink(data),
    onSuccess: res => {
      if (res.success) {
        notifySuccess("Drink created successfully");
        queryClient.invalidateQueries({ queryKey: DRINK_QUERY_KEY });
      } else {
        notifyError(res.message);
      }
    },
    onError: (err: any) => {
      notifyError(err.message || "Failed to create drink");
    },
  });

  // update drink
  const updateDrinkMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: ItemRequest }) =>
      DrinkService.updateDrink(id, data),
    onSuccess: res => {
      if (res.success) {
        notifySuccess("Drink updated successfully");
        queryClient.invalidateQueries({ queryKey: DRINK_QUERY_KEY });
      } else {
        notifyError(res.message);
      }
    },
    onError: (err: any) => {
      notifyError(err.message || "Failed to update drink");
    },
  });

  // delete drink
  const deleteDrinkMutation = useMutation({
    mutationFn: (id: number) => DrinkService.deleteDrink(id),
    onSuccess: res => {
      if (res.success) {
        notifySuccess("Drink deleted successfully");
        queryClient.invalidateQueries({ queryKey: DRINK_QUERY_KEY });
      } else {
        notifyError(res.message);
      }
    },
    onError: (err: any) => {
      notifyError(err.message || "Failed to delete drink");
    },
  });

  return {
    drinks: profileQuery.data?.drinks || [],
    isLoading: profileQuery.isLoading,
    isError: profileQuery.isError,
    error: profileQuery.error,
    createDrink: createDrinkMutation.mutate,
    isCreating: createDrinkMutation.isPending,
    updateDrink: updateDrinkMutation.mutate,
    isUpdating: updateDrinkMutation.isPending,
    deleteDrink: deleteDrinkMutation.mutate,
    isDeleting: deleteDrinkMutation.isPending,
  };
}
