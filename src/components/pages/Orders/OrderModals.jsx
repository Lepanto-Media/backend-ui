import {
  Box,
  Button,
  FormControl,
  InputLabel,
  Modal,
  Select,
  TextField,
  MenuItem,
} from "@mui/material";
import { Formik, FieldArray, Field } from "formik";
import * as yup from "yup";
import { AUTH_TOKEN } from "../../global/constants";

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

export function EditModal({ item, open, handleClose, handleEdit }) {
  const initialValues = {
    status: item.status,
    admin_notes: item.admin_notes || [],
  };

  const categorySchema = yup.object().shape({
    status: yup.string().required("Required"),
    admin_notes: yup.array().required("Required"),
  });

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Formik
          initialValues={initialValues}
          validationSchema={categorySchema}
          onSubmit={handleEdit}
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
              <Box display="flex" flexDirection="column" gap={2}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.status}
                    name="status"
                    error={!!touched.status && !!errors.status}
                    helperText={touched.status && errors.status}
                    label="Status"
                  >
                    <MenuItem value="NEW">NEW</MenuItem>
                    <MenuItem value="INPROGRESS">INPROGRESS</MenuItem>
                    <MenuItem value="DONE">DONE</MenuItem>
                    <MenuItem value="CANCELED"> CANCELED</MenuItem>
                  </Select>
                </FormControl>

                <FieldArray name="admin_notes">
                  {({ push, remove }) => (
                    <>
                      {values.admin_notes.map((note, index) => (
                        <Box
                          key={index}
                          display="flex"
                          alignItems="center"
                          gap={2}
                        >
                          <Field
                            as={TextField}
                            fullWidth
                            variant="filled"
                            type="text"
                            label={`Admin Note ${index + 1}`}
                            name={`admin_notes.${index}`}
                          />
                          <Button
                            type="button"
                            variant="outlined"
                            onClick={() => remove(index)}
                          >
                            Remove
                          </Button>
                        </Box>
                      ))}
                      <Button
                        type="button"
                        variant="outlined"
                        onClick={() => push("")}
                      >
                        Add Note
                      </Button>
                    </>
                  )}
                </FieldArray>
              </Box>

              <Box display="flex" justifyContent="end" mt={2}>
                <Button type="submit" color="secondary" variant="contained">
                  Update Order
                </Button>
              </Box>
            </form>
          )}
        </Formik>
      </Box>
    </Modal>
  );
}
