import React from "react";

const TopLoadingBar = () => {
  return (
    <div className="fixed w-[10rem] mx-auto top-0 left-0 right-0 flex items-center justify-center bg-yellow-200 h-8 shadow-md z-50">
      <span className="text-sm text-gray-700">Loading...</span>
    </div>
  );
};

export default TopLoadingBar;
