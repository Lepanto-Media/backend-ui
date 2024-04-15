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
    coupon_code: "",
    is_percent: true,
    description: "",
  };
  
  const categorySchema = yup.object().shape({
    coupon_code: yup.string().required("Required"),
    is_percent: yup.string().required("Required"),
    expiry:yup.string().required("Required"),
    discount:yup.string().required("Required"),
  });
  
  const AddCoupon = () => {
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
        url: `${BASE_URL}/coupon`,
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
          navigate(`/coupon?id=${response.data.data._id}`);
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
        <Header title="Coupon" subtitle="Add Coupon" />
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
                  label="Coupon code"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.coupon_code}
                  name="coupon_code"
                  error={!!touched.coupon_code && !!errors.coupon_code}
                  helperText={touched.coupon_code && errors.coupon_code}
                  sx={{ gridColumn: "span 4" }}
                />
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Coupon description"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.description}
                  name="description"
                  error={!!touched.description && !!errors.description}
                  helperText={touched.description && errors.description}
                  sx={{ gridColumn: "span 4" }}
                />
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Coupon discount"
                  inputProps={{ type: "number" }}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.discount}
                  name="discount"
                  error={!!touched.discount && !!errors.discount}
                  helperText={touched.discount && errors.discount}
                  sx={{ gridColumn: "span 4" }}
                />
                <FormControl fullWidth>
                  <InputLabel>Is Percent</InputLabel>
                  <Select
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.is_percent}
                    name="is_percent"
                    error={!!touched.is_percent && !!errors.is_percent}
                    helperText={touched.is_percent && errors.is_percent}
                    label="Percent"
                  >
                    <MenuItem value={false}>FALSE</MenuItem>
                    <MenuItem value={true}>TRUE</MenuItem>
                  </Select>
                </FormControl>
                {/* <InputLabel>Coupon expiry date</InputLabel> */}
                <TextField
                  fullWidth
                  variant="filled"
                  type="date"
                  label="Expiry date"
                  // inputProps={{ type: "date" }}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.expiry}
                  name="expiry"
                  error={!!touched.expiry && !!errors.expiry}
                  helperText={touched.expiry && errors.expiry}
                  sx={{ gridColumn: "span 4" }}
                />
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
                  Add Coupon
                </Button>
              </Box>
            </form>
          )}
        </Formik>
      </Box>
    );
  };
  
  export default AddCoupon;
  