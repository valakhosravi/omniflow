import { Spinner, SpinnerProps } from "@heroui/react";

interface LoadingProps {
  width?: number | string;
}

const Loading = (spinnerProps: SpinnerProps) => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      {/* <div className="loader" style={{ width }}></div> */}
      <Spinner {...spinnerProps} color="primary" />
    </div>
  );
};
export default Loading;
