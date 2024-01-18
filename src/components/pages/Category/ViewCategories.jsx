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
import { Box, Pagination, PaginationItem, Typography } from "@mui/material";
import { AUTH_TOKEN, BASE_URL } from "../../global/constants";
import Header from "../../global/Header";
import axios from "axios";
import { Link } from "react-router-dom";

function ViewCategories() {
  const token = localStorage.getItem(AUTH_TOKEN);
  const [categoryData, setCategoryData] = useState([]);
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
      url: `${BASE_URL}/category`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        setCategoryData(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  useEffect(() => {
    document.title = "Lepanto, LLC - View Categories";
  }, []);
  const columns = [
    {
      field: "category_name",
      headerName: "NAME",
      flex: 1,
      cellClassName: "name-column--cell",
      width: 200,
      renderCell: ({ row: { category_name, _id } }) => {
        return (
          <Link
            to={`/category?id=${_id}`}
            style={{
              color: colors.primary[100],
              textDecoration: "none",
            }}
          >
            <Typography sx={{ ml: "5px" }}>{category_name}</Typography>
          </Link>
        );
      },
    },
    {
      field: "active",
      headerName: "Active",
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
              {active ? "ACTIVE" : "INACTIVE"}
            </Typography>
          </Box>
        );
      },
    },
  ];
  return (
    <Box m="0 20px">
      <Header title="Category" subtitle="View All Categories" />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
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
            color: `${colors.primary[900]} !important`,
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
        {!loading && (
          <DataGrid
            getRowId={(row) => row._id}
            rows={categoryData.categories}
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
        )}
      </Box>
    </Box>
  );
}

function CustomPagination() {
  const apiRef = useGridApiContext();
  const page = useGridSelector(apiRef, gridPageSelector);
  const pageCount = useGridSelector(apiRef, gridPageCountSelector);

  return (
    <Pagination
      color="primary"
      variant="outlined"
      shape="rounded"
      page={page + 1}
      count={pageCount}
      // @ts-expect-error
      renderItem={(props2) => <PaginationItem {...props2} disableRipple />}
      onChange={(event, value) => apiRef.current.setPage(value - 1)}
    />
  );
}

export default ViewCategories;
