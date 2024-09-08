import ImageIcon from "@mui/icons-material/Image";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Snackbar,
  TextField,
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Formik } from "formik";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import Header from "../../../components/Header";

const Form = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [previewImage, setPreviewImage] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const navigate = useNavigate();

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

  const handleFormSubmit = async (values, { resetForm }) => {
    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("start_date", values.start_date);
      formData.append("end_date", values.end_date);
      formData.append("status", values.status);
      formData.append("imageUrl", values.image);

      const token = localStorage.getItem("accessToken");

      const response = await fetch(
        "https://hitprojback.hasthiya.org/project/create",
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
        console.log("Project created successfully:", responseData);
        setSnackbarMessage("Project created successfully!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);

        setPreviewImage(null);
        setTimeout(() => {
          navigate("/project");
        }, 3000);
      } else {
        const errorData = await response.json();
        console.error("Error creating project:", errorData);
        setSnackbarMessage("Error creating project: " + errorData.message);
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error("Error creating project:", error);
      setSnackbarMessage("Error creating project: " + error.message);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box m="20px" height="80vh" overflow="auto" paddingRight="20px">
      <Header title="CREATE NEW PROJECT" subtitle="Create a project" />

      <Formik
        initialValues={{
          title: "",
          description: "",
          start_date: "",
          end_date: "",
          status: "",
          image: null,
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
                label="Title of the Project"
                name="title"
                value={values.title}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!touched.title && !!errors.title}
                helperText={touched.title && errors.title}
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
              <TextField
                fullWidth
                variant="filled"
                type="date"
                label="Start Date (mm/dd/yyyy)"
                name="start_date"
                value={values.start_date}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!touched.start_date && !!errors.start_date}
                helperText={touched.start_date && errors.start_date}
                InputLabelProps={{ shrink: true }}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="date"
                label="End Date (mm/dd/yyyy)"
                name="end_date"
                value={values.end_date}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!touched.end_date && !!errors.end_date}
                helperText={touched.end_date && errors.end_date}
                InputLabelProps={{ shrink: true }}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                select
                variant="filled"
                label="Status"
                name="status"
                value={values.status}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!touched.status && !!errors.status}
                helperText={touched.status && errors.status}
                sx={{ gridColumn: "span 4" }}
              >
                <MenuItem value="Planned">Planned</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
              </TextField>
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
                    Select Project Image
                  </Button>
                </label>

                {previewImage && (
                  <img
                    src={previewImage}
                    alt="Preview"
                    style={{ width: 200, height: 200, gridColumn: "span 4" }}
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
                <strong>Create New Project</strong>
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
  title: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),
  start_date: yup.date().required("Start date is required"),
  end_date: yup
    .date()
    .required("End date is required")
    .test("is-after", "End date must be after start date", function (value) {
      const { start_date } = this.parent;
      return value > start_date;
    })
    .test(
      "is-not-same",
      "End date cannot be the same as start date",
      function (value) {
        const { start_date } = this.parent;
        return value !== start_date;
      }
    ),
  status: yup.string().required("Status is required"),
  // image: yup.mixed().required("Image is required"),
});

export default Form;
