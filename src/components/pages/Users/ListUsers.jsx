import { useTheme } from "@emotion/react";
import {
  DataGrid,
  GridToolbar,
  useGridApiContext,
  useGridSelector,
  gridPageCountSelector,
  gridPageSelector,
} from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { tokens } from "../../../theme";
import {
  Box,
  Button,
  Fab,
  IconButton,
  Pagination,
  PaginationItem,
  Typography,
} from "@mui/material";
import { AUTH_TOKEN, BASE_URL } from "../../global/constants";
import Header from "../../global/Header";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";
import LoadingScreen from "../../global/screens/LoadingScreen";

function ListUsers() {
  const navigate = useNavigate();
  const token = localStorage.getItem(AUTH_TOKEN);
  const [usersData, setUsersData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });

  useEffect(() => {
    setLoading(true);
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${BASE_URL}/user`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        setUsersData(response?.data?.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  useEffect(() => {
    document.title = "Lepanto, LLC - View Users";
  }, []);
  const columns = [
    {
      field: "ID",
      headerName: "ID",
      flex: 1,
      cellClassName: "name-column--cell",
      width: 200,
      renderCell: ({ row: { _id } }) => {
        return (
          <Link
            to={`/users?id=${_id}`}
            style={{
              color: colors.primary[100],
              textDecoration: "none",
            }}
          >
            <Typography sx={{ ml: "5px" }}>{_id}</Typography>
          </Link>
        );
      },
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      cellClassName: "name-column--cell",
      width: 200,
      renderCell: ({ row: { email, _id } }) => {
        return (
          <Link
            to={`/users?id=${_id}`}
            style={{
              color: colors.primary[100],
              textDecoration: "none",
            }}
          >
            <Typography sx={{ ml: "5px" }}>{email}</Typography>
          </Link>
        );
      },
    },
    {
      field: "phone_number",
      headerName: "Phone Number",
      flex: 1,
      cellClassName: "name-column--cell",
      width: 200,
      renderCell: ({ row: { phone_number, _id } }) => {
        return (
          <Link
            to={`/users?id=${_id}`}
            style={{
              color: colors.primary[100],
              textDecoration: "none",
            }}
          >
            <Typography sx={{ ml: "5px" }}>{phone_number}</Typography>
          </Link>
        );
      },
    },
    {
      field: "role",
      headerName: "Role",
      flex: 1,
      cellClassName: "name-column--cell",
      width: 200,
      renderCell: ({ row: { role, _id } }) => {
        return (
          <Link
            to={`/users?id=${_id}`}
            style={{
              color: colors.primary[100],
              textDecoration: "none",
            }}
          >
            <Typography sx={{ ml: "5px" }}>{role}</Typography>
          </Link>
        );
      },
    },
    {
      field: "active",
      headerName: "Status",
      flex: 1,
      width: 150,

      renderCell: ({ row: { active } }) => {
        return (
          <Box
            width="100%"
            m="0 auto"
            p="5px"
            display="flex"
            justifyContent="center"
            backgroundColor={
              active ? colors.greenAccent[600] : colors.redAccent[700]
            }
            borderRadius="5px"
          >
            <Typography color={colors.primary[100]} sx={{ ml: "5px" }}>
              {active ? "Active" : "Inactive"}
            </Typography>
          </Box>
        );
      },
    },
  ];
  return (
    <>
      <Box m="0 20px">
        <Header title="Users" subtitle="View All Users" />
        <Button
          onClick={() => navigate("/add-user")}
          sx={{
            background: colors.greenAccent[400],
            color: colors.primary[900],
            p: 2,
          }}
        >
          {" "}
          Add New User &nbsp; <FaPlus />
        </Button>
        <Box
          m="40px 0 0 0"
          height="75vh"
          sx={{
            marginBottom: "5em",
            "& .MuiDataGrid-root": {
              border: "none",
              color: "#fff !important",
            },
            "& .MuiIconButton-sizeSmall ": {
              color: "#fff",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "none",
            },
            "& .name-column--cell": {
              color: colors.blueAccent[100],
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: colors.blueAccent[500],
              color: colors.primary[900],
              borderBottom: "none",
            },
            "& .MuiDataGrid-virtualScroller": {
              backgroundColor: colors.primary[500],
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "none",
              backgroundColor: colors.blueAccent[500],
            },
            "& .MuiCheckbox-root": {
              color: `${colors.primary[200]} !important`,
            },
            "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
              color: `${colors.primary[100]} !important`,
            },
            "& MuiTablePagination-toolbar": {
              color: `#fff`,
            },
            "& MuiIconButton-sizeMedium": {
              color: `${colors.primary[900]} !important`,
            },
            "& .MuiDataGrid-columnHeader, .MuiDataGrid-cell": {
              borderRight: `1px solid ${colors.primary[300]}`,
            },
            "& .MuiDataGrid-columnsContainer, .MuiDataGrid-cell": {
              borderBottom: `1px solid ${colors.primary[300]}`,
            },
          }}
        >
          {!loading ? (
            <DataGrid
              getRowId={(row) => row._id}
              rows={usersData}
              columns={columns}
              loading={loading}
              components={{ Toolbar: GridToolbar }}
              disableSelectionOnClick
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 8,
                  },
                },
              }}
              pageSizeOptions={[8]}
            />
          ) : (
            <LoadingScreen />
          )}
        </Box>
      </Box>
    </>
  );
}

export default ListUsers;
