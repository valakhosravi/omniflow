import { Icon } from "@/ui/Icon";

interface BookmarkIconProps {
  isBookmarked: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export default function BookmarkIcon({
  isBookmarked,
  onClick,
  disabled = false,
}: BookmarkIconProps) {
  return (
    <Icon
      name="star"
      className={`cursor-pointer transition-colors duration-300 ${
        isBookmarked
          ? "fill-rate stroke-rate"
          : "stroke-secondary-300 hover:stroke-rate fill-white hover:fill-rate"
      } ${disabled ? "opacity-50 pointer-events-none" : ""}`}
      onClick={onClick}
    />
  );
}
