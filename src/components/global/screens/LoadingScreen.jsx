import { Box, CircularProgress } from "@mui/material";
import React from "react";

function LoadingScreen() {
  return (
    <>
      <Box
        height="80%"
        width="100%"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <CircularProgress size="6em" />
      </Box>
    </>
  );
}

export default LoadingScreen;
