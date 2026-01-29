"use client";

import useMoveBack from "@/hooks/useMoveBack";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

function NotFound() {
  const moveBack = useMoveBack();
  return (
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <div className="container xl:max-w-screen-xl">
        <div className="flex justify-center pt-10">
          <div className="flex flex-col items-start gap-y-4">
            <button
              onClick={moveBack}
              className="flex items-center gap-x-2 text-secondary-500 cursor-pointer"
            >
              <ArrowRightIcon className="w-6 h-6 text-primary-900" />
              <span> برگشت</span>
            </button>
            <h1 className="text-xl font-bold text-secondary-700">
              صفحه ای که دنبالش بودید، پیدا نشد
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}
export default NotFound;
