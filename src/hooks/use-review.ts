import { reviewService } from "@/service/review.service";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notifyError, notifySuccess } from "@/lib/toast";

export const REVIEW_QUERY_KEY = ["reviews"];

export function useReview() {
  const queryClient = useQueryClient();

  const reviewsQuery = useQuery({
    queryKey: REVIEW_QUERY_KEY,
    queryFn: async () => {
      const res = await reviewService.getAllReview();
      if (!res.success) throw new Error(res.message);
      return res.data;
    },
    retry: false,
    refetchOnWindowFocus: true,
  });

  const deleteReviewMutation = useMutation({
    mutationFn: ({ userId, reviewId }: { userId: number; reviewId: number }) =>
      reviewService.deleteReview(userId, reviewId),
    onSuccess: res => {
      if (res.success) {
        notifySuccess("Review deleted successfully");
        queryClient.invalidateQueries({ queryKey: REVIEW_QUERY_KEY });
      } else {
        notifyError(res.message);
      }
    },
    onError: (err: any) => {
      notifyError(err.message || "Failed to delete review");
    },
  });

  return {
    reviews: reviewsQuery.data || [],
    isLoading: reviewsQuery.isLoading,
    isError: reviewsQuery.isError,
    error: reviewsQuery.error,
    deleteReview: deleteReviewMutation.mutate,
    isDeleting: deleteReviewMutation.isPending,
  };
}
