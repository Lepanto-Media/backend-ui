import React, { useEffect, useState } from "react";
import { Box, TextField, Button, useTheme, Typography } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { tokens } from "../../../theme";
import Logo from "../../../assets/logo.webp";
import axios from "axios";
import { AUTH_TOKEN, BASE_URL } from "../../global/constants";
import Toast from "../../global/Toast";

function Login() {
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [error, setError] = useState({
    visible: false,
    message: "",
  });

  const initialValues = {
    email: "judyjose008@gmail.com",
    password: "123",
  };

  const userSchema = yup.object().shape({
    email: yup.string().required("Email is required"),
    password: yup.string().required("Password is required"),
  });

  const handleFormSubmit = (values) => {
    let data = JSON.stringify(values);

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${BASE_URL}/auth/login`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        localStorage.setItem(AUTH_TOKEN, response.data.data.token);
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
        setError({
          visible: true,
          message: error.response.data.message,
        });
      });
  };

  useEffect(() => {
    setTimeout(() => {
      if (error.visible) {
        setError({
          visible: false,
          message: "",
        });
      }
    }, 5000);
  }, [error]);

  return (
    <Box
      height="100vh"
      width="100vw"
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{ backgroundColor: colors.primary[500] }}
      overflow="hidden"
    >
      <Box
        // m="100px 0 100px 100px"
        display="flex"
        flexDirection="column"
        gap="30px"
        justifyContent="center"
        alignItems="center"
        sx={{
          boxShadow: "0px 0px 19px -1px rgba(0,0,0,0.75)",
          height: "75%",
          width: {
            md: "50%",
            xs: "100%",
          },
        }}
        p="3em"
      >
        {/* <Typography variant="h1">Admin DashBoard</Typography> */}
        <Box component="img" src={Logo} />
        <Typography variant="h2">Lepanto Media</Typography>
        {error.visible && <Toast data={error} setState={setError} />}
        <Box
          display="flex"
          width="100%"
          justifyContent="center"
          alignItems="center"
        >
          <Formik
            onSubmit={handleFormSubmit}
            initialValues={initialValues}
            validationSchema={userSchema}
          >
            {({
              values,
              errors,
              touched,
              handleBlur,
              handleChange,
              handleSubmit,
            }) => (
              <form onSubmit={handleSubmit} style={{ width: "80%" }}>
                <Box
                  display="flex"
                  gap="30px"
                  flexDirection="column"
                  mt="20px"
                  justifyContent="center"
                  alignItems="center"
                >
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="e Mail"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.email}
                    name="email"
                    error={!!touched.email && !!errors.email}
                    helperText={touched.email && errors.username}
                  />
                  <TextField
                    fullWidth
                    variant="filled"
                    type="password"
                    label="Password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.password}
                    name="password"
                    error={!!touched.password && !!errors.password}
                    helperText={touched.password && errors.password}
                  />
                </Box>
                <Box display="flex" justifyContent="center" mt="20px">
                  <Button type="submit" color="secondary" variant="contained">
                    Login
                  </Button>
                </Box>
              </form>
            )}
          </Formik>
        </Box>
      </Box>
    </Box>
  );
}

export default Login;
