import {
  Box,
  Button,
  Card,
  FormControlLabel,
  IconButton,
  Switch,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import ImageGallery from "react-image-gallery";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AUTH_TOKEN, BASE_URL } from "../../global/constants";
import axios from "axios";
import LoadingScreen from "../../global/screens/LoadingScreen";
import { BiPencil } from "react-icons/bi";
import Header from "../../global/Header";
import { DeleteModal, EditModal } from "./CategroyModals";
import Toast from "../../global/Toast";
import { MdDelete } from "react-icons/md";
import { tokens } from "../../../theme";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

const images = [
  {
    original: "https://picsum.photos/id/1018/1000/600/",
    thumbnail: "https://picsum.photos/id/1018/250/150/",
  },
  {
    original: "https://picsum.photos/id/1015/1000/600/",
    thumbnail: "https://picsum.photos/id/1015/250/150/",
  },
  {
    original: "https://picsum.photos/id/1019/1000/600/",
    thumbnail: "https://picsum.photos/id/1019/250/150/",
  },
];

function SingleCategory() {
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [searchParams] = useSearchParams();
  const token = localStorage.getItem(AUTH_TOKEN);

  const [categoryInfo, setCategoryInfo] = useState();
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
      url: `${BASE_URL}/category/${searchParams.get("id")}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    axios
      .request(config)
      .then((response) => {
        setCategoryInfo(response.data.data);
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
  const handleDelete = () => {
    let data = JSON.stringify({ active: !categoryInfo.active });
    let config = {
      method: "patch",
      maxBodyLength: Infinity,
      url: `${BASE_URL}/category/${searchParams.get("id")}`,
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
        navigate("/view-categories");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Edit Modal
  const handleEdit = (values) => {
    let data = JSON.stringify(values);

    let config = {
      method: "patch",
      maxBodyLength: Infinity,
      url: `${BASE_URL}/category/${searchParams.get("id")}`,
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
        <h1>NOt Exist</h1>
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
        item={categoryInfo}
        open={modalData.isEdit}
        handleClose={handleClose}
        handleEdit={handleEdit}
      />
      <DeleteModal
        item={categoryInfo}
        open={modalData.isDelete}
        handleClose={handleClose}
        handleDelete={handleDelete}
      />
      <Toast data={message} setState={setMessage} />

      <Box m="0 20px" sx={{ background: colors.primary[500] }}>
        <Header title="Category" subtitle="View Single Category" />
        <Box
          sx={{
            display: "flex",
            gap: "1em",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: {
              xs: "column",
              md: "row",
            },
          }}
        >
          <Card
            sx={{
              flex: 1,
              maxWidth: {
                xs: "100%",
                md: "60%",
              },
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
                Title: {categoryInfo.category_name}
              </Typography>
              <Typography variant="p" sx={{ fontSize: "1.5em" }}>
                Type: {categoryInfo.category_type}
              </Typography>
              <Typography variant="p" sx={{ fontSize: "1.5em" }}>
                ID: {categoryInfo._id}
              </Typography>
              <Box
                width="100%"
                m="0 auto"
                p="5px"
                display="flex"
                justifyContent="center"
                backgroundColor={
                  categoryInfo.active
                    ? colors.greenAccent[600]
                    : colors.redAccent[700]
                }
                borderRadius="5px"
              >
                <Typography color={colors.primary[100]} sx={{ ml: "5px" }}>
                  {categoryInfo.active ? "ACTIVE" : "INACTIVE"}
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-evenly",
                paddingTop: "2em",
              }}
            >
              <Button
                sx={{
                  background: colors.greenAccent[500],
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
              {categoryInfo.active ? (
                <Button
                  sx={{
                    background: colors.redAccent[500],
                  }}
                  onClick={() =>
                    setModalData({
                      isDelete: true,
                      isEdit: false,
                    })
                  }
                >
                  {/* <FaRegEyeSlash fontSize={30} /> */}
                  <Typography
                    variant="p"
                    sx={{ fontWeight: 500, color: "#fff", fontSize: "1.2em" }}
                  >
                    Deactivate
                  </Typography>
                </Button>
              ) : (
                <Button
                  sx={{
                    background: colors.greenAccent[500],
                  }}
                  onClick={() =>
                    setModalData({
                      isDelete: true,
                      isEdit: false,
                    })
                  }
                >
                  {/* <FaRegEye fontSize={30} /> */}
                  <Typography
                    variant="p"
                    sx={{ fontWeight: 500, color: "#fff", fontSize: "1.2em" }}
                  >
                    Activate
                  </Typography>
                </Button>
              )}
            </Box>
          </Card>
        </Box>
      </Box>
    </>
  );
}

export default SingleCategory;
