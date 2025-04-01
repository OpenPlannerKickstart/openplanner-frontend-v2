import * as React from "react";
import toast from "react-hot-toast";
// success

export const ts = (message: any, isCustom?: boolean, position?: any) => {
  if (isCustom) {
    toast.custom(
      <div className="bg-white border-l-4 border-indigo-500 text-sm pt-3 pb-3 pl-4 pr-4 capitalize rounded text-black shadow-2xl">
        {message}
      </div>,
      {
        position: position ? position : "bottom-left",
      }
    );
  } else {
    toast.success(message);
  }
};

// error

export const te = (message: any) => {
  toast.error(message);
};
