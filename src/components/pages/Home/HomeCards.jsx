import React, { useEffect, useState } from "react";
import { AUTH_TOKEN, BASE_URL } from "../../global/constants";
import axios from "axios";
import { Box, Typography } from "@mui/material";

function HomeCards() {
  const token = localStorage.getItem(AUTH_TOKEN);
  const [playData, setplayData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);

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
      url: `${BASE_URL}/play`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    axios
      .request(config)
      .then((response) => {
        setplayData(response.data.data);
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
        setCategoryData(response.data.data);
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
  return (
    <>
      <Box
        sx={{
          display: "flex",
          padding: "2em",
          display: "flex",
          flexDirection: {
            sx: "column",
            md: "row",
          },
          justifyContent: "space-around",
        }}
      >
        <Box
          sx={{
            width: "200px",
            height: "100px",
            textAlign: "center",
            border: "2px solid #000",
            borderRadius: "1em",
            flexDirection: "column",
          }}
        >
          <Typography component="p" sx={{ fontSize: "1.5em", fontWeight: 700 }}>
            Total Categories
          </Typography>
          <Typography component="p" sx={{ fontSize: "1.8em" }}>
            {categoryData.no_of_total_documents}
          </Typography>
        </Box>
        <Box
          sx={{
            width: "200px",
            height: "100px",
            textAlign: "center",
            border: "2px solid #000",
            borderRadius: "1em",
            flexDirection: "column",
          }}
        >
          <Typography component="p" sx={{ fontSize: "1.5em", fontWeight: 700 }}>
            Total Plays
          </Typography>
          <Typography component="p" sx={{ fontSize: "1.8em" }}>
            {playData.noOfTotalDocuments}
          </Typography>
        </Box>
      </Box>
    </>
  );
}

export default HomeCards;
