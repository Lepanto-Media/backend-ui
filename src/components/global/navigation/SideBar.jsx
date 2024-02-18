import React, { useState } from "react";
import {
  Sidebar,
  Menu,
  MenuItem,
  useProSidebar,
  SubMenu,
} from "react-pro-sidebar";
import { Box, useTheme, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { tokens } from "../../../theme";

// Icons
import { RiHome4Line } from "react-icons/ri";
import { BiCategory } from "react-icons/bi";
import { GiHamburgerMenu, GiDramaMasks } from "react-icons/gi";
import { BsClipboard } from "react-icons/bs";
import {
  AiOutlineCopyrightCircle,
  AiOutlineUser,
  AiOutlinePlus,
  AiOutlineUnorderedList,
} from "react-icons/ai";

// Images
import Logo from "../../../assets/logo.webp";

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.primary[900],
      }}
      onClick={() => setSelected(title)}
      icon={icon}
      component={<Link to={to} />}
    >
      <Typography>{title}</Typography>
    </MenuItem>
  );
};

function SideBar() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [selected, setSelected] = useState("Dashboard");
  const [iconSize] = useState("20");
  const { collapseSidebar, collapsed } = useProSidebar();
  return (
    <Box
      sx={{
        position: "sticky",
        display: "flex",
        height: "100%",
        top: 0,
        bottom: 0,
        zIndex: 10000,
        "& .ps-sidebar-root": {
          border: "none",
        },
        "& .ps-menu-icon": {
          backgroundColor: "transparent !important",
        },
        "& .ps-menu-button": {
          // padding: "5px 35px 5px 20px !important",
          backgroundColor: "transparent !important",
        },
        "& .menu-anchor": {
          color: "inherit !important",
          backgroundColor: "transparent !important",
        },
        "& .ps-menu-button:hover": {
          color: `${colors.blueAccent[900]} !important`,
          backgroundColor: "transparent !important",
        },
        "& .ps-menu-button.ps-active": {
          color: `${colors.greenAccent[500]} !important`,
          backgroundColor: "transparent !important",
        },
        "& .ps-menuitem-root": {
          backgroundColor: colors.blueAccent[400],
          //   color: `${colors.primary[100]} !important`,
        },
      }}
    >
      <Sidebar
        collapsed={collapsed}
        backgroundColor={colors.blueAccent[400]}
        style={{ height: "100vh", overflow: "hidden", minWidth: "80px" }}
        breakPoint="xs"
      >
        <Menu iconShape="square">
          <MenuItem
            onClick={() => collapseSidebar()}
            icon={<GiHamburgerMenu size={iconSize} />}
            style={{
              margin: "10px 0 20px 0",
              color: colors.primary[900],
            }}
          >
            {!collapsed && (
              <Typography variant="h3" color={colors.primary[900]}>
                Lepanto, LLC
              </Typography>
            )}
          </MenuItem>
          {!collapsed && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <img
                  alt="profile-user"
                  width="100px"
                  height="100px"
                  src={Logo}
                  style={{ cursor: "pointer", borderRadius: "50%" }}
                />
              </Box>
              <Box textAlign="center">
                {/* <Typography
                  variant="h2"
                  color={colors.primary[900]}
                  fontWeight="bold"
                  sx={{ m: "10px 0 0 0" }}
                >
                  Lepanto, LLC
                </Typography> */}
                <Typography variant="h4" color={colors.primary[900]} pt={2}>
                  Admin
                </Typography>
              </Box>
            </Box>
          )}
          <Item
            title="Dashboard"
            to="/"
            icon={<RiHome4Line size={iconSize} color={colors.primary[900]} />}
            selected={selected}
            setSelected={() => setSelected("Dashboard")}
          />

          {/* Products */}

          {/* <Typography
            variant="h6"
            color={colors.primary[900]}
            sx={{ m: "15px 0 5px 20px" }}
          >
            Products
          </Typography> */}

          {/* Category */}

          <Item
            title="View Category"
            to="/view-categories"
            icon={<BiCategory size={iconSize} color={colors.primary[900]} />}
            selected={selected}
            setSelected={() => setSelected("Category")}
          />
          {/* Plays */}

          <Item
            title="View Plays"
            to="/view-plays"
            icon={<GiDramaMasks size={iconSize} color={colors.primary[900]} />}
            selected={selected}
            className={ selected ? "active" : "" }
            setSelected={() => setSelected("Plays")}
          />

          {/* Orders */}

          {/* <Typography
            variant="h6"
            color={colors.primary[900]}
            sx={{ m: "15px 0 5px 20px" }}
          >
            Orders
          </Typography> */}
          <Item
            title="View All Orders"
            to="/all-orders"
            icon={<BsClipboard size={iconSize} color={colors.primary[900]} />}
            selected={selected}
            setSelected={() => setSelected("Orders")}
          />

          {/* Users */}

          {/* <Typography
            variant="h6"
            color={colors.primary[900]}
            sx={{ m: "15px 0 5px 20px" }}
          >
            Users
          </Typography> */}
          <Item
            title="View Users"
            to="/users"
            icon={<AiOutlineUser size={iconSize} color={colors.primary[900]} />}
            selected={selected}
            setSelected={() => setSelected("Users")}
          />

          {/* CopyRight */}

          <Box
            display={collapsed ? "none" : "flex"}
            flexDirection="column"
            gap="20px"
            px={4}
            sx={{ opacity: 0.5 }}
            pt={14}
          >
            <Typography pt={5} variant="p" color={colors.primary[900]}>
              {" "}
              Lepanto, LLC Admin Dashboard
            </Typography>

            <Typography variant="p" color={colors.primary[900]}>
              <AiOutlineCopyrightCircle /> 2023 All Rights Reserved
            </Typography>
          </Box>
        </Menu>
      </Sidebar>
    </Box>
  );
}

export default SideBar;
