import React from "react";
import { CircleLoader } from "react-spinners";

const LoadingSpinner = () => {
  return (
    <div className="flex min-h-[200px] items-center justify-center">
      <CircleLoader color="#024a71" />
    </div>
  );
};

export default LoadingSpinner;
