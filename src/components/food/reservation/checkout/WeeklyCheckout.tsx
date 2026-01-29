"use client";

import { useState } from "react";
import WeeklyReservations from "./WeeklyReservations";
import OrderSummary from "./OrderSummary";
import { useGetOrderById } from "@/hooks/food/useOrderAction";
import Loading from "@/ui/Loading";
import { calculateOrderSummary } from "@/utils/calculateMealDiscounts";

interface WeeklyCheckoutProps {
  orderId: string;
}

export default function WeeklyCheckout({ orderId }: WeeklyCheckoutProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const { orderDataById, isGettingById } = useGetOrderById(
    parseInt(orderId, 10)
  );

  const handleProceedToPayment = () => {
    setIsProcessing(true);
    // Handle payment logic here
    setTimeout(() => {
      setIsProcessing(false);
      // Navigate to payment page or show success
    }, 2000);
  };

  const handleModifySelections = () => {
    // Navigate back to reservation page
    window.history.back();
  };

  const handlePreview = () => {
    // Handle preview logic
    console.log("Preview clicked");
  };

  if (!orderId) {
    return <div>Invalid order ID.</div>;
  }

  if (isGettingById) {
    return <Loading />;
  }

  if (!orderDataById?.Data) {
    return <div>Order not found.</div>;
  }

  const orderData = orderDataById.Data;
  
  // Calculate order summary and meal discounts using shared utility
  const { summary: orderSummary, mealDiscounts } = calculateOrderSummary(
    orderData.DailyMealDetails
  );

  return (
    <div className="min-h-screen bg-background-app py-8">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Weekly Reservations - Left Section */}
          <div className="lg:col-span-2">
            <WeeklyReservations
              reservations={orderData?.DailyMealDetails ?? []}
              mealDiscounts={mealDiscounts}
            />
          </div>

          {/* Order Summary - Right Section */}
          <div className="lg:col-span-1">
            <OrderSummary
              id={orderId.toString()}
              orderSummary={orderSummary}
              onProceedToPayment={handleProceedToPayment}
              onModifySelections={handleModifySelections}
              isProcessing={isProcessing}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
