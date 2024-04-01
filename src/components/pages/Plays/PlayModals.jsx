import { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom/client";
import {
  Box,
  Button,
  FormControl,
  ImageList,
  ImageListItem,
  InputLabel,
  ListSubheader,
  Modal,
  Select,
  TextField,
  Typography,
  MenuItem,
  ImageListItemBar,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { AUTH_TOKEN, BASE_URL } from "../../global/constants";
import axios from "axios";
import { MdDelete } from "react-icons/md";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  height: "80%",
  overflowY: "scroll",
};

export function DeleteModal({ item, open, handleClose, handleDelete }) {
  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography component="h1">
            Do you want to {item.active ? "deactivate" : "activate"}{" "}
            {item.category_name}?
          </Typography>
          <Box
            sx={{
              paddingTop: "1.5em",
              display: "flex",
              gap: "1em",
              justifyContent: "space-evenly",
            }}
          >
            <Button
              variant="contained"
              color={item.active ? "error" : "success"}
              onClick={handleDelete}
            >
              {item.active ? "deactivate" : "activate"}
            </Button>
            <Button variant="contained" onClick={handleClose}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
export function EditModal({ item, open, handleClose, handleEdit }) {
  const [imageData, setImageData] = useState(item.images);
  const [gallaryData, setGallaryData] = useState(item.gallary);
  const [categories, setCategories] = useState([]);
  const [previewScript, setPreviewScript] = useState(item.preview_script_link);
  const [persualScript, setPersualScript] = useState(item.persual_script_link);
  const [originalScript, setOriginalScript] = useState(
    item.original_script_link
  );
  const originalScriptRef = useRef();
  const persualScriptRef = useRef();
  const previewScriptRef = useRef();
  const imageRef = useRef();
  const gallaryRef = useRef();

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
      });
  }, []);

  const token = localStorage.getItem(AUTH_TOKEN);

  const handleFileUpload = (files, type, ref) => {
    // Spinner
    const originalContent = ref.current.innerHTML;

    const container = document.createElement("div");
    ReactDOM.createRoot(container).render(<CircularProgress color="inherit" size="25px"/>);

    ref.current.innerHTML = "";
    ref.current.appendChild(container);

    let data = new FormData();
    Array.from(files).forEach((file) => {
      data.append("files", file);
    });

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
        if (type === "preview_script") {
          setPreviewScript(response.data.data.images[0]);
        } else if (type === "persual_script") {
          setPersualScript(response.data.data.images[0]);
        } else if (type === "original_script") {
          setOriginalScript(response.data.data.images[0]);
        } else if (type === "images") {
          const newImages = [...imageData, ...response.data.data.images];
          setImageData(newImages);
        } else if (type === "gallary") {
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
      })
      .finally(() => {
        ref.current.innerHTML = originalContent;
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

  const initialValues = {
    play_name: item.play_name,
    category_id: item?.category_id?._id,
    author: item.author,
    adapted_author: item.adapted_author,
    description: item.description,
    male_roles: item.male_roles,
    female_roles: item.female_roles,
    either_roles: item.either_roles,
    run_time: item.run_time,
    maximum_performances: item.maximum_performances,
    persual_script_price: item.persual_script_price,
    poster_artist: item.poster_artist,
    related_plays: item.related_plays,
    performance_right_price: item.performance_right_price,
    active: item.active,
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
    active: yup.boolean().required("Required"),
  });

  const handleFormSubmit = (values) => {
    let data = {
      ...values,
      performance_right_price: values.performance_right_price.map(
        (performance) => {
          const { _id, ...performanceWithoutId } = performance || {};
          return performanceWithoutId;
        }
      ),
      orginal_script_link: originalScript,
      preview_script_link: previewScript,
      persual_script_link: persualScript,
      images: imageData.map((image) => {
        const { _id, ...imageWithoutId } = image || {};
        return imageWithoutId;
      }),
      gallary: gallaryData.map((image) => {
        const { _id, ...imageWithoutId } = image || {};
        return imageWithoutId;
      })
    };
    handleEdit(data);
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
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
                <FormControl fullWidth>
                  <InputLabel>Active</InputLabel>
                  <Select
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.active}
                    name="active"
                    error={!!touched.active && !!errors.active}
                    helperText={touched.active && errors.active}
                    label="Active"
                  >
                    <MenuItem value={true}>Active</MenuItem>
                    <MenuItem value={false}>Inactive</MenuItem>
                  </Select>
                </FormControl>
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
                      touched.maximum_performances &&
                      errors.maximum_performances
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
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Button
                    component="label"
                    variant="contained"
                    startIcon={<CloudUploadIcon />}
                  >
                    <span ref={previewScriptRef}>Upload Preview Script</span>
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
                        handleFileUpload(
                          event.target.files,
                          "preview_script",
                          previewScriptRef
                        )
                      }
                    />
                  </Button>
                  <Button
                    component="label"
                    variant="contained"
                    startIcon={<CloudUploadIcon />}
                  >
                    <span ref={persualScriptRef}> Upload Persual Script</span>
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
                        handleFileUpload(
                          event.target.files,
                          "persual_script",
                          persualScriptRef
                        )
                      }
                    />
                  </Button>
                  <Button
                    component="label"
                    variant="contained"
                    startIcon={<CloudUploadIcon />}
                  >
                    <span ref={originalScriptRef}>Upload Original Script</span>
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
                        handleFileUpload(
                          event.target.files,
                          "original_script",
                          originalScriptRef
                        )
                      }
                    />
                  </Button>
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
                      touched.persual_script_price &&
                      errors.persual_script_price
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
                              parseInt(e.target.value)
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
                              parseInt(e.target.value)
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

                <Button
                  component="label"
                  variant="contained"
                  startIcon={<CloudUploadIcon />}
                >
                  <span ref={imageRef}>Upload Featured Images</span>
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
                      handleFileUpload(event.target.files, "images", imageRef)
                    }
                  />
                </Button>
                <Button
                  component="label"
                  variant="contained"
                  startIcon={<CloudUploadIcon />}
                >
                  <span ref={gallaryRef}>Upload Gallary Images</span>
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
                      handleFileUpload(event.target.files, "gallary", gallaryRef)
                    }
                  />
                </Button>
              </Box>
              {/* Image Viewer */}
              <ImageList sx={{ width: "100%", height: "100%" }}>
                <ImageListItem key="Subheader" cols={2}>
                  <ListSubheader component="div" sx={{ padding: "0px" }}>Uploaded Featured Images</ListSubheader>
                </ImageListItem>
                {imageData?.map((item) => (
                  <ImageListItem key={item.key}>
                    <img
                      srcSet={`${item.src}`}
                      src={`${item.src}`}
                      alt={item.key}
                      loading="lazy"
                      width="300px"
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
              <ImageList sx={{ width: "100%", height: "100%" }}>
                <ImageListItem key="Subheader" cols={2}>
                  <ListSubheader component="div" sx={{ padding: "0px" }}>Uploaded Gallary Images</ListSubheader>
                </ImageListItem>
                {gallaryData?.map((item) => (
                  <ImageListItem key={item.key}>
                    <img
                      srcSet={`${item.src}`}
                      src={`${item.src}`}
                      alt={item.key}
                      loading="lazy"
                      width="300px"
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
              <Box display="flex" justifyContent="end" mt="20px">
                <Button type="submit" color="secondary" variant="contained">
                  Update Play
                </Button>
              </Box>
            </form>
          )}
        </Formik>
      </Box>
    </Modal>
  );
}
