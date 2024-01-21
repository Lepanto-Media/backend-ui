import { Snackbar } from "@mui/material";
import React, { useEffect } from "react";

function Toast({ data, setState }) {
  const handleClose = () => {
    setState({ ...data, visible: false, message: "" });
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleClose();
    }, 5000);
    return () => clearTimeout(timeoutId);
  }, []);

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
