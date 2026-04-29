import { useQuery } from "@tanstack/react-query";
import { ProfileService } from "@/service/profile.service";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function useAuth() {
  const router = useRouter();

  const profileQuery = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await ProfileService.getProfile();
      if (!res.success) throw new Error(res.message);
      return res.data;
    },
    retry: false,
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    if (profileQuery.isError) {
      router.push("/login");
    }
  }, [profileQuery.isError, router]);

  return {
    profile: profileQuery.data,
    isLoading: profileQuery.isLoading,
    isError: profileQuery.isError,
    isAuthenticated: !!profileQuery.data,
  };
}
