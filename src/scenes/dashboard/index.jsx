import { Box, useTheme } from "@mui/material";
import Header from "../../components/Header";
import { tokens } from "../../theme";
const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box m="20px" height="80vh" overflow="auto" paddingRight="20px">
      <Box>
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />

        <Box>
          {/* <Link to="/changepw">
            {" "}
            <Button
              sx={{
                backgroundColor: colors.greenAccent[500],
                color: colors.grey[100],
                fontSize: "14px",

                fontWeight: "bold",
                padding: "10px 20px",
              }}
            >
              <DownloadOutlinedIcon sx={{ mr: "10px" }} />
              Change Password
            </Button>
          </Link> */}
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
