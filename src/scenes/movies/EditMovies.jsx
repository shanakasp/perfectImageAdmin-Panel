import ImageIcon from "@mui/icons-material/Image";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Grid,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import Header from "../../components/Header";

const validationSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  desc: Yup.string().required("Description is required"),
  link: Yup.string().url("Invalid URL").required("Link is required"),
  keywords: Yup.string().required("Keywords are required"),
});

const BlogView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blogData, setBlogData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        const response = await axios.get(
          `https://admin.pfimage.hasthiya.org/movie/getById/${id}`
        );
        if (response.data.status) {
          setBlogData(response.data.data);
          setImagePreview(response.data.data.imageURL);
        } else {
          throw new Error(response.data.message);
        }
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
        setSnackbarMessage("Error fetching blog data");
        setSnackbarOpen(true);
      }
    };

    fetchBlogData();
  }, [id]);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleImageButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("desc", values.desc);
    formData.append("link", values.link);
    formData.append(
      "keywords",
      JSON.stringify(
        values.keywords.split(",").map((keyword) => keyword.trim())
      )
    );
    if (selectedImage) {
      formData.append("imageURL", selectedImage);
    }

    try {
      const response = await axios.put(
        `https://admin.pfimage.hasthiya.org/movie/update/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data.status) {
        setSnackbarMessage("Blog updated successfully");
        setSnackbarOpen(true);
        setTimeout(() => {
          navigate("/movie");
        }, 2000);
      } else {
        throw new Error(response.data.message);
      }
    } catch (err) {
      setError(err);
      setSnackbarMessage("Error updating blog data");
      setSnackbarOpen(true);
    }
    setSubmitting(false);
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">Error fetching data</Typography>;

  return (
    <Box m="20px" height="80vh" overflow="auto" paddingRight="20px">
      <Header title={`Edit Blog ID: ${id}`} subtitle="" />

      <Box mt={4}>
        <Typography variant="h6" fontWeight="bold">
          Edit Blog
        </Typography>
        <Formik
          initialValues={{
            title: blogData?.title || "",
            desc: blogData?.desc || "",
            link: blogData?.link ? blogData.link.replace(/^"|"$/g, "") : "",
            keywords: JSON.parse(blogData?.keywords || "[]").join(", ") || "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, touched, errors, setFieldValue }) => (
            <Form>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Field
                    as={TextField}
                    fullWidth
                    label="Title"
                    name="title"
                    variant="outlined"
                    margin="normal"
                    error={touched.title && Boolean(errors.title)}
                    helperText={<ErrorMessage name="title" />}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Field
                    as={TextField}
                    fullWidth
                    label="Description"
                    name="desc"
                    variant="outlined"
                    margin="normal"
                    error={touched.desc && Boolean(errors.desc)}
                    helperText={<ErrorMessage name="desc" />}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Field
                    as={TextField}
                    fullWidth
                    label="Link"
                    name="link"
                    variant="outlined"
                    margin="normal"
                    error={touched.link && Boolean(errors.link)}
                    helperText={<ErrorMessage name="link" />}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Field
                    as={TextField}
                    fullWidth
                    label="Keywords (comma separated)"
                    name="keywords"
                    variant="outlined"
                    margin="normal"
                    error={touched.keywords && Boolean(errors.keywords)}
                    helperText={<ErrorMessage name="keywords" />}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ gridColumn: "span 2" }}>
                    <label htmlFor="image-upload">
                      <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<ImageIcon />}
                        onClick={handleImageButtonClick}
                      >
                        Select Image
                      </Button>
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={(event) => handleImageChange(event)}
                        style={{ display: "none" }}
                        ref={fileInputRef}
                      />
                    </label>

                    {errors.imageURL && touched.imageURL && (
                      <Typography color="error" sx={{ gridColumn: "span 4" }}>
                        {errors.imageURL}
                      </Typography>
                    )}

                    {imagePreview || blogData?.imageURL ? (
                      <img
                        src={imagePreview || blogData?.imageURL}
                        alt="Preview"
                        style={{
                          width: 200,
                          height: 200,
                          gridColumn: "span 4",
                          margin: "20px",
                        }}
                      />
                    ) : (
                      <Typography sx={{ gridColumn: "span 4" }}>
                        No image selected
                      </Typography>
                    )}
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box display="flex" justifyContent="end" mt="20px">
                    <Button
                      type="submit"
                      variant="contained"
                      color="secondary"
                      disabled={isSubmitting}
                    >
                      Update Blog
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
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
