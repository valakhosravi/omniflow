"use client";
import { useState } from "react";
import { Icon } from "./Icon";

interface RatingProps {
  max?: number;
  value?: number;
  onChange?: (val: number) => void;
  size?: number;
  readonly?: boolean;
  className?: string;
}

export default function Rating({
  max = 5,
  value = 0,
  onChange,
  size = 24,
  readonly = false,
  className = "",
}: RatingProps) {
  const [hovered, setHovered] = useState<number | null>(null);

  const handleClick = (index: number) => {
    if (onChange) {
      onChange(index);
    }
  };

  return (
    <div className="flex gap-1 justify-end w-full" dir="ltr">
      {Array.from({ length: max }, (_, i) => {
        const index = i + 1;
        const filled = hovered !== null ? index <= hovered : index <= value;

        return (
          <div key={index}>
            {
              <Icon
                key={index}
                name="star"
                size={size}
                className={`${className} cursor-pointer transition-all ${
                  filled
                    ? "fill-yellow-400 stroke-yellow-400"
                    : "stroke-gray-300 fill-gray-300"
                }`}
                onMouseEnter={() => setHovered(index)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => handleClick(index)}
              />
            }
          </div>
        );
      })}
    </div>
  );
}
