import React from "react";

const Pagination = ({handelprev,handelnext}) => {
  return (
    <div className="flex justify-between p-5">
      <button onClick={handelprev} className="">
        <div className="w-9 h-9 rounded-full shrink-0 bg-red-500 my-2 mr-3">
          <svg
            className="w-9 h-9 fill-current text-white"
            viewBox="0 0 36 36">
            <path d="M17.7 24.7l1.4-1.4-4.3-4.3H25v-2H14.8l4.3-4.3-1.4-1.4L11 18z" />
          </svg>
        </div>
      </button>
      <button onClick={handelnext} className="">
        <div className="w-9 h-9 rounded-full shrink-0 bg-green-500 my-2 mr-3">
          <svg
            className="w-9 h-9 fill-current text-white"
            viewBox="0 0 36 36">
            <path d="M18.3 11.3l-1.4 1.4 4.3 4.3H11v2h10.2l-4.3 4.3 1.4 1.4L25 18z" />
          </svg>
        </div>
      </button>
    </div>
  );
};

export default Pagination;
