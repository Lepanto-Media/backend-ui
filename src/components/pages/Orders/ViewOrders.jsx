import { useTheme } from "@emotion/react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { tokens } from "../../../theme";
import { Box, Button, Typography } from "@mui/material";
import { FaPlus } from "react-icons/fa6";
import { AUTH_TOKEN, BASE_URL } from "../../global/constants";
import Header from "../../global/Header";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import LoadingScreen from "../../global/screens/LoadingScreen";
import Toast from "../../global/Toast";
import ErrorPage from "../ErrorPage";

function ViewOrders() {
  const token = localStorage.getItem(AUTH_TOKEN);
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [message, setMessage] = useState({
    visible: false,
    message: "",
    status: 0,
  });

  useEffect(() => {
    setLoading(true);
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${BASE_URL}/order`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    axios
      .request(config)
      .then((response) => {
        setOrderData(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setMessage({
          visible: true,
          message: error.response.data.message,
          status: error.response.data.status,
        });
      });
  }, []);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Set Page Title
  useEffect(() => {
    document.title = "Lepanto, LLC - View Orders";
  }, []);

  const columns = [
    {
      field: "order_id",
      headerName: "NAME",
      flex: 1,
      cellClassName: "name-column--cell",
      width: 200,
      renderCell: ({ row: { order_id, _id } }) => {
        return (
          <Link
            to={`/order?id=${_id}`}
            style={{
              color: colors.primary[100],
              textDecoration: "none",
            }}
          >
            <Typography sx={{ ml: "5px" }}>#{order_id}</Typography>
          </Link>
        );
      },
    },
    {
      field: "status",
      headerName: "Order Status",
      flex: 1,
      cellClassName: "name-column--cell",
      width: 200,
      renderCell: ({ row: { status } }) => {
        return <Typography sx={{ ml: "5px" }}>{status}</Typography>;
      },
    },
    {
      field: "payment_completed",
      headerName: "Payment Status",
      flex: 1,
      width: 150,

      renderCell: ({ row: { payment_completed } }) => {
        return (
          <Box
            width="100%"
            m="0 auto"
            p="5px"
            display="flex"
            justifyContent="center"
            backgroundColor={
              payment_completed
                ? colors.greenAccent[600]
                : colors.redAccent[700]
            }
            borderRadius="5px"
          >
            <Typography color={colors.primary[100]} sx={{ ml: "5px" }}>
              {payment_completed ? "COMPLETE" : "INCOMPLETE"}
            </Typography>
          </Box>
        );
      },
    },
  ];

  return (
    <>
      <Toast data={message} setState={setMessage} />
      <Box m="0 20px">
        <Header title="Orders" subtitle="View All Orders" />
        <Box
          m="40px 0 0 0"
          height="75vh"
          sx={{
            marginBottom: "5em",
            "& .MuiDataGrid-root": {
              border: "none",
              color: "#fff !important",
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
            "& MuiTablePagination-root": {
              color: `${colors.primary[100]} !important`,
            },
          }}
        >
          {message.status === 404 ? (
            <ErrorPage item="Plays" />
          ) : !loading ? (
            <DataGrid
              getRowId={(row) => row.order_id}
              rows={orderData.order}
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

export default ViewOrders;
