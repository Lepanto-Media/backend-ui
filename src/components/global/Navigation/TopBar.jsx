import React, { useContext } from "react";
import { IconButton, useTheme, Box, Menu, MenuItem } from "@mui/material";
import { ColorModeContext, tokens } from "../../../theme";

import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import { AUTH_TOKEN } from "../constants";
import { useNavigate } from "react-router-dom";

function TopBar() {
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

  // Menu
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = () => {
    localStorage.removeItem(AUTH_TOKEN);
    navigate(0);
  };
  return (
    <Box
      display="flex"
      justifyContent="flex-end"
      p={2}
      sx={{
        borderBottom: `1px solid rgba(0,0,0,0.2)`,
      }}
    >
      {/* Search Bar */}
      {/* 
       <Box
        display="flex"
        backgroundColor={colors.primary[400]}
        borderRadius="3px"
      >
        <InputBase
          sx={{ ml: 2, flex: 1 }}
          placeholder="Search Here..."
          fullWidth
        />
        <IconButton type="button" sx={{ p: 1 }}>
          <SearchIcon />
        </IconButton>
      </Box> */}

      <Box
        display="flex"
        sx={{
          "& .MuiSvgIcon-fontSizeMedium": {
            fontSize: "1.3em",
          },
        }}
      >
        {/* <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton> */}
        {/* <IconButton>
          <NotificationsOutlinedIcon />
        </IconButton> */}
        {/* <IconButton>
          <SettingsOutlinedIcon />
        </IconButton>  */}
        <IconButton onClick={handleClick}>
          <PersonOutlinedIcon />
        </IconButton>
      </Box>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </Box>
  );
}

export default TopBar;
