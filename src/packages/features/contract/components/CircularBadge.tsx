import { Icon } from "@/ui/Icon";
import { TickCircle } from "iconsax-reactjs";

interface CircularBadgeProps {
  label: string;
  content: string;
  active?: boolean;
}

export default function CircularBadge({
  content,
  label,
  active = false,
}: CircularBadgeProps) {
  return (
    <div className="relative flex flex-col items-center">
      <div
        className={`size-8 flex items-center justify-center rounded-full 
        text-primary-950 font-semibold text-[12px]/[18px]
        ${
          active
            ? "bg-primary-950/[.2] text-white"
            : "bg-primary-950/[.3] text-primary-950"
        }`}
      >
        <div
          className={`rounded-full size-6 flex items-center justify-center
            ${active ? "bg-primary-950 text-white" : "bg-secondary-50"}`}
        >
          {active ? <Icon name="tick" /> : content}
        </div>
      </div>
      <p
        className={`mt-10 absolute min-w-[130px] text-center font-medium text-[14px]/[23px] text-primary-950
           ${active ? "text-primary-950" : "text-primary-950/50"}`}
      >
        {label}
      </p>
    </div>
  );
}
