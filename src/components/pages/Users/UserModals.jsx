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
  useMediaQuery,
  MenuItem,
  ImageListItemBar,
  IconButton,
} from "@mui/material";
import { Formik } from "formik";
import { useState } from "react";
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
            {item.first_name} {item.last_name}?
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
  const [imageData, setImageData] = useState(item?.images);
  const token = localStorage.getItem(AUTH_TOKEN);

  const handleImageUpload = (files) => {
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
        const newImages = [...imageData, ...response.data.data.images];
        setImageData(newImages);
      })
      .catch((error) => {
        setMessage({
          visible: true,
          message: error.response.data.message,
        });
      });
  };
  const handleImageDelete = (key) => {
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
        const newArray = imageData.filter((item) => item.key !== key);
        setImageData(newArray);
      })
      .catch((error) => {
        setMessage({
          visible: true,
          message: error.response.data.message,
        });
      });
  };

  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const initialValues = {
    first_name: item.first_name,
    last_name: item.last_name,
    email: item.email,
    active: item.active,
    phone_number: item.phone_number,
    password: "",
  };

  const categorySchema = yup.object().shape({
    first_name: yup.string().required("Required"),
    email: yup.string().required("Required"),
    active: yup.boolean().required("Required"),
  });
  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Formik
          onSubmit={handleEdit}
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
                />
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Phone Number"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.phone_number}
                  name="phone_number"
                  error={!!touched.phone_number && !!errors.phone_number}
                  helperText={touched.phone_number && errors.phone_number}
                />
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="New Password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.password}
                  name="password"
                  // error={!!touched.phone_number && !!errors.phone_number}
                  // helperText={touched.phone_number && errors.phone_number}
                />
                {/* <FormControl fullWidth>
                    <InputLabel>Percent</InputLabel>
                    <Select
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.percent}
                      name="percent"
                      error={!!touched.percent && !!errors.percent}
                      helperText={touched.percent && errors.percent}
                      label="Percent"
                    >
                      <MenuItem value={false}>False</MenuItem>
                      <MenuItem value={true}>True</MenuItem>
                    </Select>
                  </FormControl> */}
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
                {/* Image Uploader */}
                {/* <Button
                    component="label"
                    variant="contained"
                    startIcon={<CloudUploadIcon />}
                    sx={{ width: "100%" }}
                  >
                    Upload Images
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
              {/* Images Viewer */}
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
                  Update User
                </Button>
              </Box>
            </form>
          )}
        </Formik>
      </Box>
    </Modal>
  );
}
