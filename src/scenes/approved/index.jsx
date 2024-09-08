import { Visibility as VisibilityIcon } from "@mui/icons-material";
import { Box, IconButton, Tooltip, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import Header from "../../components/Header";
import { tokens } from "../../theme";

const FormsUser = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const token = localStorage.getItem("accessToken");
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://admin.kid.hasthiya.org/casting/getCastingsListByStatus/approved",
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

      if (!Array.isArray(responseData.castings)) {
        throw new Error("Response data is not an array");
      }
      const mappedData = responseData.castings.map((item) => ({
        id: item.id,
        title: item.title,
        category: item.category,
        contactNo: item.contactNo,
        companyName: item.companyName,
        expirationDate: item.expirationDate,
        roleCount: item.roleCount,
        createdAt: item.createdAt,
      }));

      setData(mappedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleDeleteClick = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this casting!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Delete",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(
            `https://admin.kid.hasthiya.org/casting/deleteCasting/${id}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (!response.ok) {
            throw new Error("Failed to delete casting");
          }
          const updatedData = data.filter((item) => item.id !== id);
          setData(updatedData);
          Swal.fire(
            "Deleted!",
            "The casting record has been deleted.",
            "success"
          );
        } catch (error) {
          console.error("Error deleting casting record:", error);
          Swal.fire("Error!", "Failed to delete casting record.", "error");
        }
      }
    });
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5, sortable: true },
    {
      field: "companyName",
      headerName: "Company Name",
      flex: 1,
      sortable: true,
    },
    { field: "title", headerName: "Title", flex: 1, sortable: true },
    { field: "category", headerName: "Category", flex: 1, sortable: true },
    {
      field: "contactNo",
      headerName: "Contact No",
      flex: 1,
      sortable: true,
    },

    {
      field: "expirationDate",
      headerName: "Expiration Date",
      flex: 1,
      sortable: true,
    },
    { field: "roleCount", headerName: "Role Count", flex: 0.5, sortable: true },
    {
      field: "createdAt",
      headerName: "Created At",
      flex: 1,
      sortable: true,
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
      width: 120,
      renderCell: (params) => (
        <Box>
          <Tooltip title="View">
            <Link to={`/casting/approved/view/${params.row.id}`}>
              <IconButton>
                <VisibilityIcon />
              </IconButton>
            </Link>
          </Tooltip>
          {/* <Tooltip title="Delete">
            <IconButton onClick={() => handleDeleteClick(params.row.id)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip> */}
        </Box>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header
        title="Approved Casting Logs"
        subtitle="List of all approved castings."
      />

      <Box
        m="0 0 0 0"
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

          "& .MuiDataGrid-virtualScroller::-webkit-scrollbar": {
            height: "8px",
            width: "8px",
          },
          "& .MuiDataGrid-virtualScroller::-webkit-scrollbar-track": {
            background: colors.primary[400],
          },
          "& .MuiDataGrid-virtualScroller::-webkit-scrollbar-thumb": {
            backgroundColor: colors.blueAccent[600],
            borderRadius: "4px",
          },
          "& .MuiDataGrid-virtualScroller::-webkit-scrollbar-thumb:hover": {
            background: colors.blueAccent[700],
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
          rowsPerPageOptions={[10, 20, 50, 100]}
          pagination
          autoHeight={false}
          scrollbarSize={8}
        />
      </Box>
    </Box>
  );
};

export default FormsUser;
