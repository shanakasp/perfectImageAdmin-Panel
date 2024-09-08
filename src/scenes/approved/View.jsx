import {
  Alert,
  Box,
  CircularProgress,
  Grid,
  Snackbar,
  Typography,
  useTheme,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/Header";
import { tokens } from "../../theme";

const View = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const token = localStorage.getItem("accessToken");
  const colors = tokens(theme.palette.mode);
  const [castingData, setCastingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitting2, setIsSubmitting2] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    const fetchCastingData = async () => {
      try {
        const response = await axios.get(
          `https://admin.kid.hasthiya.org/casting/getCasting/${id}`
        );
        setCastingData(response.data.casting);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchCastingData();
  }, [id]);

  const handleStatusChange = async () => {
    setIsSubmitting(true);
    try {
      await axios.patch(
        `https://admin.kid.hasthiya.org/admin/castingAdminApproval/${id}/approved`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSnackbarSeverity("success");
      setSnackbarMessage("Status successfully changed to Approved.");
      setTimeout(() => {
        navigate("/pending");
      }, 2000);
    } catch (err) {
      setSnackbarSeverity("error");
      setSnackbarMessage("Failed to change status.");
    } finally {
      setSnackbarOpen(true);
      setIsSubmitting(false);
    }
  };

  const handleStatusChangeReject = async () => {
    setIsSubmitting2(true);
    try {
      await axios.patch(
        `https://admin.kid.hasthiya.org/admin/castingAdminApproval/${id}/rejected`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSnackbarSeverity("success");
      setSnackbarMessage("Status successfully changed to Rejected.");
      setTimeout(() => {
        navigate("/pending");
      }, 2000);
    } catch (err) {
      setSnackbarSeverity("error");
      setSnackbarMessage("Failed to change status.");
    } finally {
      setSnackbarOpen(true);
      setIsSubmitting2(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">Error fetching data</Typography>;

  const renderGridItem = (label, value) => (
    <>
      <Grid item xs={2}>
        <Typography variant="body1">{label}</Typography>
      </Grid>
      <Grid item xs={1}>
        <Typography variant="body1">:</Typography>
      </Grid>
      <Grid item xs={9}>
        <Typography variant="body1">{value}</Typography>
      </Grid>
    </>
  );

  const parseEthnicity = (ethnicity) => {
    if (!ethnicity) return "N/A";

    if (ethnicity.startsWith("[") && ethnicity.endsWith("]")) {
      try {
        const parsedEthnicity = JSON.parse(ethnicity);
        return Array.isArray(parsedEthnicity)
          ? parsedEthnicity.join(", ")
          : ethnicity;
      } catch (error) {
        console.error("Error parsing ethnicity:", error);
        return ethnicity;
      }
    }

    return ethnicity;
  };

  return (
    <Box m="20px" height="80vh" overflow="auto" paddingRight="20px">
      <Header
        title={`VIEW APPROVED CASTING ID ${id}`}
        subtitle="View Each Approved Casting Detail"
      />
      {castingData && (
        <Grid container spacing={2}>
          {renderGridItem("Caller Job Title", castingData.callerJobTitle)}
          {renderGridItem("Audition Type", castingData.auditionType)}
          {renderGridItem("Area", castingData.area)}
          {renderGridItem("Category", castingData.category)}
          {renderGridItem("Short Description", castingData.shortDesc)}
          {renderGridItem("Zip Code", castingData.zipCode)}
          {renderGridItem("Expiration Date", castingData.expirationDate)}
          {renderGridItem("Status", castingData.status || "N/A")}
          {renderGridItem("Company Name", castingData.companyName)}
          {renderGridItem("Admin Status", castingData.adminStatus)}
          {renderGridItem("Amount", castingData.amount)}
          {renderGridItem("Period", castingData.period)}
          {renderGridItem(
            "Created At",
            new Date(castingData.createdAt).toLocaleString()
          )}
          {renderGridItem(
            "Updated At",
            new Date(castingData.updatedAt).toLocaleString()
          )}

          {castingData.roles.map((role, index) => (
            <React.Fragment key={role.id}>
              <Grid item xs={12}>
                <Typography variant="h6" color={colors.greenAccent[500]}>
                  Role {index + 1}
                </Typography>
              </Grid>
              {renderGridItem("Casting Role", role.castingRole)}
              {renderGridItem("Casting Type", role.castingType)}
              {renderGridItem("Title", role.title)}
              {renderGridItem("Description", role.description || "N/A")}
              {renderGridItem("Age Min", role.ageMin)}
              {renderGridItem("Age Max", role.ageMax)}
              {renderGridItem("Ethnicity", parseEthnicity(role.ethinicity))}
              {renderGridItem("Gender", role.gender)}
            </React.Fragment>
          ))}
        </Grid>
      )}
      {/* 
      <Box display="flex" justifyContent="end" m="20px">
        <Button
          type="submit"
          color="secondary"
          variant="contained"
          style={{ marginRight: "20px" }}
          size="large"
          disabled={isSubmitting}
          startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
          onClick={handleStatusChange}
        >
          <strong>Change Status to Approve</strong>
        </Button>
        <Button
          type="submit"
          color="secondary"
          variant="contained"
          size="large"
          disabled={isSubmitting2}
          startIcon={isSubmitting2 ? <CircularProgress size={20} /> : null}
          onClick={handleStatusChangeReject}
        >
          <strong>Change Status to Reject</strong>
        </Button>
      </Box> */}

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

export default View;
