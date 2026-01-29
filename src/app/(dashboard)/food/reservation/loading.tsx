interface LoadingProps {
  width?: number | string;
}

const Loading = ({ width = 60 }: LoadingProps) => {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="loader" style={{ width }}></div>
    </div>
  );
};
export default Loading;
