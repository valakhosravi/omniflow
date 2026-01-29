import { useCreateFeedback } from "@/hooks/food/useFeedbackAction";
import Rating from "@/ui/Rating";
import React, { useEffect, useState } from "react";

interface rateProps {
  mealType: string;
  mealId: number;
  dailyMealId: number;
  rate: number;
}

export default function Rate({
  mealType,
  mealId,
  rate,
  dailyMealId,
}: rateProps) {
  const { createFeedback, isCreating } = useCreateFeedback();
  const [ratingNumber, setRatingNumber] = useState<number>(0);
  const [hasRated, setHasRated] = useState(false);

  useEffect(() => {
    if (rate) {
      setRatingNumber(rate);
      setHasRated(true);
    }
  }, [rate]);

  const handleRateChange = (val: number) => {
    if (isCreating) return;
    setRatingNumber(val);
    createFeedback(
      {
        MealId: mealId,
        DailyMealId: dailyMealId,
        Message: "",
        Rating: val,
      },
      {
        onSuccess: () => {
          setHasRated(true);
        },
      }
    );
  };

  return (
    <div>
      {mealType === "1" && (
        <Rating
          value={ratingNumber}
          onChange={handleRateChange}
          readonly={hasRated}
        />
      )}
    </div>
  );
}
