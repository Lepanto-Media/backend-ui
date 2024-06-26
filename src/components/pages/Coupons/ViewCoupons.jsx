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
const ViewCoupons = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem(AUTH_TOKEN);
  const [couponsData, setCouponsData] = useState([]);
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
      url: `${BASE_URL}/coupon`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        setCouponsData(response?.data?.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  useEffect(() => {
    document.title = "Lepanto, LLC - View Coupons";
  }, []);
  const columns = [
    {
      field: "coupon_code",
      headerName: "Coupon Code",
      flex: 1,
      cellClassName: "name-column--cell",
      width: 200,
      renderCell: ({ row: { coupon_code, _id } }) => {
        return (
          <Link
            to={`/coupon?id=${_id}`}
            style={{
              color: colors.primary[100],
              textDecoration: "none",
            }}
          >
            <Typography sx={{ ml: "5px" }}>{coupon_code}</Typography>
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
        <Header title="Coupons" subtitle="View All Coupons" />
        <Button
          onClick={() => navigate("/add-coupon")}
          sx={{
            background: colors.greenAccent[400],
            color: colors.primary[900],
            p: 2,
          }}
        >
          {" "}
          Add New Coupon &nbsp; <FaPlus />
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
              rows={couponsData.coupons}
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
};

export default ViewCoupons;
