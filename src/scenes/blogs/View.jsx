import {
  Box,
  CircularProgress,
  Grid,
  Snackbar,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../../components/Header";

const BlogView = () => {
  const { id } = useParams();
  const [blogData, setBlogData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        const response = await axios.get(
          `https://admin.pfimage.hasthiya.org/blog/getById/${id}`
        );
        setBlogData(response.data.data);
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">Error fetching data</Typography>;

  const renderGridItem = (label, value) => (
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
        <Typography variant="body1">{value}</Typography>
      </Grid>
    </>
  );

  return (
    <Box m="20px" height="80vh" overflow="auto" paddingRight="20px">
      <Header title={`View Blog ID: ${id}`} subtitle="" />

      {blogData && (
        <Grid container spacing={2}>
          {renderGridItem("ID", blogData.id)}
          {renderGridItem("Topic", blogData.topic)}
          {renderGridItem("Description", blogData.description)}
          {renderGridItem("Created At", formatDate(blogData.createdAt))}
          {renderGridItem("Updated At", formatDate(blogData.updatedAt))}

          <Grid item xs={8}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Image
            </Typography>
            <Box display="flex" justifyContent="center" mt={2}>
              <img
                src={blogData.imageURL}
                alt="Blog"
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
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default BlogView;
