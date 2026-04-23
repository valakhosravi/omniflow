interface FoodBadgeProps {
  MealName: string;
  varient?: "Green" | "Orange" | "Purple";
}

const variantClasses = {
  Green: {
    bar: "bg-badge-green-primary",
    bg: "bg-badge-green",
  },
  Orange: {
    bar: "bg-badge-orange-primary",
    bg: "bg-badge-orange",
  },
  Purple: {
    bar: "bg-badge-purple-primary",
    bg: "bg-badge-purple",
  },
};

export default function FoodBadge({
  MealName,
  varient = "Green",
}: FoodBadgeProps) {
  const { bar, bg } = variantClasses[varient];

  return (
    <div className="flex items-center">
      <div className={`w-0.5 h-6 ${bar}`}></div>
      <span
        className={`${bg} rounded-l-[4px] px-2.5 py-[3px]
      font-medium text-[12px]/[18px]`}
      >
        {MealName}
      </span>
    </div>
  );
}
