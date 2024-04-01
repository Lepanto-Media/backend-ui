import {
  Box,
  TextField,
  useMediaQuery,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  Select,
  ImageList,
  ImageListItem,
  ListSubheader,
  ImageListItemBar,
  IconButton,
  CircularProgress
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import React, { useEffect, useState } from "react";
import Header from "../../global/Header";

import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { AUTH_TOKEN, BASE_URL } from "../../global/constants";
import axios from "axios";
import Toast from "../../global/Toast";
import { useNavigate } from "react-router-dom";
import { MdDelete } from "react-icons/md";

const initialValues = {
  play_name: "",
  category_id: "",
  author: "",
  adapted_author: "",
  description: "",
  male_roles: 0,
  female_roles: 0,
  either_roles: 0,
  run_time: 0,
  maximum_performances: 5,
  persual_script_price: 0,
  poster_artist: "",
  related_plays: [],
  performance_right_price: [],
};

const categorySchema = yup.object().shape({
  play_name: yup.string().required("Required"),
  category_id: yup.string().required("Required"),
  author: yup.string().required("Required"),
  adapted_author: yup.string(),
  description: yup.string().required("Required"),
  male_roles: yup.string().required("Required"),
  female_roles: yup.string().required("Required"),
  either_roles: yup.string(),
  run_time: yup.number(),
  maximum_performances: yup.number().required("Required"),
  performance_right_price: yup.array().required("Required"),
  persual_script_price: yup.number().required("Required"),
  poster_artist: yup.string().required("Required"),
  related_plays: yup.array(),
});

function AddPlay() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [imageData, setImageData] = useState([]);
  const [gallaryData, setGallaryData] = useState([]);
  const [previewScript, setPreviewScript] = useState({});
  const [persualScript, setPersualScript] = useState({});
  const [originalScript, setOriginalScript] = useState({});
  const [imageUploading, setImageUploading] = useState(false);
  const [scriptUploading, setScriptUploading] = useState(false);
  const [message, setMessage] = useState({
    visible: false,
    message: "",
  });

  const token = localStorage.getItem(AUTH_TOKEN);
  const isNonMobile = useMediaQuery("(min-width: 600px)");

  // Page Title
  useEffect(() => {
    document.title = "Lepanto, LLC - Add Play";
  }, []);

  const handleFileUpload = (files, type) => {
    let data = new FormData();
    Array.from(files).forEach((file) => {
      data.append("files", file);
    });

    //setting uploading true to show spinner
    if (type === "images" || type === "gallary") setImageUploading(true);
    if (type === "preview_script" || type === "persual_script" || type === "original_script") setScriptUploading(true);

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${BASE_URL}/files`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        //setting uploading true to hide spinner
        if (type === "images" || type === "gallary") setImageUploading(false);
        if (type === "preview_script" || type === "persual_script" || type === "original_script") setScriptUploading(false);

        if (type === "preview_script") {
          setPreviewScript(response.data.data.images[0]);
        } else if (type === "persual_script") {
          setPersualScript(response.data.data.images[0]);
        } else if (type === "original_script") {
          setOriginalScript(response.data.data.images[0]);
        } else if (type === "images") {
          const newImages = [...imageData, ...response.data.data.images];
          setImageData(newImages);
        }
        else if (type === "gallary") {
          const newImages = [...gallaryData, ...response.data.data.images];
          setGallaryData(newImages);
        }
      })
      .catch((error) => {
        console.log(error);
        setMessage({
          visible: true,
          message: error.response.data.message,
        });
      });
  };

  const handleFileDelete = (key, type) => {
    let config = {
      method: "delete",
      maxBodyLength: Infinity,
      url: `${BASE_URL}/files/${key}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    axios
      .request(config)
      .then(() => {
        //checking if featured image is deleted or gallary image is delated
        if (type === "image") {
          const newArray = imageData.filter((item) => item.key !== key);
          setImageData(newArray);
        }
        else if (type === "gallary") {
          const newArray = gallaryData.filter((item) => item.key !== key);
          setGallaryData(newArray);
        }
      })
      .catch((error) => {
        setMessage({
          visible: true,
          message: error.response.data.message,
        });
      });
  };

  const handleFormSubmit = (values) => {
    let data = JSON.stringify({
      ...values,
      orginal_script_link: originalScript,
      preview_script_link: previewScript,
      persual_script_link: persualScript,
      images: imageData,
      gallary: gallaryData,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${BASE_URL}/play`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        setMessage({
          visible: true,
          message: response.data.message,
        });
        navigate(`/play?id=${response.data.data._id}`);
      })
      .catch((error) => {
        console.log(error);
        setMessage({
          visible: true,
          message: error.response.data.message,
        });
      });
  };

  useEffect(() => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${BASE_URL}/category`,
      headers: {
        q: "",
        Authorization: `Bearer ${token}`,
      },
    };

    axios
      .request(config)
      .then((response) => {
        setCategories(response.data.data.categories);
      })
      .catch((error) => {
        console.log(error);
        setMessage({
          visible: true,
          message: error.response.data.message,
        });
      });
  }, []);

  return (
    <Box m="20px">
      <Header title="Plays" subtitle="Add Play" />
      {message.visible && <Toast data={message} setState={setMessage} />}
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={categorySchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          setFieldValue,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box display="flex" gap="30px" flexDirection="column">
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Play Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.play_name}
                name="play_name"
                error={!!touched.play_name && !!errors.play_name}
                helperText={touched.play_name && errors.play_name}
              />
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.category_id}
                  name="category_id"
                  error={!!touched.category_id && !!errors.category_id}
                  helperText={touched.category_id && errors.category_id}
                  label="Category"
                >
                  {categories.length !== 0 &&
                    categories?.map((category) => (
                      <MenuItem value={category._id}>
                        {category.category_name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
              <TextField
                multiline
                rows={4}
                value={values.description}
                name="description"
                error={!!touched.description && !!errors.description}
                helperText={touched.description && errors.description}
                label="Description"
                variant="filled"
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Author"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.author}
                name="author"
                error={!!touched.author && !!errors.author}
                helperText={touched.author && errors.author}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Adapted Author"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.adapted_author}
                name="adapted_author"
                error={!!touched.adapted_author && !!errors.adapted_author}
                helperText={touched.adapted_author && errors.adapted_author}
              />
              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField
                  fullWidth
                  variant="filled"
                  type="number"
                  label="Male Roles"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.male_roles}
                  name="male_roles"
                  error={!!touched.male_roles && !!errors.male_roles}
                  helperText={touched.male_roles && errors.male_roles}
                />
                <TextField
                  fullWidth
                  variant="filled"
                  type="number"
                  label="Female Roles"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.female_roles}
                  name="female_roles"
                  error={!!touched.female_roles && !!errors.female_roles}
                  helperText={touched.female_roles && errors.female_roles}
                />
                <TextField
                  fullWidth
                  variant="filled"
                  type="number"
                  label="Either Roles"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.either_roles}
                  name="either_roles"
                  error={!!touched.either_roles && !!errors.either_roles}
                  helperText={touched.either_roles && errors.either_roles}
                />
              </Box>
              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField
                  fullWidth
                  variant="filled"
                  type="number"
                  label="Maximum Performances"
                  onBlur={handleBlur}
                  onChange={(event) => {
                    setFieldValue(
                      "maximum_performances",
                      parseInt(event.target.value)
                    );
                  }}
                  value={values.maximum_performances}
                  name="maximum_performances"
                  error={
                    !!touched.maximum_performances &&
                    !!errors.maximum_performances
                  }
                  helperText={
                    touched.maximum_performances && errors.maximum_performances
                  }
                />
                <TextField
                  fullWidth
                  variant="filled"
                  type="number"
                  label="Run Time"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.run_time}
                  name="run_time"
                  error={!!touched.run_time && !!errors.run_time}
                  helperText={touched.run_time && errors.run_time}
                />
              </Box>
              <Box display="flex" justifyContent="start" alignItems="center" gap="20px">
                <Button
                  component="label"
                  variant="contained"
                  startIcon={<CloudUploadIcon />}
                >
                  Upload Preview Script
                  <input
                    style={{
                      clip: "rect(0 0 0 0)",
                      clipPath: "inset(50%)",
                      height: 1,
                      overflow: "hidden",
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      whiteSpace: "nowrap",
                      width: 1,
                    }}
                    type="file"
                    onChange={(event) =>
                      handleFileUpload(event.target.files, "preview_script")
                    }
                  />
                </Button>
                <Button
                  component="label"
                  variant="contained"
                  startIcon={<CloudUploadIcon />}
                >
                  Upload Persual Script
                  <input
                    style={{
                      clip: "rect(0 0 0 0)",
                      clipPath: "inset(50%)",
                      height: 1,
                      overflow: "hidden",
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      whiteSpace: "nowrap",
                      width: 1,
                    }}
                    type="file"
                    onChange={(event) =>
                      handleFileUpload(event.target.files, "persual_script")
                    }
                  />
                </Button>
                <Button
                  component="label"
                  variant="contained"
                  startIcon={<CloudUploadIcon />}
                >
                  Upload Original Script
                  <input
                    style={{
                      clip: "rect(0 0 0 0)",
                      clipPath: "inset(50%)",
                      height: 1,
                      overflow: "hidden",
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      whiteSpace: "nowrap",
                      width: 1,
                    }}
                    type="file"
                    onChange={(event) =>
                      handleFileUpload(event.target.files, "original_script")
                    }
                  />
                </Button>
                {
                  /* Uploading spinner */
                  scriptUploading && <CircularProgress size={"25px"} mt={"20px"}/>
                }
              </Box>
              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField
                  fullWidth
                  variant="filled"
                  type="number"
                  label="Persual Script Price"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.persual_script_price}
                  name="persual_script_price"
                  error={
                    !!touched.persual_script_price &&
                    !!errors.persual_script_price
                  }
                  helperText={
                    touched.persual_script_price && errors.persual_script_price
                  }
                />
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Poster Artist"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.poster_artist}
                  name="poster_artist"
                  error={!!touched.poster_artist && !!errors.poster_artist}
                  helperText={touched.poster_artist && errors.poster_artist}
                />
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {Array.from({ length: values.maximum_performances }).map(
                  (_, index) => (
                    <Box key={index} sx={{ display: "flex", gap: 2 }}>
                      <TextField
                        fullWidth
                        variant="filled"
                        type="number"
                        label={`Performance #${index + 1}`}
                        onBlur={handleBlur}
                        onChange={(e) => {
                          setFieldValue(
                            `performance_right_price[${index}].number_of_performance`,
                            e.target.value
                          );
                        }}
                        value={
                          values.performance_right_price?.[index]
                            ?.number_of_performance || 0
                        }
                        name={`performance_right_price[${index}].number_of_performance`}
                      />
                      <TextField
                        fullWidth
                        variant="filled"
                        type="number"
                        label={`Price #${index + 1}`}
                        onBlur={handleBlur}
                        onChange={(e) => {
                          setFieldValue(
                            `performance_right_price[${index}].price`,
                            e.target.value
                          );
                        }}
                        value={
                          values.performance_right_price?.[index]?.price || 0
                        }
                        name={`performance_right_price[${index}].price`}
                      />
                    </Box>
                  )
                )}
              </Box>
              {/* Images Uploader*/}

              <Box display="flex" justifyContent="start" alignItems="center" gap="20px" mt="20px" mb="20px">
                <Button
                  component="label"
                  variant="contained"
                  startIcon={<CloudUploadIcon />}
                >
                  Upload Featured Images
                  <input
                    multiple
                    style={{
                      clip: "rect(0 0 0 0)",
                      clipPath: "inset(50%)",
                      height: 1,
                      overflow: "hidden",
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      whiteSpace: "nowrap",
                      width: 1,
                    }}
                    type="file"
                    onChange={(event) =>
                      handleFileUpload(event.target.files, "images")
                    }
                  />
                </Button>
                <Button
                  component="label"
                  variant="contained"
                  startIcon={<CloudUploadIcon />}
                >
                  Upload Gallary Images
                  <input
                    multiple
                    style={{
                      clip: "rect(0 0 0 0)",
                      clipPath: "inset(50%)",
                      height: 1,
                      overflow: "hidden",
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      whiteSpace: "nowrap",
                      width: 1,
                    }}
                    type="file"
                    onChange={(event) =>
                      handleFileUpload(event.target.files, "gallary")
                    }
                  />
                </Button>
                {
                  /* Uploading spinner */
                  imageUploading && <CircularProgress size={"25px"}/>
                }
              </Box>

            </Box>

            {/* Image Viewer */}
            <ImageList
              sx={{ width: "100%", height: "100%", justifyContent: "center" }}
            >
              <ImageListItem key="Subheader" cols={4}>
                <ListSubheader component="div">Uploaded Featured Images</ListSubheader>
              </ImageListItem>
              {imageData?.map((item) => (
                <ImageListItem
                  key={item.key}
                  sx={{ maxWidth: "300px", maxHeight: "300px" }}
                >
                  <img
                    srcSet={`${item.src}`}
                    src={`${item.src}`}
                    alt={item.key}
                    loading="lazy"
                    style={{ maxWidth: "300px", maxHeight: "300px" }}
                  />
                  <ImageListItemBar
                    title={item.key}
                    actionIcon={
                      <IconButton
                        sx={{ color: "rgba(255, 0, 0, 0.75)" }}
                        onClick={() => handleFileDelete(item.key, "image")}
                      >
                        <MdDelete />
                      </IconButton>
                    }
                  />
                </ImageListItem>
              ))}
            </ImageList>
            <ImageList
              sx={{ width: "100%", height: "100%", justifyContent: "center" }}
            >
              <ImageListItem key="Subheader" cols={4}>
                <ListSubheader component="div">Uploaded Gallary Images</ListSubheader>
              </ImageListItem>
              {gallaryData?.map((item) => (
                <ImageListItem
                  key={item.key}
                  sx={{ maxWidth: "300px", maxHeight: "300px" }}
                >
                  <img
                    srcSet={`${item.src}`}
                    src={`${item.src}`}
                    alt={item.key}
                    loading="lazy"
                    style={{ maxWidth: "300px", maxHeight: "300px" }}
                  />
                  <ImageListItemBar
                    title={item.key}
                    actionIcon={
                      <IconButton
                        sx={{ color: "rgba(255, 0, 0, 0.75)" }}
                        onClick={() => handleFileDelete(item.key, "gallary")}
                      >
                        <MdDelete />
                      </IconButton>
                    }
                  />
                </ImageListItem>
              ))}
            </ImageList>

            <Box display="flex" justifyContent="end" mt="20px" mb="80px">
              <Button type="submit" color="secondary" variant="contained">
                Add Play
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
}

export default AddPlay;
