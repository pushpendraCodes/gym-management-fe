import React from "react";
import { CiSquareRemove } from "react-icons/ci";
import { useDispatch } from "react-redux";


const DeleteModal = ({ setdeleteModalOpen,handelDelete,clickedId}) => {


  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white dark:border-strokedark dark:bg-boxdark  rounded-lg shadow-lg p-6 w-96">
        <div className="flex justify-center mb-4">
          <img
            src="garbage.png"
            alt="Trash Icon"
            className="w-12 h-12"
          />
        </div>
        <h2 className="text-center text-lg font-semibold mb-2">Are you sure you want to delete  <span>{clickedId?.name}</span>?</h2>
        {/* <p className="text-center text-gray-600 mb-4">{fileName}</p> */}
        <div className="flex justify-between space-x-4 mt-8">
          <button
            className="px-8 py-2 border border-gray-500  rounded-md text-gray-700 hover:bg-gray-200"
            onClick={()=>setdeleteModalOpen(false)}
          >
            Cancel
          </button>
          <button
            className="px-8 py-2 bg-red-800 text-white border border-gray-500  rounded-md hover:bg-red-600"
            onClick={handelDelete}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
