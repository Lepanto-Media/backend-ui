import { Box, IconButton, Typography, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import ImageGallery from "react-image-gallery";
import { useSearchParams } from "react-router-dom";
import { AUTH_TOKEN, BASE_URL } from "../../global/constants";
import axios from "axios";
import LoadingScreen from "../../global/screens/LoadingScreen";
import { BiPencil } from "react-icons/bi";
import Header from "../../global/Header";
import { DeleteModal, EditModal } from "./CategroyModals";
import Toast from "../../global/Toast";
import { MdDelete } from "react-icons/md";
import { tokens } from "../../../theme";

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
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [searchParams] = useSearchParams();
  const token = localStorage.getItem(AUTH_TOKEN);

  const [categoryInfo, setCategoryInfo] = useState();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ visible: false, message: "" });

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
          vuisible: true,
          message: error.response.data.message,
        });
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
    let config = {
      method: "delete",
      maxBodyLength: Infinity,
      url: `${BASE_URL}/category/${searchParams.get("id")}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    axios
      .request(config)
      .then((response) => {
        handleClose();
        setMessage({ visible: true, message: response.data.message });
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

  if (loading) {
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
          <Box
            sx={{
              flex: 1,
              padding: "3em",
              borderRight: `1px solid ${colors.primary[600]}`,
            }}
          >
            <ImageGallery
              items={images}
              showNav={false}
              showPlayButton={false}
              showFullscreenButton={false}
            />
          </Box>
          <Box
            sx={{
              flex: 1,
              width: "80%",
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
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-evenly",
                paddingTop: "2em",
                width: "60%",
              }}
            >
              <IconButton
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
                <BiPencil fontSize={30} />
              </IconButton>
              <IconButton
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
                <MdDelete fontSize={30} />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default SingleCategory;
