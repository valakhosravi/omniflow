import { AppIcon } from "@/components/common/AppIcon";

interface AppNoAccessProps {
  message?: string;
}

export const AppNoAccess: React.FC<AppNoAccessProps> = ({
  message = "عدم دسترسی",
}) => {
  return (
    <div className="flex h-full w-full flex-1 flex-col items-center justify-center bg-white">
      <div className="rounded-full bg-red-50 p-5">
        <AppIcon
          name="ShieldCross"
          size={64}
          variant="Bulk"
          color="#ef4444"
        />
      </div>

      <h1 className="mt-6 text-xl font-semibold text-gray-800">{message}</h1>
      <p className="mt-2 text-sm text-gray-400">
        شما اجازه دسترسی به این صفحه را ندارید
      </p>
    </div>
  );
};
