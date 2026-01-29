import { Chip } from "@/ui/NextUi";
interface ChipProps {
  color: "default" | "primary" | "secondary" | "success" | "warning" | "danger";
  label: string;
}

export default function ChipNUi({ color, label }: ChipProps) {
  return (
    <div className="flex gap-4">
      <Chip color={color}>{label}</Chip>
    </div>
  );
}
