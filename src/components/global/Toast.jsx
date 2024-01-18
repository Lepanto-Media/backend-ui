import { Snackbar } from "@mui/material";
import React, { useEffect } from "react";

function Toast({ data, setState }) {
  const handleClose = () => {
    setState({ visible: false, message: "" });
  };
  useEffect(() => {
    setTimeout(() => {
      handleClose();
    }, 5000);
  });
  const vertical = "top";
  const horizontal = "right";
  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={data.visible}
        onClose={handleClose}
        message={data.message}
        key={vertical + horizontal}
      />
    </>
  );
}

export default Toast;
