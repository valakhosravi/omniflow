import { AppIcon } from "@/components/common/AppIcon";

interface AppPermissionLoadingProps {
  message?: string;
}

export const AppPermissionLoading: React.FC<AppPermissionLoadingProps> = ({
  message = "در حال بررسی دسترسی...",
}) => {
  return (
    <div className="flex h-[calc(100vh-208px)] w-full flex-1 flex-col items-center justify-center bg-white">
      <div className="animate-pulse">
        <AppIcon
          name="ShieldSecurity"
          size={64}
          variant="Bulk"
          color="#6366f1"
        />
      </div>

      <p className="mt-4 text-sm font-medium text-gray-500">{message}</p>
    </div>
  );
};
