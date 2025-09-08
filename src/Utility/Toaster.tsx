import * as React from "react";
import toast from "react-hot-toast";
// success
export const ts = (message: any, isCustom?: boolean, position?: any) => {
  if (isCustom) {
    toast.custom(
      <div className="noti-tos text-sm py-3 px-3 capitalize rounded text-black shadow-2xl">
        {message}
      </div>,
      {
        position: position ? position : "bottom-right",
        // duration: Infinity,
        // className: "my-toast-container", // Custom class for container
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
