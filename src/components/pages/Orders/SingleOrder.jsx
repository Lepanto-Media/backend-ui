import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  Chip,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AUTH_TOKEN, BASE_URL } from "../../global/constants";
import axios from "axios";
import LoadingScreen from "../../global/screens/LoadingScreen";

import Header from "../../global/Header";
import Toast from "../../global/Toast";

import { tokens } from "../../../theme";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ErrorPage from "../ErrorPage";
import { EditModal } from "./OrderModals";

function SingleOrder() {
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [searchParams] = useSearchParams();
  const token = localStorage.getItem(AUTH_TOKEN);

  const [orderInfo, setOrderInfo] = useState();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ visible: false, message: "" });
  const [notExist, setNotExits] = useState(false);

  const [modalData, setModalData] = useState({
    isDelete: false,
    isEdit: false,
  });

  const getData = () => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${BASE_URL}/order/${searchParams.get("id")}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    axios
      .request(config)
      .then((response) => {
        setOrderInfo(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        setMessage({
          visible: true,
          message: error.response.data.message,
        });
        if (error.response.data.status === 404) {
          setNotExits(true);
        }
      });
  };

  const handleClose = () =>
    setModalData({
      isDelete: false,
      isEdit: false,
    });

  useEffect(() => {
    getData();
  }, []);

  //Delete Modal

  // Edit Modal
  const handleEdit = (values) => {
    let data = JSON.stringify(values);

    let config = {
      method: "patch",
      maxBodyLength: Infinity,
      url: `${BASE_URL}/order/${searchParams.get("id")}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        handleClose();
        setMessage({ visible: true, message: response.data.message });
        getData();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  if (loading && notExist) {
    return (
      <>
        <ErrorPage />
      </>
    );
  } else if (loading) {
    return (
      <>
        <LoadingScreen />
      </>
    );
  }

  return (
    <>
      <EditModal
        item={orderInfo}
        open={modalData.isEdit}
        handleClose={handleClose}
        handleEdit={handleEdit}
      />

      <Toast data={message} setState={setMessage} />

      <Box
        m="0 20px"
        sx={{ background: colors.primary[500], marginBottom: "5em" }}
      >
        <Header title="Category" subtitle="View Single Category" />
        <Box
          sx={{
            display: "flex",
            gap: "1em",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: {
              xs: "column",
              md: "column",
            },
          }}
        >
          <Card
            sx={{
              width: "100%",
              padding: "2em",
              position: "relative",
              flexDirection: "column",
              flex: 1,
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: 10,
                right: 5,
              }}
            >
              <Chip
                label={`Status: ${orderInfo.status}`}
                color="success"
                variant="outlined"
                sx={{
                  fontSize: "1.2em",
                }}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5em",
                pb: "2em",
              }}
            >
              <Typography
                variant="p"
                sx={{ fontSize: "1.5em", fontWeight: 600 }}
              >
                Oder ID: {orderInfo.order_id}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  textAlign: "center",
                  gap: 2,
                  justifyContent: "space-between",
                  pt: 5,
                  flexDirection: {
                    xs: "column",
                    md: "row",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    textAlign: "center",
                  }}
                >
                  <Typography variant="p" sx={{ fontSize: "1.1em" }}>
                    Created At
                  </Typography>
                  <Typography variant="p" sx={{ fontSize: "1.1em" }}>
                    {orderInfo.created_at}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    textAlign: "center",
                  }}
                >
                  <Typography variant="p" sx={{ fontSize: "1.1em" }}>
                    Customer Name
                  </Typography>
                  <Typography variant="p" sx={{ fontSize: "1.1em" }}>
                    {orderInfo.billing_details.customer_name}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    textAlign: "center",
                  }}
                >
                  <Typography variant="p" sx={{ fontSize: "1.1em" }}>
                    Customer Email
                  </Typography>
                  <Typography variant="p" sx={{ fontSize: "1.1em" }}>
                    {orderInfo.billing_details.email}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    textAlign: "center",
                  }}
                >
                  <Typography variant="p" sx={{ fontSize: "1.1em" }}>
                    Customer Phone
                  </Typography>
                  <Typography variant="p" sx={{ fontSize: "1.1em" }}>
                    {orderInfo.billing_details.phone_number}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box sx={{ display: "flex" }}>
              <Card
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  padding: 2,
                }}
              >
                <Typography
                  variant="p"
                  sx={{ fontSize: "1.5em", fontWeight: 600 }}
                >
                  Payment Details
                </Typography>
                <Box
                  sx={{
                    paddingTop: 3,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Typography variant="p" sx={{ fontSize: "1.2em" }}>
                    Total Items: {orderInfo.plays.length}
                  </Typography>
                  <Typography variant="p" sx={{ fontSize: "1.2em" }}>
                    Total Amount: ${orderInfo.total_amount}
                  </Typography>
                  <Typography variant="p" sx={{ fontSize: "1.2em" }}>
                    Payment Status:{" "}
                    {orderInfo.payment_completed ? "COMPLETED" : "INCOMPLETE"}
                  </Typography>
                </Box>
              </Card>
            </Box>
            <Box
              sx={{ paddingTop: 2, display: "flex", flexDirection: "column" }}
            >
              <Typography variant="p" sx={{ fontSize: "1.2em" }}>
                Customer Notes: {orderInfo?.customer_notes}
              </Typography>
              <Typography variant="p" sx={{ fontSize: "1.2em" }}>
                Admin Notes:{" "}
                {orderInfo?.admin_notes.map((note, index) => (
                  <Typography sx={{ fontSize: "inherit" }}>
                    {index + 1} - {note}{" "}
                  </Typography>
                ))}
              </Typography>
            </Box>
            <Box
              sx={{
                paddingTop: "1em",
              }}
            >
              <Button
                sx={{
                  background: colors.greenAccent[500],
                  width: "100%",
                }}
                onClick={() =>
                  setModalData({
                    isDelete: false,
                    isEdit: true,
                  })
                }
              >
                {/* <BiPencil fontSize={30} /> */}
                <Typography
                  variant="p"
                  sx={{ fontWeight: 500, color: "#fff", fontSize: "1.2em" }}
                >
                  Edit
                </Typography>
              </Button>
            </Box>
          </Card>
          <Card
            sx={{
              flex: 1,
              width: "100%",
              padding: "2em",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5em",
                pb: "2em",
              }}
            >
              <Typography
                variant="p"
                sx={{ fontSize: "2.5em", fontWeight: 600 }}
              >
                Plays
              </Typography>
              <Box>
                {orderInfo.plays.map((play) => (
                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1-content"
                      id="panel1-header"
                    >
                      {play.play_id.play_name}
                    </AccordionSummary>
                    <AccordionDetails>
                      {play.is_persual_script_order
                        ? "PERSUAL RIGHTS"
                        : "PERFORMANCE RIGHTS"}
                      {!play.is_persual_script_order
                        ? play.performance_info.map((info, index) => (
                            <>
                              <Box sx={{ display: "flex", gap: 2 }}>
                                <Typography
                                  variant="p"
                                  sx={{ fontSize: "1.1em" }}
                                >
                                  {index + 1}
                                </Typography>
                                <Typography
                                  variant="p"
                                  sx={{ fontSize: "1.1em" }}
                                >
                                  {info.performance_date}
                                </Typography>
                                <Typography
                                  variant="p"
                                  sx={{ fontSize: "1.1em" }}
                                >
                                  {info.performance_address}
                                </Typography>
                              </Box>
                            </>
                          ))
                        : null}
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Box>
            </Box>
          </Card>
        </Box>
      </Box>
    </>
  );
}

export default SingleOrder;
