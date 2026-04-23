import DevelopmentForm from "./DevelopmentForm";
import StartProcessHeader from "@/components/common/AppStartProcessHeader";

export default function DevelopmentStartPageComponent() {
  return (
    <>
      <StartProcessHeader title="ثبت تیکت توسعه" />
      <div className="flex gap-x-4 items-start justify-center">
        <DevelopmentForm />
      </div>
    </>
  );
}
