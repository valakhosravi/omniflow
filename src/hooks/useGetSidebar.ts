import { useAuth } from "@/packages/auth/hooks/useAuth";
import { getSidebarApi } from "@/services/sidebarService";
import { useGuardedQuery } from "./useGuardedQuery";

export default function useGetSidebar() {
  const { userDetail } = useAuth();
  const PersonnelId = userDetail?.UserDetail.PersonnelId;
  const hasRequiredService = userDetail?.ServiceIds.includes(1000);

  const { data: menuData, isLoading } = useGuardedQuery({
    queryFn: getSidebarApi,
    queryKey: ["sidebar", PersonnelId],
    enabled: !!userDetail && hasRequiredService && PersonnelId !== null,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return { menuData, isLoading };
}
