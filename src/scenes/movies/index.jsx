import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import { Box, Button, IconButton, Tooltip, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Header from "../../components/Header";
import { tokens } from "../../theme";

const FormsUser = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const token = localStorage.getItem("accessToken");
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://admin.pfimage.hasthiya.org/movie/getAll",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }
      const responseData = await response.json();
      if (
        !responseData.moviesData ||
        !Array.isArray(responseData.moviesData.data)
      ) {
        throw new Error("Response data is not in the expected format");
      }
      const mappedData = responseData.moviesData.data
        .map((item) => {
          return {
            id: item.id,
            title: item.title,
            description: item.desc,
            imageURL: item.imageURL,
            keywords: item.keywords,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
          };
        })
        .sort((a, b) => b.id - a.id);

      setData(mappedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleDeleteClick = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this movie!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Delete",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(
            `https://admin.pfimage.hasthiya.org/movie/delete/${id}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (!response.ok) {
            throw new Error("Failed to delete movie");
          }
          const updatedData = data.filter((item) => item.id !== id);
          setData(updatedData);
          Swal.fire("Deleted!", "The movie has been deleted.", "success");
        } catch (error) {
          console.error("Error deleting movie:", error);
          Swal.fire("Error!", "Failed to delete movie.", "error");
        }
      }
    });
  };

  const columns = [
    {
      field: "id",
      headerName: "ID",
      flex: 0.5,
      sortable: true,
    },
    {
      field: "title",
      headerName: "Title",
      flex: 1,
      sortable: true,
    },
    {
      field: "description",
      headerName: "Description",
      flex: 2,
      sortable: true,
    },
    {
      field: "keywords",
      headerName: "Keywords",
      flex: 1,
      sortable: true,
      renderCell: (params) => {
        const cleanedKeywords = params.value
          .map((keyword) =>
            keyword
              .replace(/^\["|"\]$/g, "")
              .replace(/^"|"$/g, "")
              .trim()
          )
          .join(", ");
        return <span>{cleanedKeywords}</span>;
      },
    },
    {
      field: "imageURL",
      headerName: "Image",
      flex: 1,
      renderCell: (params) => (
        <img
          src={params.value}
          alt="Movie"
          style={{
            width: 50,
            height: 50,
            borderRadius: "8px",
            objectFit: "cover",
          }}
        />
      ),
    },
    {
      field: "createdAt",
      headerName: "Created At",
      flex: 0.7,
      renderCell: (params) => {
        const date = new Date(params.row.createdAt);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();
        const formattedDate = `${day}/${month}/${year}`;
        return <span>{formattedDate}</span>;
      },
    },

    {
      field: "Actions",
      headerName: "Actions",
      width: 130,
      renderCell: (params) => (
        <Box display="flex">
          <Tooltip title="View">
            <Link to={`/movie/view/${params.row.id}`}>
              <IconButton>
                <VisibilityIcon />
              </IconButton>
            </Link>
          </Tooltip>
          <Tooltip title="Edit">
            <Link to={`/movie/edit/${params.row.id}`}>
              <IconButton>
                <EditIcon />
              </IconButton>
            </Link>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton onClick={() => handleDeleteClick(params.row.id)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Movies" subtitle="List of all movies" />
        <Button
          variant="contained"
          color="secondary"
          sx={{
            backgroundColor: "#6870fa",
            color: "white",
            fontSize: "12px",
            "&:hover": {
              backgroundColor: "#3e4396",
            },
          }}
          onClick={() => navigate("/movie/add")}
        >
          Add Movies
        </Button>
      </Box>
      <Box
        m="0px 0 0 0"
        height="65vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
            fontSize: "14px",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[800],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[900],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.green[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid
          rows={data}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          disableColumnFilter={false}
          disableColumnSelector={false}
          disableDensitySelector={false}
          rowHeight={75}
        />
      </Box>
    </Box>
  );
};

export default FormsUser;
