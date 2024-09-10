import AddIcon from "@mui/icons-material/Add";
import ImageIcon from "@mui/icons-material/Image";
import RemoveIcon from "@mui/icons-material/Remove";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { FieldArray, Formik } from "formik";
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
      formData.append("title", values.title);
      formData.append("link", values.link);
      formData.append("desc", values.desc);
      formData.append("imageURL", values.imageURL);
      formData.append("keywords", JSON.stringify(values.keywords));

      const token = localStorage.getItem("accessToken");

      const response = await fetch(
        "https://admin.pfimage.hasthiya.org/movie/create",
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
        console.log("Movie created successfully:", responseData);
        setSnackbarMessage("Movie created successfully!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);

        setPreviewImage(null);
        resetForm();
        setTimeout(() => {
          navigate("/movie");
        }, 2000);
      } else {
        const errorData = await response.json();
        console.error("Error creating movie:", errorData);
        setSnackbarMessage("Error creating movie: " + errorData.message);
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error("Error creating movie:", error);
      setSnackbarMessage("Error creating movie: " + error.message);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box m="20px" height="80vh" overflow="auto" paddingRight="20px">
      <Header title="CREATE NEW MOVIE" subtitle="Add a new movie" />

      <Formik
        initialValues={{
          title: "",
          link: "",
          desc: "",
          imageURL: null,
          keywords: [""], // Initialize with one empty keyword field
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
                variant="filled"
                label="Title"
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
                variant="filled"
                label="Link"
                name="link"
                value={values.link}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!touched.link && !!errors.link}
                helperText={touched.link && errors.link}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                multiline
                variant="filled"
                rows={6}
                label="Description"
                name="desc"
                value={values.desc}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!touched.desc && !!errors.desc}
                helperText={touched.desc && errors.desc}
                sx={{ gridColumn: "span 4" }}
              />
              <FieldArray
                name="keywords"
                render={(arrayHelpers) => (
                  <Box sx={{ gridColumn: "span 4" }}>
                    {values.keywords.map((keyword, index) => (
                      <Box
                        key={index}
                        display="flex"
                        alignItems="center"
                        mb="10px"
                      >
                        <TextField
                          fullWidth
                          variant="filled"
                          name={`keywords.${index}`}
                          value={keyword}
                          onChange={handleChange}
                          label="Keyword"
                          onBlur={handleBlur}
                          error={
                            !!touched.keywords && !!errors.keywords?.[index]
                          }
                          helperText={
                            touched.keywords && errors.keywords?.[index]
                          }
                          sx={{ marginRight: "10px" }}
                        />
                        <IconButton
                          color="secondary"
                          onClick={() => arrayHelpers.remove(index)}
                        >
                          <RemoveIcon />
                        </IconButton>
                      </Box>
                    ))}
                    <Button
                      type="button"
                      variant="contained"
                      color="secondary"
                      startIcon={<AddIcon />}
                      onClick={() => arrayHelpers.push("")}
                    >
                      Add New Keyword
                    </Button>
                  </Box>
                )}
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
                    Select Movie Image
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
                <strong>Create New Movie</strong>
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
  link: yup.string().url("Must be a valid URL").required("Link is required"),
  desc: yup.string().required("Description is required"),
  imageURL: yup.mixed().required("Image is required"),
  keywords: yup.array().of(yup.string().required("Keyword is required")),
});

export default Form;
