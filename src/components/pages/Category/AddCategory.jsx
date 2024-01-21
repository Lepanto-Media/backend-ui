import {
  Box,
  TextField,
  useMediaQuery,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import React, { useEffect, useState } from "react";
import Header from "../../global/Header";
import { AUTH_TOKEN, BASE_URL } from "../../global/constants";
import axios from "axios";
import Toast from "../../global/Toast";
import { useNavigate } from "react-router-dom";

const initialValues = {
  category_name: "",
  category_type: "PLAY",
};

const categorySchema = yup.object().shape({
  category_name: yup.string().required("Required"),
  category_type: yup.string().required("Required"),
});

function AddCategory() {
  const navigate = useNavigate();
  const [imageData, setImageData] = useState([]);
  const [message, setMessage] = useState({
    visible: false,
    message: "",
  });

  const token = localStorage.getItem(AUTH_TOKEN);
  const isNonMobile = useMediaQuery("(min-width: 600px)");

  // Page Title
  useEffect(() => {
    document.title = "Lepanto, LLC - Add Category";
  }, []);

  const handleFormSubmit = (values) => {
    let data = JSON.stringify({
      ...values,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${BASE_URL}/category`,
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
        navigate(`/category?id=${response.data.data._id}`);
      })
      .catch((error) => {
        setMessage({
          visible: true,
          message: error.response.data.message,
        });
      });
  };
  return (
    <Box m="20px">
      <Header title="Category" subtitle="Add Category" />
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
        }) => (
          <form onSubmit={handleSubmit}>
            <Box display="flex" gap="30px" flexDirection="column">
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Category Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.category_name}
                name="category_name"
                error={!!touched.category_name && !!errors.category_name}
                helperText={touched.category_name && errors.category_name}
                sx={{ gridColumn: "span 4" }}
              />
              <FormControl fullWidth>
                <InputLabel>Category Type</InputLabel>
                <Select
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.category_type}
                  name="category_type"
                  error={!!touched.category_type && !!errors.category_type}
                  helperText={touched.category_type && errors.category_type}
                  label="Category Type"
                >
                  <MenuItem value={"PLAY"}>PLAY</MenuItem>
                  <MenuItem value={"TEST"}>TEST</MenuItem>
                </Select>
              </FormControl>
              {/* Images Uploader*/}
              {/* <InputLabel htmlFor="image" className="text-right">
                Image
              </InputLabel>
              <Button
                component="label"
                variant="contained"
                startIcon={<CloudUploadIcon />}
              >
                Upload file
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
                  onChange={(event) => handleImageUpload(event.target.files)}
                />
              </Button> */}
            </Box>
            {/* Image Viewer */}
            {/* <ImageList sx={{ width: "100%", height: "100%" }}>
              <ImageListItem key="Subheader" cols={2}>
                <ListSubheader component="div">Uploaded Images</ListSubheader>
              </ImageListItem>
              {imageData?.map((item) => (
                <ImageListItem key={item.key}>
                  <img
                    srcSet={`${item.src}`}
                    src={`${item.src}`}
                    alt={item.key}
                    loading="lazy"
                  />
                  <ImageListItemBar
                    title={item.key}
                    actionIcon={
                      <IconButton
                        sx={{ color: "rgba(255, 0, 0, 0.75)" }}
                        onClick={() => handleImageDelete(item.key)}
                      >
                        <MdDelete />
                      </IconButton>
                    }
                  />
                </ImageListItem>
              ))}
            </ImageList> */}
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Add Category
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
}

export default AddCategory;
