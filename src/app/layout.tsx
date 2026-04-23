/* eslint-disable @next/next/no-css-tags */
import type { Metadata } from "next";
import "@/styles/globals.css";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import ToasterProvider from "@/providers/ToasterProvider";
import { WeeklyDataProvider } from "@/context/WeeklyDataContext";
import { FoodDataProvider } from "@/context/FoodDataContext";
import { PlanProvider } from "@/context/EditPlanDataContext";
import ReduxProvider from "@/providers/ReduxProvider";

export const metadata: Metadata = {
  title: "TIKA",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <head>
        <link href="/fonts/iranYekan/fontiran.css" rel="stylesheet" />
      </head>

      <body className={`min-h-screen`}>
        <ToasterProvider>
          <ReduxProvider>
            <ReactQueryProvider>
              <WeeklyDataProvider>
                <FoodDataProvider>
                  <PlanProvider>{children}</PlanProvider>
                </FoodDataProvider>
              </WeeklyDataProvider>
            </ReactQueryProvider>
          </ReduxProvider>
        </ToasterProvider>
      </body>
    </html>
  );
}
