import { Icon } from "@/ui/Icon";
import { Radio } from "@/ui/NextUi";

interface RadioItemProps {
  title: string;
  description: string;
  value: string;
  ratio: number;
  subDescription: string;
}

export default function RadioItem({
  title,
  description,
  value,
  ratio,
  subDescription,
}: RadioItemProps) {
  return (
    <Radio
      classNames={{
        base: `border border-secondary-200 px-[12px] py-[16px] rounded-[20px] data-[selected=true]:border-primary-950/[.6]
        data-[selected=true]:ring-primary-950/[.1] data-[selected=true]:ring-3 min-w-[324px] min-h-[88px] m-0`,
        wrapper: "order-1 absolute left-[12px] top-[16px]",
        control: "bg-primary-950 border-primary-950",
      }}
      value={value}
    >
      <div className="flex items-center gap-x-2">
        <div
          className="bg-primary-950/[.05] size-[56px] flex items-center justify-center
      border border-primary-950/[.05] rounded-[20px]"
        >
          <span
            className={`rounded-[20px] w-[20px] h-[20px] rotate-45 
            ${ratio === 0.25 ? "border-4 border-gray-300 border-t-primary-950" : ""}
            ${ratio === 0.5 ? "border-4 border-gray-300 border-t-primary-950 border-r-primary-950" : ""}
            ${ratio === 0.75 ? "border-4 border-gray-300 border-t-primary-950 border-r-primary-950 border-b-primary-950" : ""}
            ${ratio === 1 ? "border-4 border-primary-950" : ""}
          `}
          ></span>
        </div>
        <div className="space-y-[1px] flex flex-col">
          <span className="text-primary-950 font-semibold text-[14px]/[35px]">
            {title}
          </span>
          <span className="text-secondary-400 font-medium text-[12px]/[22px]">
            {description}
          </span>
          <span className="text-secondary-400 font-medium text-[12px]/[22px]">
            {subDescription}
          </span>
        </div>
      </div>
    </Radio>
  );
}
