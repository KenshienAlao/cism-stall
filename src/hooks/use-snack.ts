import { notifyError, notifySuccess } from "@/lib/toast";
import { ItemRequest } from "@/model/item.model";
import { ProfileService } from "@/service/profile.service";
import { SnackService } from "@/service/snack.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const SNACK_QUERY_KEY = ["profile"];

export function useSnack() {
  const queryClient = useQueryClient();

  const profileQuery = useQuery({
    queryKey: SNACK_QUERY_KEY,
    queryFn: async () => {
      const res = await ProfileService.getProfile();
      if (!res.success) throw new Error(res.message);
      return res.data;
    },
    retry: false,
    refetchOnWindowFocus: true,
  });

  // create snack
  const createSnackMutation = useMutation({
    mutationFn: (data: ItemRequest) => SnackService.createSnack(data),
    onSuccess: res => {
      if (res.success) {
        notifySuccess("Snack created successfully");
        queryClient.invalidateQueries({ queryKey: SNACK_QUERY_KEY });
      } else {
        notifyError(res.message);
      }
    },
    onError: (err: any) => {
      notifyError(err.message || "Failed to create snack");
    },
  });

  // update snack
  const updateSnackMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: ItemRequest }) =>
      SnackService.updateSnack(id, data),
    onSuccess: res => {
      if (res.success) {
        notifySuccess("Snack updated successfully");
        queryClient.invalidateQueries({ queryKey: SNACK_QUERY_KEY });
      } else {
        notifyError(res.message);
      }
    },
    onError: (err: any) => {
      notifyError(err.message || "Failed to update snack");
    },
  });

  // delete snack
  const deleteSnackMutation = useMutation({
    mutationFn: (id: number) => SnackService.deleteSnack(id),
    onSuccess: res => {
      if (res.success) {
        notifySuccess("Snack deleted successfully");
        queryClient.invalidateQueries({ queryKey: SNACK_QUERY_KEY });
      } else {
        notifyError(res.message);
      }
    },
    onError: (err: any) => {
      notifyError(err.message || "Failed to delete snack");
    },
  });

  return {
    snacks: profileQuery.data?.snacks || [],
    isLoading: profileQuery.isLoading,
    isError: profileQuery.isError,
    error: profileQuery.error,
    createSnack: createSnackMutation.mutate,
    isCreating: createSnackMutation.isPending,
    updateSnack: updateSnackMutation.mutate,
    isUpdating: updateSnackMutation.isPending,
    deleteSnack: deleteSnackMutation.mutate,
    isDeleting: deleteSnackMutation.isPending,
  };
}
