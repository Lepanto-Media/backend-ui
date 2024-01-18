import { Box, Typography, useTheme } from "@mui/material";
import React from "react";
import { tokens } from "../../theme";

function Header({ title, subtitle }) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box mb="30px">
      <Typography
        variant="h2"
        color={colors.blueAccent[600]}
        fontWeight="bold"
        sx={{ mb: "5px" }}
        textTransform="uppercase"
      >
        {title}
      </Typography>
      <Typography variant="h5" color={colors.blueAccent[400]} fontWeight="bold">
        {subtitle}
      </Typography>
    </Box>
  );
}

export default Header;
