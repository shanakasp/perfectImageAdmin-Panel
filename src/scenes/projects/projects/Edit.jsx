import ImageIcon from "@mui/icons-material/Image";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import axios from "axios";
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import Header from "../../../components/Header";

const Form = () => {
  const { id } = useParams();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [previewImage, setPreviewImage] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [initialValues, setInitialValues] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axios.get(
          `https://hitprojback.hasthiya.org/project/getById/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const projectData = response.data.data;
        setInitialValues({
          title: projectData.title,
          description: projectData.description,
          start_date: projectData.start_date.split("T")[0],
          end_date: projectData.end_date.split("T")[0],
          status: projectData.status,
          image: null,
        });
        if (projectData.imageUrl) {
          setPreviewImage(projectData.imageUrl);
        }
      } catch (error) {
        console.error("Error fetching project data:", error);
      }
    };

    fetchProject();
  }, [id, token]);

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

  const handleFormSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("start_date", values.start_date);
      formData.append("end_date", values.end_date);
      formData.append("status", values.status);
      if (values.image) {
        formData.append("imageUrl", values.image);
      }

      const response = await fetch(
        `https://hitprojback.hasthiya.org/project/update/${id}`,
        {
          method: "PUT",
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const responseData = await response.json();
        console.log("Project updated successfully:", responseData);
        setSnackbarMessage("Project updated successfully!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);

        setPreviewImage(null);
        setTimeout(() => {
          navigate("/project");
        }, 2000);
      } else {
        const errorData = await response.json();
        console.error("Error updating project:", errorData);
        setSnackbarMessage("Error updating project: " + errorData.message);
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error("Error updating project:", error);
      setSnackbarMessage("Error updating project: " + error.message);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  if (!initialValues) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box m="20px" height="80vh" overflow="auto" paddingRight="20px">
      <Header title="EDIT PROJECT" subtitle="Edit project details" />

      <Formik
        initialValues={initialValues}
        validationSchema={checkoutSchema}
        onSubmit={handleFormSubmit}
        enableReinitialize={true}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          isSubmitting,
          handleSubmit,
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
                label="Start Date"
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
                label="End Date"
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
              <label htmlFor="image-upload">
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={(event) => handleImageChange(event, setFieldValue)}
                  style={{ display: "none" }}
                />
                <Button
                  variant="contained"
                  component="span"
                  color="secondary"
                  startIcon={<ImageIcon />}
                >
                  Update Image
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
            <Box display="flex" justifyContent="end" mt="20px">
              <Button
                type="submit"
                color="secondary"
                variant="contained"
                size="large"
                disabled={isSubmitting}
                startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
              >
                <strong>Update Project</strong>
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
  title: yup.string().required("Required"),
  description: yup.string().required("Required"),
  start_date: yup.date().required("Required"),
  end_date: yup
    .date()
    .required("Required")
    .test("is-after", "End date must be after start date", function (value) {
      const { start_date } = this.parent;
      return new Date(value) > new Date(start_date);
    })
    .test(
      "not-same",
      "End date must be different from start date",
      function (value) {
        const { start_date } = this.parent;
        return new Date(value).getTime() !== new Date(start_date).getTime();
      }
    ),
  status: yup.string().required("Required"),
});

export default Form;
