import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Grid,
  Snackbar,
  Typography,
} from "@mui/material";
import axios from "axios";
import { Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import Header from "../../components/Header";

const BlogView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blogData, setBlogData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        const response = await axios.get(
          `https://admin.pfimage.hasthiya.org/blog/getById/${id}`
        );
        setBlogData(response.data.data);
        setImagePreview(response.data.data.imageURL);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
        setSnackbarMessage("Error fetching blog data");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    };

    fetchBlogData();
  }, [id]);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    const formData = new FormData();
    formData.append("topic", values.topic);
    formData.append("description", values.description);
    if (imageFile) {
      formData.append("imageURL", imageFile);
    }

    try {
      await axios.put(
        `https://admin.pfimage.hasthiya.org/blog/update/${id}`,
        formData
      );
      setSnackbarMessage("Blog updated successfully");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setTimeout(() => {
        navigate("/blog");
      }, 2000);
    } catch (error) {
      setSnackbarMessage("Error updating blog");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setImageFile(file);
    if (file) {
      const previewURL = URL.createObjectURL(file);
      setImagePreview(previewURL);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">Error fetching data</Typography>;

  const validationSchema = Yup.object({
    topic: Yup.string().required("Topic is required"),
    description: Yup.string().required("Description is required"),
  });

  const renderGridItem = (label, value, component = null, error = null) => (
    <>
      <Grid item xs={2}>
        <Typography variant="body1" fontWeight="bold">
          {label}
        </Typography>
      </Grid>
      <Grid item xs={1}>
        <Typography variant="body1">:</Typography>
      </Grid>
      <Grid item xs={9}>
        {component || <Typography variant="body1">{value}</Typography>}
        {error && (
          <Typography
            variant="caption"
            color="error"
            sx={{ fontSize: "0.9rem" }}
          >
            {error}
          </Typography>
        )}
      </Grid>
    </>
  );

  return (
    <Box m="20px" height="80vh" overflow="auto" paddingRight="20px">
      <Header title={`Edit Blog ID: ${id}`} subtitle="" />

      {blogData && (
        <Formik
          initialValues={{
            topic: blogData.topic,
            description: blogData.description,
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            values,
            touched,
            errors,
            handleChange,
            handleBlur,
            isSubmitting,
          }) => (
            <Form encType="multipart/form-data">
              <Grid container spacing={2}>
                {renderGridItem("ID", blogData.id)}

                {renderGridItem(
                  "Topic",
                  null,
                  <Field
                    name="topic"
                    as="textarea"
                    style={{
                      width: "100%",
                      padding: "8px",
                      borderRadius: "4px",
                      fontSize: "14px",
                    }}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.topic}
                  />,
                  touched.topic && errors.topic
                )}

                {renderGridItem(
                  "Description",
                  null,
                  <Field
                    name="description"
                    as="textarea"
                    style={{
                      width: "100%",
                      padding: "8px",
                      borderRadius: "4px",
                      fontSize: "14px",
                    }}
                    rows={6}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.description}
                  />,
                  touched.description && errors.description
                )}

                {renderGridItem(
                  "Image",
                  null,
                  <>
                    <Button
                      variant="contained"
                      component="label"
                      color="secondary"
                    >
                      Select Image
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={handleFileChange}
                      />
                    </Button>
                    {imageFile && <Typography>{imageFile.name}</Typography>}
                  </>
                )}

                <Grid item xs={12}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Image Preview
                  </Typography>
                  <Box display="flex" justifyContent="center" mt={2}>
                    <img
                      src={imagePreview}
                      alt="Blog Preview"
                      style={{
                        width: "20%",
                        height: "20%",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                  </Box>
                </Grid>
              </Grid>

              <Box display="flex" justifyContent="end" mt="20px">
                <Button
                  type="submit"
                  color="secondary"
                  variant="contained"
                  size="large"
                  disabled={isSubmitting}
                  startIcon={
                    isSubmitting ? <CircularProgress size={20} /> : null
                  }
                >
                  <strong>Update Blog</strong>
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      )}

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

export default BlogView;
