import ImageIcon from "@mui/icons-material/Image";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Formik } from "formik";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import Header from "../../components/Header";

const Form = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [previewImage, setPreviewImage] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const navigate = useNavigate();

  const handleImageChange = (event, setFieldValue) => {
    const file = event.currentTarget.files[0];
    setFieldValue("imageURL", file); // Update imageURL field

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

  const handleFormSubmit = async (values, { resetForm }) => {
    try {
      const formData = new FormData();
      formData.append("topic", values.topic);
      formData.append("description", values.description);
      formData.append("imageURL", values.imageURL); // Send image file here

      const token = localStorage.getItem("accessToken");

      const response = await fetch(
        "https://admin.pfimage.hasthiya.org/blog/create",
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const responseData = await response.json();
        console.log("Blog created successfully:", responseData);
        setSnackbarMessage("Blog created successfully!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);

        setPreviewImage(null);
        resetForm();
        setTimeout(() => {
          navigate("/blog");
        }, 3000);
      } else {
        const errorData = await response.json();
        console.error("Error creating blog:", errorData);
        setSnackbarMessage("Error creating blog: " + errorData.message);
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error("Error creating blog:", error);
      setSnackbarMessage("Error creating blog: " + error.message);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box m="20px" height="80vh" overflow="auto" paddingRight="20px">
      <Header title="CREATE NEW BLOG" subtitle="Create a blog post" />

      <Formik
        initialValues={{
          topic: "",
          description: "",
          imageURL: null,
        }}
        validationSchema={checkoutSchema}
        onSubmit={handleFormSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          isSubmitting,
          setFieldValue,
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
                multiline
                variant="filled"
                label="Topic"
                name="topic"
                value={values.topic}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!touched.topic && !!errors.topic}
                helperText={touched.topic && errors.topic}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                multiline
                variant="filled"
                rows={6}
                label="Description"
                name="description"
                value={values.description}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!touched.description && !!errors.description}
                helperText={touched.description && errors.description}
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
                    Select Blog Image
                  </Button>
                </label>

                {errors.imageURL && touched.imageURL && (
                  <Typography color="error" sx={{ gridColumn: "span 4" }}>
                    {errors.imageURL}
                  </Typography>
                )}

                {previewImage && (
                  <img
                    src={previewImage}
                    alt="Preview"
                    style={{
                      width: 200,
                      height: 200,
                      gridColumn: "span 4",
                      margin: "20px",
                    }}
                  />
                )}
              </Box>
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
                <strong>Create New Blog</strong>
              </Button>
            </Box>
          </form>
        )}
      </Formik>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

const checkoutSchema = yup.object().shape({
  topic: yup.string().required("Topic is required"),
  description: yup.string().required("Description is required"),
  imageURL: yup.mixed().required("Image is required"),
});

export default Form;
