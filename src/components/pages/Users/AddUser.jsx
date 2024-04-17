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
  first_name: "",
  last_name: "",
  email: "",
  phone_number: "",
  password: "",
  role: "ADMIN",
};

const categorySchema = yup.object().shape({
  first_name: yup.string().required("Required"),
  last_name: yup.string().required("Required"),
  email: yup.string().required("Required"),
  phone_number: yup.string().required("Required"),
  password: yup.string().required("Required"),
  role: yup.string().required("Required"),
});

const AddUser = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState({
    visible: false,
    message: "",
  });

  const token = localStorage.getItem(AUTH_TOKEN);
  const isNonMobile = useMediaQuery("(min-width: 600px)");

  // Page Title
  useEffect(() => {
    document.title = "Lepanto, LLC - Add Coupon";
  }, []);

  const handleFormSubmit = (values) => {
    let data = JSON.stringify({
      ...values,
    });
    console.log(data);
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${BASE_URL}/user`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: data,
    };
// console.log(data);
    axios
      .request(config)
      .then((response) => {
        setMessage({
          visible: true,
          message: response.data.message,
        });
        navigate(`/user?id=${response?.data?.data?._id}`);
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
      <Header title="User" subtitle="Add user" />
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
                label="First name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.first_name}
                name="first_name"
                error={!!touched.first_name && !!errors.first_name}
                helperText={touched.first_name && errors.first_name}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Last name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.last_name}
                name="last_name"
                error={!!touched.last_name && !!errors.last_name}
                helperText={touched.last_name && errors.last_name}
                sx={{ gridColumn: "span 4" }}
              />
               <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Password"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.password}
                name="password"
                error={!!touched.password && !!errors.password}
                helperText={touched.password && errors.password}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name="email"
                error={!!touched.email && !!errors.email}
                helperText={touched.email && errors.email}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Phone number"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.phone_number}
                name="phone_number"
                error={!!touched.phone_number && !!errors.phone_number}
                helperText={touched.phone_number && errors.phone_number}
                sx={{ gridColumn: "span 4" }}
              />
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.role}
                  name="role"
                  error={!!touched.role && !!errors.role}
                  helperText={touched.role && errors.role}
                  label="Role"
                >
                  <MenuItem value={"ADMIN"}>ADMIN</MenuItem>
                  <MenuItem value={"AUTHOR"}>AUTHOR</MenuItem>
                  <MenuItem value={"CUSTOMER"}>CUSTOMER</MenuItem>
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
                Add User
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default AddUser;
