import {
  Box,
  Button,
  Card,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import ImageGallery from "react-image-gallery";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { AUTH_TOKEN, BASE_URL } from "../../global/constants";
import axios from "axios";
import LoadingScreen from "../../global/screens/LoadingScreen";
import { BiPencil } from "react-icons/bi";
import Header from "../../global/Header";
import { DeleteModal, EditModal } from "./PlayModals";
import Toast from "../../global/Toast";
import { MdDelete } from "react-icons/md";
import { tokens } from "../../../theme";
import { BsEye } from "react-icons/bs";

function SinglePlay() {
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [searchParams] = useSearchParams();
  const token = localStorage.getItem(AUTH_TOKEN);

  const [playInfo, setPlayInfo] = useState({});
  const [categoryInfo, setCategoryInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ visible: false, message: "" });
  const [notExist, setNotExits] = useState(false);
  const [images, setImages] = useState([]);
  const [gallary, setGallary] = useState([]);

  const [modalData, setModalData] = useState({
    isDelete: false,
    isEdit: false,
  });

  const getPlayData = () => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${BASE_URL}/play/${searchParams.get("id")}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    axios
      .request(config)
      .then((response) => {
        setPlayInfo(response.data.data);
      })
      .catch((error) => {
        setMessage({
          vuisible: true,
          message: error.response.data.message,
        });
        if (error.response.data.status === 404) {
          setNotExits(true);
        }
      });
  };
  const getCategoryData = () => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${BASE_URL}/category/${playInfo?.category_id?._id}`,
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
        if (error.response.data.status === 404) {
          setNotExits(true);
          setLoading(false);
        }
      })
      .finally(() => setLoading(false));
  };

  const handleClose = () =>
    setModalData({
      isDelete: false,
      isEdit: false,
    });

  useEffect(() => {
    getPlayData();
  }, []);
  useEffect(() => {
    if (playInfo.category_id !== undefined) {
      getCategoryData();
      // Images for carousel
      const imageData = playInfo?.images?.map((image) => {
        return {
          original: image.src,
          thumbnail: image.src,
          originalWidth: "300px",
          originalHeight: "300px",
        };
      });
      setImages(imageData);
      const gallary = playInfo?.gallary?.map((image) => {
        return {
          original: image.src,
          thumbnail: image.src,
          originalWidth: "300px",
          originalHeight: "300px",
        };
      });
      setGallary(gallary);
    }
  }, [playInfo]);

  //Delete Modal
  const handleDelete = () => {
    let data = JSON.stringify({
      active: false,
    });
    let config = {
      method: "patch",
      maxBodyLength: Infinity,
      url: `${BASE_URL}/play/${searchParams.get("id")}`,
      headers: {
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
        setMessage({
          visible: true,
          message: error.response.data.message,
        });
      });
  };

  // Edit Modal
  const handleEdit = (values) => {
    let data = JSON.stringify(values);

    let config = {
      method: "patch",
      maxBodyLength: Infinity,
      url: `${BASE_URL}/play/${searchParams.get("id")}`,
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
        getPlayData();
      })
      .catch((error) => {
        console.log(error);
        setMessage({
          visible: true,
          message: error.response.data.message,
        });
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
        item={playInfo}
        open={modalData.isEdit}
        handleClose={handleClose}
        handleEdit={handleEdit}
      />
      <DeleteModal
        item={playInfo}
        open={modalData.isDelete}
        handleClose={handleClose}
        handleDelete={handleDelete}
      />
      <Toast data={message} setState={setMessage} />

      <Box
        m="0 20px 50px 20px"
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: colors.primary[500],
          paddingBottom: "3em",
        }}
      >
        <Header title="Plays" subtitle="View Single Play" />
        <Box
          sx={{
            display: "flex",
            gap: "5em",
            justifyContent: "start",
            alignItems: "center",
            flexDirection: {
              xs: "column",
              md: "row",
            },
          }}
        >
          <Box sx={{justifyContent: "start"}}>
            <b>Featured Images</b>
            <ImageGallery
              items={images}
              showNav={false}
              showFullscreenButton={false}
              showPlayButton={false}
            />
          </Box>
          <Box sx={{justifyContent: "start"}}>
          <b>Gallary Images</b>
            <ImageGallery
              items={gallary}
              showNav={false}
              showFullscreenButton={false}
              showPlayButton={false}
            />
          </Box>
        </Box>

        <Box sx={{ flex: 1, marginTop: "20px"}}>
          <Card
            sx={{
              flex: 1,
              padding: "2em",
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "1em",
                pb: "2em",
              }}
            >
              <Typography
                variant="p"
                sx={{ fontSize: "2.5em", fontWeight: 600 }}
              >
                Title: {playInfo.play_name}
              </Typography>
              <Typography variant="p" sx={{ fontSize: "1.5em" }}>
                Author: {playInfo.author}
              </Typography>
              {playInfo.adapted_author && (
                <Typography variant="p" sx={{ fontSize: "1.5em" }}>
                  Adapted Author: {playInfo.adapted_author}
                </Typography>
              )}
              <Typography variant="p" sx={{ fontSize: "1.5em" }}>
                Category: {categoryInfo.category_name}
              </Typography>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Box
                  sx={{
                    border: `1px solid ${colors.primary[100]}`,
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    textAlign: "center",
                  }}
                >
                  <Typography variant="p" sx={{ fontSize: "1.5em" }}>
                    Male Roles
                  </Typography>
                  <Typography variant="p" sx={{ fontSize: "1.8em" }}>
                    {playInfo.male_roles}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    border: `1px solid ${colors.primary[100]}`,
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    textAlign: "center",
                  }}
                >
                  <Typography variant="p" sx={{ fontSize: "1.5em" }}>
                    Female Roles
                  </Typography>
                  <Typography variant="p" sx={{ fontSize: "1.8em" }}>
                    {playInfo.female_roles}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    border: `1px solid ${colors.primary[100]}`,
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    textAlign: "center",
                  }}
                >
                  <Typography variant="p" sx={{ fontSize: "1.5em" }}>
                    Either Roles
                  </Typography>
                  <Typography variant="p" sx={{ fontSize: "1.8em" }}>
                    {playInfo.either_roles}
                  </Typography>
                </Box>
              </Box>
              <Box
                width="100%"
                m="0 auto"
                p="5px"
                display="flex"
                justifyContent="center"
                backgroundColor={
                  playInfo.active
                    ? colors.greenAccent[600]
                    : colors.redAccent[700]
                }
                borderRadius="5px"
              >
                <Typography color={colors.primary[100]} sx={{ ml: "5px" }}>
                  {playInfo.active ? "ACTIVE" : "INACTIVE"}
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
          </Card>
        </Box>
        <Box sx={{ paddingTop: 2 }}>
          <Card
            sx={{
              flex: 1,
              padding: "2em",
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Typography variant="p">Run Time: {playInfo.run_time}</Typography>
              <Typography variant="p">
                Description: {playInfo.description}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: {
                    xs: "column",
                    md: "row",
                  },
                  gap: 2,
                  justifyContent: "space-evenly",
                }}
              >
                <Box
                  sx={{
                    border: `1px solid ${colors.primary[100]}`,
                    padding: 2,
                    display: "flex",
                    flexDirection: "column",
                    textAlign: "center",
                  }}
                >
                  <Typography variant="p" sx={{ fontSize: "1.2em" }}>
                    Total Roles
                  </Typography>
                  <Typography variant="p">{playInfo.total_roles}</Typography>
                </Box>
                <Box
                  sx={{
                    border: `1px solid ${colors.primary[100]}`,
                    padding: 2,
                    display: "flex",
                    flexDirection: "column",
                    textAlign: "center",
                  }}
                >
                  <Typography variant="p" sx={{ fontSize: "1.2em" }}>
                    Persual Script Price
                  </Typography>
                  <Typography variant="p">
                    ${playInfo.persual_script_price}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    border: `1px solid ${colors.primary[100]}`,
                    padding: 2,
                    display: "flex",
                    flexDirection: "column",
                    textAlign: "center",
                  }}
                >
                  <Typography variant="p" sx={{ fontSize: "1.2em" }}>
                    Total Downloads
                  </Typography>
                  <Typography variant="p">
                    {playInfo.total_downloads}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    border: `1px solid ${colors.primary[100]}`,
                    padding: 2,
                    display: "flex",
                    flexDirection: "column",
                    textAlign: "center",
                  }}
                >
                  <Typography variant="p" sx={{ fontSize: "1.2em" }}>
                    Poster Artist
                  </Typography>
                  <Typography variant="p">{playInfo.poster_artist}</Typography>
                </Box>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  gap: 3,
                  justifyContent: "center",
                  pt: "2em",
                }}
              >
                <Link
                  to={playInfo.preview_script_link?.src}
                  target="_blank"
                  rel="noopener norefereer"
                >
                  <Button variant="contained">
                    <BsEye /> &nbsp; View Preview Script
                  </Button>
                </Link>
                <Link
                  to={playInfo.persual_script_link?.src}
                  target="_blank"
                  rel="noopener norefereer"
                >
                  <Button variant="contained">
                    <BsEye /> &nbsp; View Persual Script
                  </Button>
                </Link>
                <Link
                  to={playInfo.orginal_script_link?.src}
                  target="_blank"
                  rel="noopener norefereer"
                >
                  <Button variant="contained">
                    <BsEye /> &nbsp; View Orginal Script
                  </Button>
                </Link>
              </Box>
            </Box>
          </Card>
        </Box>
      </Box>
    </>
  );
}

export default SinglePlay;
