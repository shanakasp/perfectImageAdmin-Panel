import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Box, useTheme } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../../../components/Header";
import { tokens } from "../../../theme";

const ViewProject = () => {
  const { id } = useParams();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [project, setProject] = useState(null);
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
        setProject(response.data.data);
      } catch (error) {
        console.error("Error fetching the project data:", error);
      }
    };

    fetchProject();
  }, [id, token]);

  if (!project) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box
      m="20px"
      height="80vh"
      overflow="auto"
      paddingRight="20px"
      color={colors.greenAccent[500]}
    >
      <Header
        title={`VIEW PROJECT ID ${id}`}
        subtitle="View Each Project Detail"
      />

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
            Project Title
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>{project.title}</Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
            Project Description
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>{project.description}</Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
            Start Date (MM/DD/YYYY)
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            {new Date(project.start_date).toLocaleDateString()}
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
            End Date (MM/DD/YYYY)
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            {new Date(project.end_date).toLocaleDateString()}
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
            Status
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>{project.status}</Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
            Image
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {project.imageUrl ? (
            <img
              src={project.imageUrl}
              alt={project.title}
              style={{ width: "25%", height: "auto" }}
            />
          ) : (
            <Typography>No image available</Typography>
          )}
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default ViewProject;
