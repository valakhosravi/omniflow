import CircularBadge from "./CircularBadge";


export default function Stepper({
  state,
  className,
}: {
  state: number;
  className?: string;
}) {
  const isActive = (step: number) => step <= state;

  return (
    <div className={className}>
      <div className={`flex items-center justify-center w-full h-full mb-4`}>
        <CircularBadge
          content="01"
          label="انتخاب نوع قرارداد"
          active={isActive(1)}
        />
        <div
          className={`w-[144.67px] h-0.5 bg-primary-950  ${
            isActive(2) ? "bg-primary-950" : "bg-primary-950/20"
          }`}
        />
        <div
          className={`w-[144.67px] h-0.5 bg-primary-950  ${
            isActive(2) ? "bg-primary-950" : "bg-primary-950/20"
          }`}
        />
        <CircularBadge content="2" label="تکمیل قرارداد" active={isActive(2)} />
        <div
          className={`w-[144.67px] h-0.5 ${
            isActive(3) ? "bg-primary-950" : "bg-primary-950/[.2]"
          }`}
        />
        <div
          className={`w-[144.67px] h-0.5 ${
            isActive(3) ? "bg-primary-950" : "bg-primary-950/[.2]"
          }`}
        />
        <CircularBadge
          content="3"
          label="پیش‌نمایش قرارداد"
          active={isActive(3)}
        />
      </div>
    </div>
  );
}
