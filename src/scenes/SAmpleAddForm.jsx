import ImageIcon from "@mui/icons-material/Image";
import {
  Box,
  Button,
  CircularProgress,
  Snackbar,
  TextField,
  useTheme,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import useMediaQuery from "@mui/material/useMediaQuery";
import axios from "axios";
import { Formik } from "formik";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import Header from "../../components/Header";
import { tokens } from "../../theme";

const Form = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const token = localStorage.getItem("accessToken");
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();
  const [previewImage, setPreviewImage] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");

  const handleImageChange = (event, setFieldValue) => {
    const file = event.currentTarget.files[0];
    setFieldValue("image", file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
  };

  const handleFormSubmit = (values, { setSubmitting }) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("university", values.university);
    formData.append("earlier_company", values.earlier_company);
    formData.append("imageUrl", values.image);

    axios
      .post(
        "https://hitprojback.hasthiya.org/employee/createEmployee",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setSubmitting(false);
        if (response.data.success) {
          setAlertMessage("Employee created successfully!");
          setAlertSeverity("success");
          setOpenSnackbar(true);
          setTimeout(() => navigate("/employee"), 3000);
        } else {
          setAlertMessage(response.data.message || "Something went wrong!");
          setAlertSeverity("success");
          setOpenSnackbar(true);
          setTimeout(() => navigate("/employee"), 3000);
        }
      })
      .catch((error) => {
        setSubmitting(false);
        setAlertMessage("Failed to create employee!");
        setAlertSeverity("error");
        setOpenSnackbar(true);
      });
  };

  return (
    <Box m="20px" height="80vh" overflow="auto" paddingRight="20px">
      <Header title="CREATE NEW EMPLOYEE" subtitle="Create a New Employee" />
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          setFieldValue,
          isSubmitting,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              <TextField
                fullWidth
                variant="filled"
                label="Name of the Employee"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.name}
                name="name"
                error={!!touched.name && !!errors.name}
                helperText={touched.name && errors.name}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                label="Employee University"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.university}
                name="university"
                error={!!touched.university && !!errors.university}
                helperText={touched.university && errors.university}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                label="Previous Worked Companies"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.earlier_company}
                name="earlier_company"
                error={!!touched.earlier_company && !!errors.earlier_company}
                helperText={touched.earlier_company && errors.earlier_company}
                sx={{ gridColumn: "span 4" }}
              />
              <Box sx={{ gridColumn: "span 2" }}>
                <label htmlFor="image-upload">
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={(event) =>
                      handleImageChange(event, setFieldValue)
                    }
                    style={{ display: "none" }}
                  />
                  <Button
                    variant="contained"
                    component="span"
                    color="secondary"
                    startIcon={<ImageIcon />}
                  >
                    Add Employee Image
                  </Button>
                </label>
              </Box>
              {previewImage && (
                <img
                  src={previewImage}
                  alt="Preview"
                  style={{ width: 200, height: 200, marginLeft: "-95%" }}
                />
              )}
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button
                type="submit"
                color="secondary"
                variant="contained"
                size="large"
                disabled={isSubmitting}
                startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
              >
                <strong>
                  {isSubmitting ? "Creating..." : "Create New Employee"}
                </strong>
              </Button>
            </Box>
          </form>
        )}
      </Formik>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={5000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MuiAlert
          onClose={() => setOpenSnackbar(false)}
          severity={alertSeverity}
          elevation={6}
          variant="filled"
          sx={{ color: "#fff" }}
        >
          {alertSeverity === "success" ? "Success" : "Error"}
          <br />
          {alertMessage}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
};

const checkoutSchema = yup.object().shape({
  name: yup.string().required("Name of the Employee is required"),
  university: yup.string().required("Employee University is required"),
  earlier_company: yup
    .string()
    .required("Previous Worked Companies is required"),
  // image: yup.mixed().required("Image is required"),
});

const initialValues = {
  name: "",
  university: "",
  earlier_company: "",
  image: null,
};

export default Form;
